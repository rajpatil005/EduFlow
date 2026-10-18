package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.AssignHodRequest;
import com.eduflow.backend.dto.response.HodAssignmentResponse;
import com.eduflow.backend.entity.Role;
import com.eduflow.backend.entity.User;
import com.eduflow.backend.repository.UserRepository;
import com.eduflow.backend.service.DepartmentHodAssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentHodAssignmentController {

    private final DepartmentHodAssignmentService hodAssignmentService;
    private final UserRepository userRepository;

    @PutMapping("/{departmentId}/hod")
    public HodAssignmentResponse assignHod(
            @PathVariable UUID departmentId,
            @Valid @RequestBody AssignHodRequest request,
            @AuthenticationPrincipal UserDetails principal) {

        if (principal == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Authentication required"
            );
        }

        User admin = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user was not found"
                ));

        if (admin.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only admins can assign an HOD"
            );
        }

        return hodAssignmentService.assignHod(
                departmentId, request.teacherId(), admin.getId()
        );
    }

    @GetMapping("/{departmentId}/hod")
    public HodAssignmentResponse getCurrentHod(
            @PathVariable UUID departmentId) {

        return hodAssignmentService.getCurrentHod(departmentId);
    }

    @GetMapping("/{departmentId}/hod/history")
    public List<HodAssignmentResponse> getHodHistory(
            @PathVariable UUID departmentId) {

        return hodAssignmentService.getHodHistory(departmentId);
    }
}