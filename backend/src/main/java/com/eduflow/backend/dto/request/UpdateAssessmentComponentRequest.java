
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.*;

import java.util.UUID;

public record UpdateAssessmentComponentRequest(
        @NotNull UUID subjectId,
        @NotBlank @Size(max = 20) String code,
        @NotBlank @Size(max = 100) String name,
        @NotNull @Positive Integer maxMarks,
        @NotNull @Min(0) @Max(100) Integer weightage,
        @NotNull @Min(1) Integer displayOrder
) {}
