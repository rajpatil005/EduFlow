package com.eduflow.backend.controller;
import com.eduflow.backend.dto.response.DepartmentResponse;
import com.eduflow.backend.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.eduflow.backend.dto.response.DepartmentOverviewResponse;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/{departmentId}")
    public DepartmentResponse getDepartmentById(
            @PathVariable UUID departmentId) {
        return departmentService.getDepartmentById(departmentId);
    }

    @GetMapping("/{departmentId}/overview")
    public DepartmentOverviewResponse getDepartmentOverview(
            @PathVariable UUID departmentId,
            Authentication authentication) {

        return departmentService.getDepartmentOverview(
                departmentId,
                authentication.getName()
        );
    }
}
