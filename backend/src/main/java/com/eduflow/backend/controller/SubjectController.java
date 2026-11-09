
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateSubjectRequest;
import com.eduflow.backend.dto.request.UpdateSubjectRequest;
import com.eduflow.backend.dto.response.SubjectResponse;
import com.eduflow.backend.service.SubjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    // CREATE SUBJECT
    @PostMapping("/subjects")
    @ResponseStatus(HttpStatus.CREATED)
    public SubjectResponse create(
            @Valid @RequestBody CreateSubjectRequest request
    ) {
        return subjectService.create(request);
    }

    // GET ALL SUBJECTS
    @GetMapping("/subjects")
    public List<SubjectResponse> getAll() {
        return subjectService.getAll();
    }

    // GET SUBJECT BY ID
    @GetMapping("/subjects/{id}")
    public SubjectResponse getById(@PathVariable UUID id) {
        return subjectService.getById(id);
    }

    // GET SUBJECTS BY SEMESTER
    @GetMapping("/semesters/{semesterId}/subjects")
    public List<SubjectResponse> getBySemester(
            @PathVariable UUID semesterId
    ) {
        return subjectService.getBySemester(semesterId);
    }

    // UPDATE SUBJECT
    @PutMapping("/subjects/{id}")
    public SubjectResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSubjectRequest request
    ) {
        return subjectService.update(id, request);
    }
}
