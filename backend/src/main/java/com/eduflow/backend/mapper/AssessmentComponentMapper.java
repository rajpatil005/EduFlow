
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.AssessmentComponentResponse;
import com.eduflow.backend.entity.AssessmentComponent;
import org.springframework.stereotype.Component;

@Component
public class AssessmentComponentMapper {

    public AssessmentComponentResponse toResponse(
            AssessmentComponent component
    ) {
        return new AssessmentComponentResponse(
                component.getId(),
                component.getSubject().getId(),
                component.getCode(),
                component.getName(),
                component.getMaxMarks(),
                component.getWeightage(),
                component.getDisplayOrder()
        );
    }
}
