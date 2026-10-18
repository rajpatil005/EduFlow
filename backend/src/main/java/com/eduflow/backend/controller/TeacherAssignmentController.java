package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.TeacherAssignmentRequest;
import com.eduflow.backend.dto.response.TeacherAssignmentResponse;
import com.eduflow.backend.service.TeacherAssignmentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teacher-assignments")
public class TeacherAssignmentController {

    private final TeacherAssignmentService assignmentService;

    public TeacherAssignmentController(
            TeacherAssignmentService assignmentService
    ) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<TeacherAssignmentResponse> create(
            @Valid @RequestBody TeacherAssignmentRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(assignmentService.create(request));
    }

    @GetMapping
    public List<TeacherAssignmentResponse> getAll() {
        return assignmentService.getAll();
    }

    @GetMapping("/{id}")
    public TeacherAssignmentResponse getById(
            @PathVariable UUID id
    ) {
        return assignmentService.getById(id);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<TeacherAssignmentResponse> getByTeacher(
            @PathVariable UUID teacherId
    ) {
        return assignmentService.getByTeacher(teacherId);
    }

    @GetMapping("/subject/{subjectId}")
    public List<TeacherAssignmentResponse> getBySubject(
            @PathVariable UUID subjectId
    ) {
        return assignmentService.getBySubject(subjectId);
    }

    @GetMapping("/department/{departmentId}")
    public List<TeacherAssignmentResponse> getByDepartment(
            @PathVariable UUID departmentId
    ) {
        return assignmentService.getByDepartment(departmentId);
    }

    @PutMapping("/{id}")
    public TeacherAssignmentResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody TeacherAssignmentRequest request
    ) {
        return assignmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        assignmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
