
package com.eduflow.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record AcademicYearResponse(
        UUID id,
        String name,
        Integer startYear,
        Integer endYear,
        Boolean isActive,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
