
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateProgrammeRequest;
import com.eduflow.backend.dto.request.UpdateProgrammeRequest;
import com.eduflow.backend.dto.response.ProgrammeResponse;
import com.eduflow.backend.service.ProgrammeService;

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
public class ProgrammeController {

    private final ProgrammeService programmeService;


    // CREATE PROGRAMME
    @PostMapping("/programmes")
    public ResponseEntity<ProgrammeResponse> createProgramme(
            @Valid @RequestBody CreateProgrammeRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(programmeService.createProgramme(request));
    }


    // GET ALL PROGRAMMES
    @GetMapping("/programmes")
    public ResponseEntity<List<ProgrammeResponse>> getAllProgrammes() {

        return ResponseEntity.ok(
                programmeService.getAllProgrammes()
        );
    }


    // GET PROGRAMME BY ID
    @GetMapping("/programmes/{id}")
    public ResponseEntity<ProgrammeResponse> getProgrammeById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                programmeService.getProgrammeById(id)
        );
    }


    // GET PROGRAMMES BY DEPARTMENT
    @GetMapping("/departments/{departmentId}/programmes")
    public ResponseEntity<List<ProgrammeResponse>> getProgrammesByDepartment(
            @PathVariable UUID departmentId
    ) {

        return ResponseEntity.ok(
                programmeService.getProgrammesByDepartment(departmentId)
        );
    }


    // UPDATE PROGRAMME
    @PutMapping("/programmes/{id}")
    public ResponseEntity<ProgrammeResponse> updateProgramme(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProgrammeRequest request
    ) {

        return ResponseEntity.ok(
                programmeService.updateProgramme(id, request)
        );
    }
}
