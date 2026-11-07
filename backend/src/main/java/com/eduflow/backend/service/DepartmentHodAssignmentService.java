
package com.eduflow.backend.service;

import com.eduflow.backend.dto.response.HodAssignmentResponse;
import com.eduflow.backend.entity.DepartmentHodAssignment;
import com.eduflow.backend.entity.Role;
import com.eduflow.backend.entity.Teacher;
import com.eduflow.backend.entity.User;
import com.eduflow.backend.repository.DepartmentHodAssignmentRepository;
import com.eduflow.backend.repository.DepartmentRepository;
import com.eduflow.backend.repository.TeacherRepository;
import com.eduflow.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentHodAssignmentService {

    private final DepartmentHodAssignmentRepository assignmentRepository;
    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @Transactional
    public HodAssignmentResponse assignHod(
            UUID departmentId,
            UUID teacherId,
            UUID assignedByUserId) {

        // 1. Check department exists
        ensureDepartmentExists(departmentId);

        // 2. Check teacher exists
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Teacher not found"
                ));

        // 3. Ensure teacher belongs to this department
        if (!departmentId.equals(teacher.getDepartmentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Teacher does not belong to this department"
            );
        }

        // 4. Find current active HOD assignment
        var currentAssignment =
                assignmentRepository.findByDepartmentIdAndEndedAtIsNull(
                        departmentId
                );

        // 5. Prevent assigning the same HOD again
        if (currentAssignment.isPresent()
                && currentAssignment.get().getTeacherId().equals(teacherId)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This teacher is already the active HOD"
            );
        }

        // 6. End previous HOD assignment and revert their role
        currentAssignment.ifPresent(assignment -> {

            assignment.setEndedAt(Instant.now());
            assignmentRepository.save(assignment);

            Teacher previousTeacher = teacherRepository
                    .findById(assignment.getTeacherId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Previous HOD teacher not found"
                    ));

            User previousUser = userRepository
                    .findById(previousTeacher.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Previous HOD user not found"
                    ));

            previousUser.changeRole(Role.TEACHER);
            userRepository.save(previousUser);
        });

        // 7. Find new HOD user account
        User newHodUser = userRepository
                .findById(teacher.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Teacher user account not found"
                ));

        // 8. Promote new teacher to HOD
        newHodUser.changeRole(Role.HOD);
        userRepository.save(newHodUser);

        // 9. Create new HOD assignment
        DepartmentHodAssignment newAssignment =
                new DepartmentHodAssignment();

        newAssignment.setDepartmentId(departmentId);
        newAssignment.setTeacherId(teacherId);
        newAssignment.setAssignedBy(assignedByUserId);
        newAssignment.setAssignedAt(Instant.now());
        newAssignment.setEndedAt(null);

        DepartmentHodAssignment savedAssignment =
                assignmentRepository.save(newAssignment);

        // 10. Return response
        return toResponse(savedAssignment, "HOD assigned successfully");
    }

    // Get current HOD
    @Transactional(readOnly = true)
    public HodAssignmentResponse getCurrentHod(UUID departmentId) {

        ensureDepartmentExists(departmentId);

        DepartmentHodAssignment assignment = assignmentRepository
                .findByDepartmentIdAndEndedAtIsNull(departmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No active HOD assigned to this department"
                ));

        return toResponse(assignment, "Current HOD");
    }

    // Get HOD assignment history
    @Transactional(readOnly = true)
    public List<HodAssignmentResponse> getHodHistory(UUID departmentId) {

        ensureDepartmentExists(departmentId);

        return assignmentRepository
                .findAllByDepartmentIdOrderByAssignedAtDesc(departmentId)
                .stream()
                .map(assignment ->
                        toResponse(assignment, historyMessage(assignment)))
                .toList();
    }

    // Common department validation
    private void ensureDepartmentExists(UUID departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Department not found"
            );
        }
    }

    // Generate history message
    private String historyMessage(DepartmentHodAssignment assignment) {

        return assignment.getEndedAt() == null
                ? "Current HOD appointment"
                : "Previous HOD appointment";
    }

    // Convert entity into response DTO
    private HodAssignmentResponse toResponse(
            DepartmentHodAssignment assignment,
            String message) {

        return new HodAssignmentResponse(
                assignment.getDepartmentId(),
                assignment.getTeacherId(),
                assignment.getAssignedBy(),
                assignment.getAssignedAt(),
                message
        );
    }
}
