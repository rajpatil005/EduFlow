
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record UpdateAssessmentRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull @Positive Integer maxMarks,
        @NotNull LocalDate assessmentDate
) {}
