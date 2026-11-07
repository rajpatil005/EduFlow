package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateDepartmentRequest(

        @NotBlank(message = "Department name is required")
        @Size(max = 100, message = "Department name cannot exceed 100 characters")
        String name,

        @NotBlank(message = "Department code is required")
        @Size(max = 20, message = "Department code cannot exceed 20 characters")
        String code

) {}