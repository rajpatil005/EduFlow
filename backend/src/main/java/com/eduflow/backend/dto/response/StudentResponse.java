
package com.eduflow.backend.dto.response;

import java.util.UUID;

public record StudentResponse(

        UUID id,
        UUID userId,
        String name,
        String email,
        String enrollmentNo,
        String rollNo,
        UUID divisionId,
        String divisionName,
        boolean active

) {}
