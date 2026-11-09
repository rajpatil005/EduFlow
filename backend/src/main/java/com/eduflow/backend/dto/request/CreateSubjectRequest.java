
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateSubjectRequest(

        @NotBlank(message = "Subject name is required")
        @Size(max = 100, message = "Subject name cannot exceed 100 characters")
        String name,

        @NotBlank(message = "Subject code is required")
        @Size(max = 20, message = "Subject code cannot exceed 20 characters")
        String code,

        @NotNull(message = "Credits are required")
        @Min(value = 1, message = "Credits must be greater than zero")
        Integer credits,

        @NotNull(message = "Semester ID is required")
        UUID semesterId

) {
}
