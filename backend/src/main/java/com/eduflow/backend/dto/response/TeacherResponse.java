package com.eduflow.backend.dto.response;

import java.util.UUID;

public record TeacherResponse(
        UUID id,
        UUID userId,
        String name,
        String email,
        String employeeId,
        UUID departmentId
) {}