
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.ReturnAssessmentRequest;
import com.eduflow.backend.dto.response.AssessmentResponse;
import com.eduflow.backend.dto.response.StudentMarksEntryResponse;
import com.eduflow.backend.service.HodAssessmentReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hod/assessments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HOD')")
public class HodAssessmentReviewController {

    private final HodAssessmentReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<AssessmentResponse>> getSubmittedAssessments(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reviewService.getSubmittedAssessments(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{assessmentId}")
    public ResponseEntity<AssessmentResponse> getAssessment(
            @PathVariable UUID assessmentId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reviewService.getAssessment(
                        assessmentId,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{assessmentId}/marks")
    public ResponseEntity<List<StudentMarksEntryResponse>> getAssessmentMarks(
            @PathVariable UUID assessmentId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reviewService.getAssessmentMarks(
                        assessmentId,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{assessmentId}/approve")
    public ResponseEntity<AssessmentResponse> approveAssessment(
            @PathVariable UUID assessmentId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reviewService.approveAssessment(
                        assessmentId,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{assessmentId}/return")
    public ResponseEntity<AssessmentResponse> returnAssessment(
            @PathVariable UUID assessmentId,
            @Valid @RequestBody ReturnAssessmentRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reviewService.returnAssessment(
                        assessmentId,
                        request,
                        authentication.getName()
                )
        );
    }
}
