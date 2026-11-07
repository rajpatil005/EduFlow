
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateTeacherRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name cannot exceed 100 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        @Size(max = 255, message = "Email cannot exceed 255 characters")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 72,
                message = "Password must be between 8 and 72 characters")
        String password,

        @NotBlank(message = "Employee ID is required")
        @Size(max = 50, message = "Employee ID cannot exceed 50 characters")
        String employeeId,

        @NotNull(message = "Department ID is required")
        UUID departmentId

) {}
