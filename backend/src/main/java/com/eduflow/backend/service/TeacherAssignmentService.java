package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.TeacherAssignmentRequest;
import com.eduflow.backend.dto.response.TeacherAssignmentResponse;
import com.eduflow.backend.entity.TeacherAssignment;
import com.eduflow.backend.repository.TeacherAssignmentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeacherAssignmentService {

    private final TeacherAssignmentRepository assignmentRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public TeacherAssignmentResponse create(TeacherAssignmentRequest request) {
        String assignmentType = normalizeType(request.assignmentType());

        validateReferences(
                request.teacherId(),
                request.subjectId(),
                request.divisionId(),
                request.academicYearId()
        );

        checkDuplicate(
                request.subjectId(),
                request.divisionId(),
                request.academicYearId(),
                assignmentType,
                null
        );

        TeacherAssignment assignment = new TeacherAssignment();
        assignment.setTeacherId(request.teacherId());
        assignment.setSubjectId(request.subjectId());
        assignment.setDivisionId(request.divisionId());
        assignment.setAcademicYearId(request.academicYearId());
        assignment.setAssignmentType(assignmentType);

        return toResponse(saveAssignment(assignment));
    }

    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getAll() {
        return assignmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TeacherAssignmentResponse getById(UUID id) {
        return toResponse(findAssignment(id));
    }

    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getByTeacher(UUID teacherId) {
        return assignmentRepository.findByTeacherId(teacherId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getBySubject(UUID subjectId) {
        return assignmentRepository.findBySubjectId(subjectId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getByDepartment(UUID departmentId) {
        return assignmentRepository.findByTeacherDepartmentId(departmentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TeacherAssignmentResponse update(
            UUID id,
            TeacherAssignmentRequest request
    ) {
        TeacherAssignment assignment = findAssignment(id);
        String assignmentType = normalizeType(request.assignmentType());

        validateReferences(
                request.teacherId(),
                request.subjectId(),
                request.divisionId(),
                request.academicYearId()
        );

        checkDuplicate(
                request.subjectId(),
                request.divisionId(),
                request.academicYearId(),
                assignmentType,
                id
        );

        assignment.setTeacherId(request.teacherId());
        assignment.setSubjectId(request.subjectId());
        assignment.setDivisionId(request.divisionId());
        assignment.setAcademicYearId(request.academicYearId());
        assignment.setAssignmentType(assignmentType);

        return toResponse(saveAssignment(assignment));
    }

    @Transactional
    public void delete(UUID id) {
        TeacherAssignment assignment = findAssignment(id);

        Boolean hasAttendance = jdbcTemplate.queryForObject(
                """
                SELECT EXISTS (
                    SELECT 1
                    FROM attendance_records
                    WHERE teacher_assignment_id = ?
                )
                """,
                Boolean.class,
                id
        );

        if (Boolean.TRUE.equals(hasAttendance)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete an assignment that has attendance records"
            );
        }

        assignmentRepository.delete(assignment);
    }

    private TeacherAssignment findAssignment(UUID id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Teacher assignment not found"
                ));
    }

    private void validateReferences(
            UUID teacherId,
            UUID subjectId,
            UUID divisionId,
            UUID academicYearId
    ) {
        ensureExists("teachers", teacherId, "Teacher");
        ensureExists("subjects", subjectId, "Subject");
        ensureExists("divisions", divisionId, "Division");
        ensureExists("academic_years", academicYearId, "Academic year");

        Boolean compatible = jdbcTemplate.queryForObject(
                """
                SELECT EXISTS (
                    SELECT 1
                    FROM teachers t
                    JOIN subjects s ON s.id = ?
                    JOIN semesters sem ON sem.id = s.semester_id
                    JOIN programmes p ON p.id = sem.programme_id
                    JOIN divisions d ON d.id = ?
                    WHERE t.id = ?
                      AND d.semester_id = sem.id
                      AND t.department_id = p.department_id
                )
                """,
                Boolean.class,
                subjectId,
                divisionId,
                teacherId
        );

        if (!Boolean.TRUE.equals(compatible)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Teacher department, subject, and division must be compatible"
            );
        }
    }

    private void ensureExists(
            String table,
            UUID id,
            String label
    ) {
        Boolean exists = jdbcTemplate.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM " + table + " WHERE id = ?)",
                Boolean.class,
                id
        );

        if (!Boolean.TRUE.equals(exists)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    label + " not found"
            );
        }
    }

    private void checkDuplicate(
            UUID subjectId,
            UUID divisionId,
            UUID academicYearId,
            String assignmentType,
            UUID excludedId
    ) {
        boolean duplicate;

        if (excludedId == null) {
            duplicate =
                    assignmentRepository
                            .existsBySubjectIdAndDivisionIdAndAcademicYearIdAndAssignmentType(
                                    subjectId,
                                    divisionId,
                                    academicYearId,
                                    assignmentType
                            );
        } else {
            duplicate =
                    assignmentRepository
                            .existsBySubjectIdAndDivisionIdAndAcademicYearIdAndAssignmentTypeAndIdNot(
                                    subjectId,
                                    divisionId,
                                    academicYearId,
                                    assignmentType,
                                    excludedId
                            );
        }

        if (duplicate) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A teacher is already assigned to this subject, division, academic year, and assignment type"
            );
        }
    }

    private String normalizeType(String assignmentType) {
        if (assignmentType == null || assignmentType.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Assignment type is required"
            );
        }

        return assignmentType.trim().toUpperCase(Locale.ROOT);
    }

    private TeacherAssignment saveAssignment(TeacherAssignment assignment) {
        try {
            return assignmentRepository.saveAndFlush(assignment);
        } catch (DataIntegrityViolationException exception) {
            String message = exception.getMostSpecificCause().getMessage();

            if (message != null && message.contains("uq_teacher_assignment_slot")) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "A teacher is already assigned to this subject, division, academic year, and assignment type"
                );
            }

            throw exception;
        }
    }

    private TeacherAssignmentResponse toResponse(TeacherAssignment assignment) {
        return new TeacherAssignmentResponse(
                assignment.getId(),
                assignment.getTeacherId(),
                assignment.getSubjectId(),
                assignment.getDivisionId(),
                assignment.getAcademicYearId(),
                assignment.getAssignmentType()
        );
    }
}
