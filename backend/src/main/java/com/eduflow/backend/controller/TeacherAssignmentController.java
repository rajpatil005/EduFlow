package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateTeacherAssignmentRequest;
import com.eduflow.backend.dto.request.UpdateTeacherAssignmentRequest;
import com.eduflow.backend.dto.response.TeacherAssignmentResponse;

import com.eduflow.backend.service.TeacherAssignmentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/teacher-assignments")
@RequiredArgsConstructor
public class TeacherAssignmentController {

    private final TeacherAssignmentService teacherAssignmentService;

    // CREATE ASSIGNMENT
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherAssignmentResponse create(
            @Valid @RequestBody CreateTeacherAssignmentRequest request
    ) {
        return teacherAssignmentService.create(request);
    }

    // GET ALL ASSIGNMENTS
    @GetMapping
    public List<TeacherAssignmentResponse> getAll() {
        return teacherAssignmentService.getAll();
    }

    // GET ASSIGNMENT BY ID
    @GetMapping("/{id}")
    public TeacherAssignmentResponse getById(
            @PathVariable UUID id
    ) {
        return teacherAssignmentService.getById(id);
    }

    // GET ASSIGNMENTS BY TEACHER
    @GetMapping("/teacher/{teacherId}")
    public List<TeacherAssignmentResponse> getByTeacher(
            @PathVariable UUID teacherId
    ) {
        return teacherAssignmentService.getByTeacher(teacherId);
    }

    // GET ASSIGNMENTS BY DIVISION
    @GetMapping("/division/{divisionId}")
    public List<TeacherAssignmentResponse> getByDivision(
            @PathVariable UUID divisionId
    ) {
        return teacherAssignmentService.getByDivision(divisionId);
    }

    // GET ASSIGNMENTS BY ACADEMIC YEAR
    @GetMapping("/academic-year/{academicYearId}")
    public List<TeacherAssignmentResponse> getByAcademicYear(
            @PathVariable UUID academicYearId
    ) {
        return teacherAssignmentService.getByAcademicYear(academicYearId);
    }

    // UPDATE ASSIGNMENT
    @PutMapping("/{id}")
    public TeacherAssignmentResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTeacherAssignmentRequest request
    ) {
        return teacherAssignmentService.update(id, request);
    }
}