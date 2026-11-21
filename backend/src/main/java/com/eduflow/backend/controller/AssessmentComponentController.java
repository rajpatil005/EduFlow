
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateAssessmentComponentRequest;
import com.eduflow.backend.dto.request.UpdateAssessmentComponentRequest;
import com.eduflow.backend.dto.response.AssessmentComponentResponse;
import com.eduflow.backend.service.AssessmentComponentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/assessment-components")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AssessmentComponentController {

    private final AssessmentComponentService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentComponentResponse create(
            @Valid @RequestBody CreateAssessmentComponentRequest request
    ) {
        return service.create(request);
    }

    @GetMapping
    public List<AssessmentComponentResponse> getAll(
            @RequestParam(required = false) UUID subjectId
    ) {
        return service.getAll(subjectId);
    }

    @PutMapping("/{id}")
    public AssessmentComponentResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAssessmentComponentRequest request
    ) {
        return service.update(id, request);
    }
}
