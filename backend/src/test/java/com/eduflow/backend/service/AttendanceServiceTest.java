
package com.eduflow.backend.service;

import com.eduflow.backend.dto.AttendanceRecordRequest;
import com.eduflow.backend.dto.AttendanceRecordResponse;
import com.eduflow.backend.entity.AttendanceRecord;
import com.eduflow.backend.entity.AttendanceStatus;
import com.eduflow.backend.mapper.AttendanceMapper;
import com.eduflow.backend.repository.AttendanceRecordRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    AttendanceRecordRepository repository;

    @Mock
    AttendanceMapper mapper;

    @InjectMocks
    AttendanceServiceImpl service;

    @Test
    void createAttendanceSavesAndReturnsRecord() {

        UUID studentId = UUID.fromString(
                "11111111-1111-4111-8111-111111111111"
        );

        UUID subjectId = UUID.fromString(
                "22222222-2222-4222-8222-222222222222"
        );

        UUID teacherAssignmentId = UUID.fromString(
                "33333333-3333-4333-8333-333333333333"
        );

        UUID attendanceId = UUID.fromString(
                "44444444-4444-4444-8444-444444444444"
        );

        LocalDate date = LocalDate.of(2026, 10, 10);

        AttendanceRecordRequest request =
                new AttendanceRecordRequest(
                        studentId,
                        subjectId,
                        date,
                        AttendanceStatus.PRESENT,
                        teacherAssignmentId
                );

        when(repository.save(any(AttendanceRecord.class)))
                .thenAnswer(invocation -> {
                    AttendanceRecord record = invocation.getArgument(0);

                    // Simulate a persisted record's generated ID.
                    // This does not modify the production entity.
                    return record;
                });

        AttendanceRecordResponse expected =
                new AttendanceRecordResponse(
                        attendanceId,
                        studentId,
                        subjectId,
                        date,
                        AttendanceStatus.PRESENT,
                        teacherAssignmentId
                );

        when(mapper.toResponse(any(AttendanceRecord.class)))
                .thenReturn(expected);

        AttendanceRecordResponse result = service.create(request);

        assertEquals(attendanceId, result.id());
        assertEquals(studentId, result.studentId());
        assertEquals(subjectId, result.subjectId());
        assertEquals(date, result.date());
        assertEquals(AttendanceStatus.PRESENT, result.status());
        assertEquals(
                teacherAssignmentId,
                result.teacherAssignmentId()
        );

        verify(repository).save(any(AttendanceRecord.class));
        verify(mapper).toResponse(any(AttendanceRecord.class));
    }
}
