
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.AttendanceRecordRequest;
import com.eduflow.backend.dto.AttendanceRecordResponse;
import com.eduflow.backend.service.AttendanceService;

import jakarta.validation.Valid;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendance-records")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceRecordResponse> create(
            @Valid @RequestBody AttendanceRecordRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(attendanceService.create(request));
    }

    @GetMapping
    public List<AttendanceRecordResponse> getAll() {
        return attendanceService.getAll();
    }

    @GetMapping("/{id}")
    public AttendanceRecordResponse getById(
            @PathVariable UUID id
    ) {
        return attendanceService.getById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<AttendanceRecordResponse> getByStudent(
            @PathVariable UUID studentId
    ) {
        return attendanceService.getByStudent(studentId);
    }

    @GetMapping("/subject/{subjectId}")
    public List<AttendanceRecordResponse> getBySubject(
            @PathVariable UUID subjectId
    ) {
        return attendanceService.getBySubject(subjectId);
    }

    @GetMapping("/date/{date}")
    public List<AttendanceRecordResponse> getByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return attendanceService.getByDate(date);
    }

    @PutMapping("/{id}")
    public AttendanceRecordResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody AttendanceRecordRequest request
    ) {
        return attendanceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id
    ) {
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
