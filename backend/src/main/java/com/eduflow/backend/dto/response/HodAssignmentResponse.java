package com.eduflow.backend.dto.response;

import java.time.Instant;
import java.util.UUID;

public record HodAssignmentResponse(
        UUID departmentId,
        UUID teacherId,
        UUID assignedBy,
        Instant assignedAt,
        String message
) {}