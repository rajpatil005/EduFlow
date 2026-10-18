package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.TeacherAssignmentRequest;
import com.eduflow.backend.dto.response.TeacherAssignmentResponse;
import com.eduflow.backend.entity.TeacherAssignment;
import com.eduflow.backend.repository.TeacherAssignmentRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherAssignmentServiceTest {

    @Mock
    TeacherAssignmentRepository assignmentRepository;

    @Mock
    JdbcTemplate jdbcTemplate;

    @InjectMocks
    TeacherAssignmentService service;

    @Test
    void createAssignmentSavesAndReturnsAssignment() {
        UUID teacherId = UUID.randomUUID();
        UUID subjectId = UUID.randomUUID();
        UUID divisionId = UUID.randomUUID();
        UUID academicYearId = UUID.randomUUID();
        UUID assignmentId = UUID.randomUUID();

        TeacherAssignmentRequest request = new TeacherAssignmentRequest(
                teacherId,
                subjectId,
                divisionId,
                academicYearId,
                " theory "
        );

        when(jdbcTemplate.queryForObject(
                contains("SELECT EXISTS"),
                eq(Boolean.class),
                any(UUID.class)
        )).thenReturn(true);

        when(jdbcTemplate.queryForObject(
                contains("SELECT EXISTS"),
                eq(Boolean.class),
                eq(subjectId),
                eq(divisionId),
                eq(teacherId)
        )).thenReturn(true);

        when(assignmentRepository
                .existsBySubjectIdAndDivisionIdAndAcademicYearIdAndAssignmentType(
                        subjectId, divisionId, academicYearId, "THEORY"
                )).thenReturn(false);

        when(assignmentRepository.saveAndFlush(any(TeacherAssignment.class)))
                .thenAnswer(invocation -> {
                    TeacherAssignment saved = invocation.getArgument(0);

                    return saved;
                });

        TeacherAssignmentResponse result = service.create(request);

        assertEquals(teacherId, result.teacherId());
        assertEquals(subjectId, result.subjectId());
        assertEquals(divisionId, result.divisionId());
        assertEquals(academicYearId, result.academicYearId());
        assertEquals("THEORY", result.assignmentType());

        verify(assignmentRepository).saveAndFlush(any(TeacherAssignment.class));
    }

    @Test
    void createAssignmentRejectsDuplicateSlot() {
        UUID teacherId = UUID.randomUUID();
        UUID subjectId = UUID.randomUUID();
        UUID divisionId = UUID.randomUUID();
        UUID academicYearId = UUID.randomUUID();

        TeacherAssignmentRequest request = new TeacherAssignmentRequest(
                teacherId,
                subjectId,
                divisionId,
                academicYearId,
                "THEORY"
        );

        when(jdbcTemplate.queryForObject(
                contains("SELECT EXISTS"),
                eq(Boolean.class),
                any(UUID.class)
        )).thenReturn(true);

        when(jdbcTemplate.queryForObject(
                contains("SELECT EXISTS"),
                eq(Boolean.class),
                eq(subjectId),
                eq(divisionId),
                eq(teacherId)
        )).thenReturn(true);

        when(assignmentRepository
                .existsBySubjectIdAndDivisionIdAndAcademicYearIdAndAssignmentType(
                        subjectId, divisionId, academicYearId, "THEORY"
                )).thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(request)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());

        verify(assignmentRepository, never())
                .saveAndFlush(any(TeacherAssignment.class));
    }

    @Test
    void createAssignmentRejectsIncompatibleReferences() {
        UUID teacherId = UUID.randomUUID();
        UUID subjectId = UUID.randomUUID();
        UUID divisionId = UUID.randomUUID();
        UUID academicYearId = UUID.randomUUID();

        TeacherAssignmentRequest request = new TeacherAssignmentRequest(
                teacherId,
                subjectId,
                divisionId,
                academicYearId,
                "THEORY"
        );

        when(jdbcTemplate.queryForObject(
                contains("SELECT EXISTS"),
                eq(Boolean.class),
                any(UUID.class)
        )).thenReturn(true);

            when(jdbcTemplate.queryForObject(
                contains("SELECT EXISTS"),
                eq(Boolean.class),
                eq(subjectId),
                eq(divisionId),
                eq(teacherId)
        )).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.create(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());

        verify(assignmentRepository, never())
                .saveAndFlush(any(TeacherAssignment.class));
    }

    @Test
    void deleteAssignmentWithAttendanceRecordsReturnsConflict() {
        UUID assignmentId = UUID.randomUUID();

        TeacherAssignment assignment = new TeacherAssignment();
        assignment.setTeacherId(UUID.randomUUID());
        assignment.setSubjectId(UUID.randomUUID());
        assignment.setDivisionId(UUID.randomUUID());
        assignment.setAcademicYearId(UUID.randomUUID());
        assignment.setAssignmentType("THEORY");

        when(assignmentRepository.findById(assignmentId))
                .thenReturn(java.util.Optional.of(assignment));

        when(jdbcTemplate.queryForObject(
                contains("SELECT EXISTS"),
                eq(Boolean.class),
                eq(assignmentId)
        )).thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.delete(assignmentId)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());

        verify(assignmentRepository, never())
                .delete(any(TeacherAssignment.class));
    }
}
