package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateTeacherAssignmentRequest(

        @NotNull(message = "Teacher ID is required")
        UUID teacherId,

        @NotNull(message = "Subject ID is required")
        UUID subjectId,

        @NotNull(message = "Division ID is required")
        UUID divisionId,

        @NotNull(message = "Academic year ID is required")
        UUID academicYearId,

        @NotBlank(message = "Assignment type is required")
        @Size(max = 30, message = "Assignment type cannot exceed 30 characters")
        String assignmentType

) {
}