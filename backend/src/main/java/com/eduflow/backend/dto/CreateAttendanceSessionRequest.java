package com.eduflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record CreateAttendanceSessionRequest(
        @NotBlank String title,
        
        @NotNull @Positive Long classId,
        
        @NotNull @Positive Long subjectId,

        @NotNull @Positive Long teacherId,
        
        @NotNull LocalDate sessionDate
) {}