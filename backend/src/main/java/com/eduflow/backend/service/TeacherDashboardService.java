package com.eduflow.backend.service;

import com.eduflow.backend.dto.TeacherAssignmentSummaryResponse;
import com.eduflow.backend.entity.AttendanceRecord;
import com.eduflow.backend.entity.AttendanceStatus;
import com.eduflow.backend.entity.TeacherAssignment;
import com.eduflow.backend.repository.AttendanceRecordRepository;
import com.eduflow.backend.repository.TeacherAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TeacherDashboardService {

    private final TeacherAssignmentRepository assignmentRepository;
    private final AttendanceRecordRepository attendanceRepository;

    public TeacherDashboardService(
            TeacherAssignmentRepository assignmentRepository,
            AttendanceRecordRepository attendanceRepository) {
        this.assignmentRepository = assignmentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Transactional(readOnly = true)
    public List<TeacherAssignmentSummaryResponse> getAssignments(UUID teacherId) {
        return assignmentRepository.findByTeacherId(teacherId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TeacherAttendanceSummaryResponse> getAttendanceSummary(UUID teacherId) {
        return assignmentRepository.findByTeacherId(teacherId)
                .stream()
                .map(assignment -> {
                    List<AttendanceRecord> records =
                            attendanceRepository.findByTeacherAssignmentId(assignment.getId());

                    long present = count(records, AttendanceStatus.PRESENT);
                    long absent = count(records, AttendanceStatus.ABSENT);
                    long late = count(records, AttendanceStatus.LATE);
                    long excused = count(records, AttendanceStatus.EXCUSED);
                    long total = records.size();
                    long eligible = present + absent + late;

                    double percentage = eligible == 0
                            ? 0.0
                            : present * 100.0 / eligible;

                    return new TeacherAttendanceSummaryResponse(
                            assignment.getId(),
                            assignment.getSubjectId(),
                            assignment.getDivisionId(),
                            total,
                            present,
                            absent,
                            late,
                            excused,
                            percentage
                    );
                })
                .toList();
    }

    private long count(List<AttendanceRecord> records, AttendanceStatus status) {
        return records.stream()
                .filter(record -> record.getStatus() == status)
                .count();
    }

    private TeacherAssignmentSummaryResponse toResponse(TeacherAssignment assignment) {
        return new TeacherAssignmentSummaryResponse(
                assignment.getId(),
                assignment.getSubjectId(),
                assignment.getDivisionId(),
                assignment.getAcademicYearId(),
                assignment.getAssignmentType()
        );
    }

    public record TeacherAttendanceSummaryResponse(
            UUID assignmentId,
            UUID subjectId,
            UUID divisionId,
            long totalRecords,
            long presentCount,
            long absentCount,
            long lateCount,
            long excusedCount,
            double attendancePercentage
    ) {}
}