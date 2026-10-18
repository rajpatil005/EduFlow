
package com.eduflow.backend.dto.response;

import com.eduflow.backend.entity.Role;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        Role role,
        String email
) {
}
