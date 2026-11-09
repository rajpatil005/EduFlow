
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateProgrammeRequest(

        @NotBlank(message = "Programme name is required")
        @Size(max = 100, message = "Programme name cannot exceed 100 characters")
        String name,

        @NotBlank(message = "Programme code is required")
        @Size(max = 20, message = "Programme code cannot exceed 20 characters")
        String code,

        @NotNull(message = "Department ID is required")
        UUID departmentId

) {
}
