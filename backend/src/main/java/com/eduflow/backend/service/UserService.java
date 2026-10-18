
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.UpdateUserRequest;
import com.eduflow.backend.dto.response.UserResponse;
import com.eduflow.backend.entity.User;
import com.eduflow.backend.mapper.UserMapper;
import com.eduflow.backend.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(
            UserRepository userRepository,
            UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }

    public UserResponse getUserById(UUID id) {
        User user = findUserById(id);
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUserById(
            UUID id,
            UpdateUserRequest request
    ) {
        User user = findUserById(id);

        String normalizedEmail = request.email()
                .trim()
                .toLowerCase(Locale.ROOT);

        boolean emailChanged =
                !user.getEmail().equalsIgnoreCase(normalizedEmail);

        if (emailChanged
                && userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        user.updateProfile(
                request.name().trim(),
                normalizedEmail
        );

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Transactional
    public void deleteUserById(UUID id) {
        User user = findUserById(id);
        userRepository.delete(user);
    }

    private User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }
}
