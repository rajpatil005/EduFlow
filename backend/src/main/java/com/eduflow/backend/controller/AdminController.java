
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateDepartmentRequest;
import com.eduflow.backend.dto.request.CreateTeacherRequest;
import com.eduflow.backend.dto.response.DepartmentResponse;
import com.eduflow.backend.dto.response.TeacherResponse;
import com.eduflow.backend.service.DepartmentService;
import com.eduflow.backend.service.TeacherService;
import com.eduflow.backend.dto.request.AssignHodRequest;
import com.eduflow.backend.dto.response.HodAssignmentResponse;
import com.eduflow.backend.service.DepartmentHodAssignmentService;

import org.springframework.security.core.Authentication;
import java.util.UUID;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private static final Logger log =
            LoggerFactory.getLogger(AdminController.class);

    private final TeacherService teacherService;
    private final DepartmentService departmentService;
    private final DepartmentHodAssignmentService hodAssignmentService;

    @PostMapping("/departments")
    @ResponseStatus(HttpStatus.CREATED)
    public DepartmentResponse createDepartment(
            @Valid @RequestBody CreateDepartmentRequest request
    ) {
        log.info("AdminController: create department request received");

        return departmentService.createDepartment(request);
    }

    @PostMapping("/teachers")
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherResponse createTeacher(
            @Valid @RequestBody CreateTeacherRequest request
    ) {
        log.info("AdminController: create teacher request received");

        return teacherService.createTeacher(request);
    }

    @PostMapping("/departments/{departmentId}/hod")
    @ResponseStatus(HttpStatus.CREATED)
    public HodAssignmentResponse assignHod(
            @PathVariable UUID departmentId,
            @Valid @RequestBody AssignHodRequest request,
            Authentication authentication
    ) {
        log.info("AdminController: assign HOD request received for department={}",
                departmentId);

        return hodAssignmentService.assignHodByAdminEmail(
                departmentId,
                request.teacherId(),
                authentication.getName()
        );
    }

    @DeleteMapping("/teachers/{teacherId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateTeacher(
            @PathVariable UUID teacherId
    ) {
        log.info("AdminController: deactivate teacher request received, teacherId={}",
                teacherId);

        teacherService.deactivateTeacher(teacherId);
    }

    @PatchMapping("/teachers/{teacherId}/activate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activateTeacher(
            @PathVariable UUID teacherId
    ) {
        log.info("AdminController: activate teacher request received, teacherId={}",
                teacherId);

        teacherService.activateTeacher(teacherId);
    }
}
