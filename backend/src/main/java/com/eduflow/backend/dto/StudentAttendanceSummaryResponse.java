package com.eduflow.backend.dto;

public record StudentAttendanceSummaryResponse(
        long totalRecords,
        long presentCount,
        long absentCount,
        long lateCount,
        long excusedCount,
        double attendancePercentage
) {
}
