
package com.eduflow.backend.dto.response;

import com.eduflow.backend.entity.AssessmentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssessmentResponse(
        UUID id,
        UUID assessmentComponentId,
        UUID teacherAssignmentId,
        UUID subjectId,
        UUID divisionId,
        String name,
        Integer maxMarks,
        LocalDate assessmentDate,
        AssessmentStatus status,
        LocalDateTime submittedAt,
        UUID reviewedBy,
        LocalDateTime reviewedAt,
        String reviewRemark
) {
}
