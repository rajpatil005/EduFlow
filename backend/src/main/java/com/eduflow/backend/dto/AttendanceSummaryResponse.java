package com.eduflow.backend.dto;

public record AttendanceSummaryResponse(
        Long sessionId,

        long totalRecords,
        
        long present,

        long absent,

        long late,
        
        long excused
) {}