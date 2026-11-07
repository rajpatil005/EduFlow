package com.eduflow.backend.dto.response;

import java.util.UUID;

public record LoginResponse(
        String token,
        String tokenType,
        UUID userId,
        String name,
        String email,
        String role
) {
}