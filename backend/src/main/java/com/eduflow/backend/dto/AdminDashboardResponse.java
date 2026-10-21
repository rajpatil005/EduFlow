package com.eduflow.backend.dto;

public record AdminDashboardResponse(
        long totalStudents,
        long totalTeachers,
        long totalDepartments,
        long totalSubjects,
        long totalAttendanceRecords,
        long presentCount,
        long absentCount,
        long lateCount,
        long excusedCount,
        double attendancePercentage,
        long totalAssessments,
        long totalAssessmentMarks
) {}
