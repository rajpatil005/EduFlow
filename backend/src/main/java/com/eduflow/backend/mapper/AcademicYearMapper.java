package com.eduflow.backend.mapper;

import com.eduflow.backend.entity.AcademicYear;
import com.eduflow.backend.dto.response.AcademicYearResponse;

public class AcademicYearMapper {
    public static AcademicYearResponse toResponse(AcademicYear academicYear) {
        return new AcademicYearResponse(
                academicYear.getId(),
                academicYear.getName(),
                academicYear.getStartYear(),
                academicYear.getEndYear(),
                academicYear.getIsActive(),
                academicYear.getCreatedAt(),
                academicYear.getUpdatedAt()
        );
    }
}
