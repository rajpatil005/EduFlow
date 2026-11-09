
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateDivisionRequest(

        @NotBlank(message = "Division name is required")
        @Size(max = 20, message = "Division name cannot exceed 20 characters")
        String name,

        @NotNull(message = "Semester ID is required")
        UUID semesterId

) {
}
