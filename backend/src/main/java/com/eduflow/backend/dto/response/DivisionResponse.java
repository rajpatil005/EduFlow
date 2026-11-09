
package com.eduflow.backend.dto.response;

import java.util.UUID;

public record DivisionResponse(
        UUID id,
        String name,
        UUID semesterId,
        String semesterName,
        Integer semesterNumber,
        String programmeName
) {
}
