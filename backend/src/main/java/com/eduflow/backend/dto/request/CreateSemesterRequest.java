
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateSemesterRequest(

        @NotBlank(message = "Semester name is required")
        @Size(max = 50, message = "Semester name cannot exceed 50 characters")
        String name,

        @NotNull(message = "Semester number is required")
        @Min(value = 1, message = "Semester number must be greater than 0")
        Integer number,

        @NotNull(message = "Programme ID is required")
        UUID programmeId

) {}
