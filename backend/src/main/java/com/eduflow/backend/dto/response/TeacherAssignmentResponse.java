package com.eduflow.backend.dto.response;

import java.util.UUID;

public record TeacherAssignmentResponse(
        UUID id,
        UUID teacherId,
        UUID subjectId,
        UUID divisionId,
        UUID academicYearId,
        String assignmentType
) {}
