package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record TeacherAssignmentRequest(

        @NotNull
        UUID teacherId,

        @NotNull
        UUID subjectId,

        @NotNull
        UUID divisionId,

        @NotNull
        UUID academicYearId,

        @NotBlank
        @Size(max = 30)
        String assignmentType

) {}
