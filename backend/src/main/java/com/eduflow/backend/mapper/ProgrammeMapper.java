
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.ProgrammeResponse;
import com.eduflow.backend.entity.Programme;

public class ProgrammeMapper {

    public static ProgrammeResponse toResponse(Programme programme) {

        return new ProgrammeResponse(
                programme.getId(),
                programme.getName(),
                programme.getCode(),
                programme.getDepartment().getId(),
                programme.getDepartment().getName()
        );
    }
}
