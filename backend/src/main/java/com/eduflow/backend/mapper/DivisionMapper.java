
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.DivisionResponse;
import com.eduflow.backend.entity.Division;

public class DivisionMapper {

    public static DivisionResponse toResponse(Division division) {

        return new DivisionResponse(
                division.getId(),
                division.getName(),
                division.getSemester().getId(),
                division.getSemester().getName(),
                division.getSemester().getNumber(),
                division.getSemester().getProgramme().getName()
        );
    }
}
