
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.SemesterResponse;
import com.eduflow.backend.entity.Semester;

public class SemesterMapper {

    public static SemesterResponse toResponse(Semester semester) {

        return new SemesterResponse(
                semester.getId(),
                semester.getName(),
                semester.getNumber(),
                semester.getProgramme().getId(),
                semester.getProgramme().getName()
        );
    }
}
