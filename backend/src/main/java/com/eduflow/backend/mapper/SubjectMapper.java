
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.SubjectResponse;
import com.eduflow.backend.entity.Subject;

public class SubjectMapper {

    public static SubjectResponse toResponse(Subject subject) {

        return new SubjectResponse(
                subject.getId(),
                subject.getName(),
                subject.getCode(),
                subject.getCredits(),
                subject.getSemester().getId(),
                subject.getSemester().getName(),
                subject.getSemester().getNumber(),
                subject.getSemester().getProgramme().getName()
        );
    }
}
