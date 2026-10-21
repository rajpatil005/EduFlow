package com.eduflow.backend.dto;

import java.util.UUID;

public record TeacherAssignmentSummaryResponse(
        UUID assignmentId,
        UUID subjectId,
        UUID divisionId,
        UUID academicYearId,
        String assignmentType
) {}
