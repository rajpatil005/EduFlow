
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateSemesterRequest;
import com.eduflow.backend.dto.request.UpdateSemesterRequest;
import com.eduflow.backend.dto.response.SemesterResponse;
import com.eduflow.backend.service.SemesterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterService semesterService;


    // CREATE SEMESTER
    @PostMapping("/semesters")
    public ResponseEntity<SemesterResponse> createSemester(
            @Valid @RequestBody CreateSemesterRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(semesterService.createSemester(request));
    }


    // GET ALL SEMESTERS
    @GetMapping("/semesters")
    public ResponseEntity<List<SemesterResponse>> getAllSemesters() {

        return ResponseEntity.ok(
                semesterService.getAllSemesters()
        );
    }


    // GET SEMESTER BY ID
    @GetMapping("/semesters/{id}")
    public ResponseEntity<SemesterResponse> getSemesterById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                semesterService.getSemesterById(id)
        );
    }


    // GET SEMESTERS BY PROGRAMME
    @GetMapping("/programmes/{programmeId}/semesters")
    public ResponseEntity<List<SemesterResponse>> getSemestersByProgramme(
            @PathVariable UUID programmeId
    ) {

        return ResponseEntity.ok(
                semesterService.getSemestersByProgramme(programmeId)
        );
    }


    // UPDATE SEMESTER
    @PutMapping("/semesters/{id}")
    public ResponseEntity<SemesterResponse> updateSemester(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSemesterRequest request
    ) {

        return ResponseEntity.ok(
                semesterService.updateSemester(id, request)
        );
    }
}
