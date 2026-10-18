package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.UserResponse;
import com.eduflow.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getRole(),
                user.getEmail()
        );
    }
}
