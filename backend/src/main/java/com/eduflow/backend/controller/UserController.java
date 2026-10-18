
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.UpdateUserRequest;
import com.eduflow.backend.dto.response.UserResponse;
import com.eduflow.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Page<UserResponse> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        return userService.getAllUsers(pageable);
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public UserResponse updateUserById(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUserById(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(
            @PathVariable UUID id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}
