
package com.eduflow.backend.dto;

import java.util.UUID;

public record HodDepartmentReportResponse(
        UUID departmentId,
        String departmentName,
        String departmentCode,
        long studentCount,
        long teacherCount,
        long totalAttendanceRecords,
        long presentCount,
        long absentCount,
        long lateCount,
        long excusedCount,
        double attendancePercentage
) {}
