
package com.eduflow.backend.dto.response;

import java.util.UUID;

public record SubjectResponse(
        UUID id,
        String name,
        String code,
        Integer credits,
        UUID semesterId,
        String semesterName,
        Integer semesterNumber,
        String programmeName
) {
}
