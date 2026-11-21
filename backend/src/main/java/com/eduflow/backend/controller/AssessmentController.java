
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateAssessmentRequest;
import com.eduflow.backend.dto.request.SubmitMarksRequest;
import com.eduflow.backend.dto.request.UpdateAssessmentRequest;
import com.eduflow.backend.dto.response.AssessmentResponse;
import com.eduflow.backend.dto.response.StudentMarksEntryResponse;
import com.eduflow.backend.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teacher/assessments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class AssessmentController {

    private final AssessmentService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentResponse create(
            @Valid @RequestBody CreateAssessmentRequest request,
            Authentication authentication
    ) {
        return service.create(request, authentication.getName());
    }

    @GetMapping
    public List<AssessmentResponse> getMyAssessments(
            Authentication authentication
    ) {
        return service.getMyAssessments(authentication.getName());
    }

    @GetMapping("/{id}")
    public AssessmentResponse getOne(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return service.getOne(id, authentication.getName());
    }

    @PutMapping("/{id}")
    public AssessmentResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssessmentRequest request,
            Authentication authentication
    ) {
        return service.update(id, request, authentication.getName());
    }

    @GetMapping("/{id}/students")
    public List<StudentMarksEntryResponse> getStudents(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return service.getStudents(id, authentication.getName());
    }

    @GetMapping("/{id}/marks")
    public List<StudentMarksEntryResponse> getMarks(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return service.getMarks(id, authentication.getName());
    }

    @PutMapping("/{id}/marks")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void saveMarks(
            @PathVariable UUID id,
            @Valid @RequestBody SubmitMarksRequest request,
            Authentication authentication
    ) {
        service.saveMarks(id, request, authentication.getName());
    }

    @PostMapping("/{id}/submit")
    public AssessmentResponse submit(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        return service.submit(id, authentication.getName());
    }
}
