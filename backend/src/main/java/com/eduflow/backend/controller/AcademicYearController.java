
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateAcademicYearRequest;
import com.eduflow.backend.dto.response.AcademicYearResponse;
import com.eduflow.backend.service.AcademicYearService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/academic-years")
@RequiredArgsConstructor
public class AcademicYearController {
    private final AcademicYearService academicYearService;

    // Create Academic Year
    @PostMapping
    public ResponseEntity<AcademicYearResponse> createAcademicYear(
            @Valid @RequestBody CreateAcademicYearRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(academicYearService.createAcademicYear(request));
    }

    // Get All Academic Years
    @GetMapping
    public ResponseEntity<List<AcademicYearResponse>> getAllAcademicYears() {

        return ResponseEntity.ok(
                academicYearService.getAllAcademicYears()
        );
    }

    // Get Academic Year By ID
    @GetMapping("/{id}")
    public ResponseEntity<AcademicYearResponse> getAcademicYearById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                academicYearService.getAcademicYearById(id)
        );
    }

    // Activate Academic Year
    @PatchMapping("/{id}/activate")
    public ResponseEntity<AcademicYearResponse> activateAcademicYear(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                academicYearService.activateAcademicYear(id)
        );
    }
}
