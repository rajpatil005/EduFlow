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
import java.util.List;
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

        if (!departmentRepository.existsById(departmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Department not found"
            );
        }

        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Teacher not found"
                ));

        if (!departmentId.equals(teacher.getDepartmentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Teacher does not belong to this department"
            );
        }

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

        currentAssignment.ifPresent(assignment -> {
            assignment.setEndedAt(Instant.now());
            assignmentRepository.save(assignment);
        });

        DepartmentHodAssignment newAssignment =
                new DepartmentHodAssignment();

        newAssignment.setDepartmentId(departmentId);
        newAssignment.setTeacherId(teacherId);
        newAssignment.setAssignedBy(assignedByUserId);
        newAssignment.setAssignedAt(Instant.now());

        DepartmentHodAssignment savedAssignment =
                assignmentRepository.save(newAssignment);

        return toResponse(savedAssignment, "HOD assigned successfully");
    }

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

    private void ensureDepartmentExists(UUID departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Department not found"
            );
        }
    }

    private String historyMessage(DepartmentHodAssignment assignment) {
        return assignment.getEndedAt() == null
                ? "Current HOD appointment"
                : "Previous HOD appointment";
    }

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