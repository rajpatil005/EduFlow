
package com.eduflow.backend.dto.response;

import java.util.UUID;

public record AssessmentComponentResponse(
        UUID id,
        UUID subjectId,
        String code,
        String name,
        Integer maxMarks,
        Integer weightage,
        Integer displayOrder
) {}
