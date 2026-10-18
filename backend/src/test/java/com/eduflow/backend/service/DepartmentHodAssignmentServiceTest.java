package com.eduflow.backend.service;

import com.eduflow.backend.dto.response.HodAssignmentResponse;
import com.eduflow.backend.entity.DepartmentHodAssignment;
import com.eduflow.backend.entity.Teacher;
import com.eduflow.backend.repository.DepartmentHodAssignmentRepository;
import com.eduflow.backend.repository.DepartmentRepository;
import com.eduflow.backend.repository.TeacherRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentHodAssignmentServiceTest {

    @Mock
    DepartmentHodAssignmentRepository assignmentRepository;

    @Mock
    DepartmentRepository departmentRepository;

    @Mock
    TeacherRepository teacherRepository;

    @InjectMocks
    DepartmentHodAssignmentService service;

    @Test
    void assignsHodWhenDepartmentHasNoCurrentHod() {
        UUID departmentId = UUID.randomUUID();
        UUID teacherId = UUID.randomUUID();
        UUID adminId = UUID.randomUUID();

        Teacher teacher = teacher(teacherId, departmentId);

        when(departmentRepository.existsById(departmentId)).thenReturn(true);
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(assignmentRepository.findByDepartmentIdAndEndedAtIsNull(departmentId))
                .thenReturn(Optional.empty());
        when(assignmentRepository.save(any(DepartmentHodAssignment.class)))
                .thenAnswer(invocation -> {
                    DepartmentHodAssignment saved = invocation.getArgument(0);
                    saved.setId(UUID.randomUUID());
                    return saved;
                });

        HodAssignmentResponse response =
                service.assignHod(departmentId, teacherId, adminId);

        assertEquals(departmentId, response.departmentId());
        assertEquals(teacherId, response.teacherId());
        assertEquals(adminId, response.assignedBy());
        assertNotNull(response.assignedAt());

        verify(assignmentRepository).save(any(DepartmentHodAssignment.class));
    }

    @Test
    void replacesPreviousHodAndPreservesOldAppointment() {
        UUID departmentId = UUID.randomUUID();
        UUID oldTeacherId = UUID.randomUUID();
        UUID newTeacherId = UUID.randomUUID();
        UUID adminId = UUID.randomUUID();

        DepartmentHodAssignment oldAssignment = new DepartmentHodAssignment();
        oldAssignment.setDepartmentId(departmentId);
        oldAssignment.setTeacherId(oldTeacherId);
        oldAssignment.setAssignedBy(UUID.randomUUID());

        Teacher newTeacher = teacher(newTeacherId, departmentId);

        when(departmentRepository.existsById(departmentId)).thenReturn(true);
        when(teacherRepository.findById(newTeacherId)).thenReturn(Optional.of(newTeacher));
        when(assignmentRepository.findByDepartmentIdAndEndedAtIsNull(departmentId))
                .thenReturn(Optional.of(oldAssignment));
        when(assignmentRepository.save(any(DepartmentHodAssignment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        HodAssignmentResponse response =
                service.assignHod(departmentId, newTeacherId, adminId);

        assertEquals(newTeacherId, response.teacherId());
        assertNotNull(oldAssignment.getEndedAt());

        verify(assignmentRepository, times(2))
                .save(any(DepartmentHodAssignment.class));
    }

    @Test
    void rejectsUnknownDepartment() {
        UUID departmentId = UUID.randomUUID();

        when(departmentRepository.existsById(departmentId)).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.assignHod(
                        departmentId, UUID.randomUUID(), UUID.randomUUID()
                )
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verifyNoInteractions(teacherRepository);
        verify(assignmentRepository, never()).save(any());
    }

    @Test
    void rejectsUnknownTeacher() {
        UUID departmentId = UUID.randomUUID();
        UUID teacherId = UUID.randomUUID();

        when(departmentRepository.existsById(departmentId)).thenReturn(true);
        when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.assignHod(
                        departmentId, teacherId, UUID.randomUUID()
                )
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(assignmentRepository, never()).save(any());
    }

    @Test
    void rejectsTeacherFromAnotherDepartment() {
        UUID departmentId = UUID.randomUUID();
        UUID otherDepartmentId = UUID.randomUUID();
        UUID teacherId = UUID.randomUUID();

        when(departmentRepository.existsById(departmentId)).thenReturn(true);
        when(teacherRepository.findById(teacherId))
                .thenReturn(Optional.of(teacher(teacherId, otherDepartmentId)));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.assignHod(
                        departmentId, teacherId, UUID.randomUUID()
                )
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(assignmentRepository, never()).save(any());
    }

    @Test
    void rejectsTeacherWhoIsAlreadyCurrentHod() {
        UUID departmentId = UUID.randomUUID();
        UUID teacherId = UUID.randomUUID();

        DepartmentHodAssignment current = new DepartmentHodAssignment();
        current.setDepartmentId(departmentId);
        current.setTeacherId(teacherId);

        when(departmentRepository.existsById(departmentId)).thenReturn(true);
        when(teacherRepository.findById(teacherId))
                .thenReturn(Optional.of(teacher(teacherId, departmentId)));
        when(assignmentRepository.findByDepartmentIdAndEndedAtIsNull(departmentId))
                .thenReturn(Optional.of(current));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.assignHod(
                        departmentId, teacherId, UUID.randomUUID()
                )
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(assignmentRepository, never()).save(any());
    }

    private Teacher teacher(UUID teacherId, UUID departmentId) {
        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setDepartmentId(departmentId);
        teacher.setUserId(UUID.randomUUID());
        teacher.setEmployeeId("EMP-" + teacherId);
        return teacher;
    }
}