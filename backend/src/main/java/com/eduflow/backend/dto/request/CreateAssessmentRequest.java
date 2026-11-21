
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.UUID;

public record CreateAssessmentRequest(
        @NotNull UUID assessmentComponentId,
        @NotNull UUID teacherAssignmentId,
        @NotBlank @Size(max = 100) String name,
        @NotNull @Positive Integer maxMarks,
        @NotNull LocalDate assessmentDate
) {}
