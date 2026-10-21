package com.eduflow.backend.service;

import com.eduflow.backend.dto.StudentAttendanceSummaryResponse;
import com.eduflow.backend.entity.AttendanceRecord;
import com.eduflow.backend.entity.AttendanceStatus;
import com.eduflow.backend.repository.AttendanceRecordRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentAttendanceReportServiceTest {

    @Mock
    private AttendanceRecordRepository repository;

    @InjectMocks
    private StudentAttendanceReportService reportService;

    @Test
    void shouldCalculateAttendanceSummaryCorrectly() {
        UUID studentId = UUID.randomUUID();

        List<AttendanceRecord> records = List.of(
                createRecord(studentId, AttendanceStatus.PRESENT),
                createRecord(studentId, AttendanceStatus.PRESENT),
                createRecord(studentId, AttendanceStatus.ABSENT),
                createRecord(studentId, AttendanceStatus.LATE),
                createRecord(studentId, AttendanceStatus.EXCUSED)
        );

        when(repository.findByStudentId(studentId)).thenReturn(records);

        StudentAttendanceSummaryResponse result = reportService.getSummary(studentId);

        assertEquals(5, result.totalRecords());
        assertEquals(2, result.presentCount());
        assertEquals(1, result.absentCount());
        assertEquals(1, result.lateCount());
        assertEquals(1, result.excusedCount());
        assertEquals(50.0, result.attendancePercentage());
    }

    private AttendanceRecord createRecord(UUID studentId, AttendanceStatus status) {
        AttendanceRecord record = new AttendanceRecord();
        record.setStudentId(studentId);
        record.setSubjectId(UUID.randomUUID());
        record.setDate(LocalDate.now());
        record.setStatus(status);
        record.setTeacherAssignmentId(UUID.randomUUID());
        return record;
    }
}
