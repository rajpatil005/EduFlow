package com.eduflow.backend.dto.response;

import java.util.UUID;

public record DepartmentResponse(
        UUID id,
        String name,
        String code
) {}