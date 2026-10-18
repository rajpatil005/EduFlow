package com.eduflow.backend.service;

import com.eduflow.backend.dto.response.HodAssignmentResponse;
import com.eduflow.backend.entity.DepartmentHodAssignment;
import com.eduflow.backend.entity.Teacher;
import com.eduflow.backend.repository.DepartmentHodAssignmentRepository;
import com.eduflow.backend.repository.DepartmentRepository;
import com.eduflow.backend.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentHodAssignmentService {

    private final DepartmentHodAssignmentRepository assignmentRepository;
    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;

    @Transactional
    public HodAssignmentResponse assignHod(
            UUID departmentId,
            UUID teacherId,
            UUID assignedByUserId) {

        // 1. Check that the department exists
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Department not found"
            );
        }

        // 2. Check that the teacher exists
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Teacher not found"
                ));

        // 3. Ensure the teacher belongs to this department
        if (!teacher.getDepartmentId().equals(departmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Teacher does not belong to this department"
            );
        }

        // 4. Check whether this teacher is already the active HOD
        var currentAssignment =
                assignmentRepository.findByDepartmentIdAndEndedAtIsNull(
                        departmentId
                );

        if (currentAssignment.isPresent()
                && currentAssignment.get().getTeacherId().equals(teacherId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This teacher is already the active HOD"
            );
        }

        // 5. End the previous HOD assignment, if one exists
        currentAssignment.ifPresent(assignment -> {
            assignment.setEndedAt(Instant.now());
            assignmentRepository.save(assignment);
        });

        // 6. Create the new HOD assignment
        DepartmentHodAssignment newAssignment =
                new DepartmentHodAssignment();

        newAssignment.setDepartmentId(departmentId);
        newAssignment.setTeacherId(teacherId);
        newAssignment.setAssignedBy(assignedByUserId);
        newAssignment.setAssignedAt(Instant.now());
        newAssignment.setEndedAt(null);

        DepartmentHodAssignment savedAssignment =
                assignmentRepository.save(newAssignment);

        // 7. Return the response
        return new HodAssignmentResponse(
                savedAssignment.getDepartmentId(),
                savedAssignment.getTeacherId(),
                savedAssignment.getAssignedBy(),
                savedAssignment.getAssignedAt(),
                "HOD assigned successfully"
        );
    }
}