package com.eduflow.backend.service;

import com.eduflow.backend.dto.StudentAttendanceSummaryResponse;
import com.eduflow.backend.entity.AttendanceRecord;
import com.eduflow.backend.entity.AttendanceStatus;
import com.eduflow.backend.repository.AttendanceRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class StudentAttendanceReportService {

    private final AttendanceRecordRepository repository;

    public StudentAttendanceReportService(AttendanceRecordRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public StudentAttendanceSummaryResponse getSummary(UUID studentId) {
        List<AttendanceRecord> records = repository.findByStudentId(studentId);

        long present = count(records, AttendanceStatus.PRESENT);
        long absent = count(records, AttendanceStatus.ABSENT);
        long late = count(records, AttendanceStatus.LATE);
        long excused = count(records, AttendanceStatus.EXCUSED);

        long total = records.size();
        long eligible = present + absent + late;

        double percentage = eligible == 0
                ? 0.0
                : (present * 100.0) / eligible;

        return new StudentAttendanceSummaryResponse(
                total, present, absent, late, excused, percentage
        );
    }

    private long count(List<AttendanceRecord> records, AttendanceStatus status) {
        return records.stream()
                .filter(record -> record.getStatus() == status)
                .count();
    }
}
