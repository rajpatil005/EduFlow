
package com.eduflow.backend.dto;

import com.eduflow.backend.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record AttendanceRecordRequest(
        @NotNull UUID studentId,

        @NotNull UUID subjectId,

        @NotNull LocalDate date,

        @NotNull AttendanceStatus status,
        
        @NotNull UUID teacherAssignmentId
) {}
