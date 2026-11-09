
package com.eduflow.backend.dto.response;

import java.util.UUID;

public record SemesterResponse(
        UUID id,
        String name,
        Integer number,
        UUID programmeId,
        String programmeName
) {}
