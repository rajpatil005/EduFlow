
package com.eduflow.backend.dto.response;

import java.util.UUID;

public record ProgrammeResponse(
        UUID id,
        String name,
        String code,
        UUID departmentId,
        String departmentName
) {
}
