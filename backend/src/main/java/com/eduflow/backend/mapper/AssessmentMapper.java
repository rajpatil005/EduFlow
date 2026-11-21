
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.AssessmentResponse;
import com.eduflow.backend.entity.Assessment;
import org.springframework.stereotype.Component;

@Component
public class AssessmentMapper {

    public AssessmentResponse toResponse(Assessment assessment) {

        var assignment = assessment.getTeacherAssignment();

        return new AssessmentResponse(
                assessment.getId(),
                assessment.getAssessmentComponent().getId(),
                assignment != null ? assignment.getId() : null,
                assessment.getAssessmentComponent().getSubject().getId(),
                assignment != null
                        ? assignment.getDivision().getId()
                        : null,
                assessment.getName(),
                assessment.getMaxMarks(),
                assessment.getAssessmentDate(),
                assessment.getStatus(),
                assessment.getSubmittedAt(),
                assessment.getReviewedBy(),
                assessment.getReviewedAt(),
                assessment.getReviewRemark()
        );
    }
}
