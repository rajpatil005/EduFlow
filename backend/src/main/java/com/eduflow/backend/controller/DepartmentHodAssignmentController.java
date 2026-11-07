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

import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentHodAssignmentController {

    private final DepartmentHodAssignmentService hodAssignmentService;
    private final UserRepository userRepository;

}