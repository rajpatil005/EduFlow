package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public record CreateAcademicYearRequest (
    @NotNull(message = "Start year is required")
    @Min(value = 2000, message = "Start Year must be at least 2000")
    @Max(value = 3000, message = "Start year cannot exceed 3000")
    Integer startYear,

    @NotNull(message = "End year is required")
    @Min(value = 2001, message = "End year must be at least 2001")
    @Max(value = 3001, message = "End year cannot exceed 3001")
    Integer endYear
) {}
