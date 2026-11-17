
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record UpdateStudentRequest(

        @NotBlank(message = "Student name is required")
        @Size(max = 100)
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        @Size(max = 255)
        String email,

        @NotBlank(message = "Enrollment number is required")
        @Size(max = 50)
        String enrollmentNo,

        @NotBlank(message = "Roll number is required")
        @Size(max = 20)
        String rollNo,

        @NotNull(message = "Division ID is required")
        UUID divisionId

) {}
