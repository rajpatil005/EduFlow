package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateTeacherRequest;
import com.eduflow.backend.dto.response.TeacherResponse;
import com.eduflow.backend.service.TeacherService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherResponse createTeacher(
            @Valid @RequestBody CreateTeacherRequest request) {

        return teacherService.createTeacher(request);
    }
}