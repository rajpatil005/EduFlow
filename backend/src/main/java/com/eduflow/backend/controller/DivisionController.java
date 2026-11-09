
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateDivisionRequest;
import com.eduflow.backend.dto.request.UpdateDivisionRequest;
import com.eduflow.backend.dto.response.DivisionResponse;
import com.eduflow.backend.service.DivisionService;

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
public class DivisionController {

    private final DivisionService divisionService;


    // CREATE DIVISION
    @PostMapping("/divisions")
    public ResponseEntity<DivisionResponse> createDivision(
            @Valid @RequestBody CreateDivisionRequest request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(divisionService.createDivision(request));
    }


    // GET ALL DIVISIONS
    @GetMapping("/divisions")
    public ResponseEntity<List<DivisionResponse>> getAllDivisions() {

        return ResponseEntity.ok(
                divisionService.getAllDivisions()
        );
    }


    // GET DIVISION BY ID
    @GetMapping("/divisions/{id}")
    public ResponseEntity<DivisionResponse> getDivisionById(
            @PathVariable UUID id
    ) {

        return ResponseEntity.ok(
                divisionService.getDivisionById(id)
        );
    }


    // GET DIVISIONS BY SEMESTER
    @GetMapping("/semesters/{semesterId}/divisions")
    public ResponseEntity<List<DivisionResponse>> getDivisionsBySemester(
            @PathVariable UUID semesterId
    ) {

        return ResponseEntity.ok(
                divisionService.getDivisionsBySemester(semesterId)
        );
    }


    // UPDATE DIVISION
    @PutMapping("/divisions/{id}")
    public ResponseEntity<DivisionResponse> updateDivision(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDivisionRequest request
    ) {

        return ResponseEntity.ok(
                divisionService.updateDivision(id, request)
        );
    }
}
