
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.response.HodAssignmentResponse;
import com.eduflow.backend.repository.UserRepository;
import com.eduflow.backend.service.DepartmentHodAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentHodAssignmentController {

    private final DepartmentHodAssignmentService hodAssignmentService;
    private final UserRepository userRepository;

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
