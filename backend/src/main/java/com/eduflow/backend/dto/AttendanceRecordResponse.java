
package com.eduflow.backend.dto;

import com.eduflow.backend.entity.AttendanceStatus;

import java.time.LocalDate;
import java.util.UUID;

public record AttendanceRecordResponse(
        UUID id,

        UUID studentId,

        UUID subjectId,

        LocalDate date,

        AttendanceStatus status,
        
        UUID teacherAssignmentId
) {}
