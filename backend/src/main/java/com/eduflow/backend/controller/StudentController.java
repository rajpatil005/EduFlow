
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.request.CreateStudentRequest;
import com.eduflow.backend.dto.request.UpdateStudentRequest;
import com.eduflow.backend.dto.response.StudentResponse;
import com.eduflow.backend.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
public class StudentController {

    private static final Logger log =
            LoggerFactory.getLogger(StudentController.class);

    private final StudentService studentService;

    // CREATE STUDENT
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentResponse createStudent(
            @Valid @RequestBody CreateStudentRequest request
    ) {

        log.info("StudentController: create student request received");

        return studentService.createStudent(request);
    }

    // GET ALL STUDENTS
    @GetMapping
    public List<StudentResponse> getAllStudents(
            @RequestParam(required = false) UUID divisionId
    ) {

        log.info("StudentController: get students request received");

        if (divisionId != null) {
            return studentService.getStudentsByDivision(divisionId);
        }

        return studentService.getAllStudents();
    }

    // GET STUDENT BY ID
    @GetMapping("/{id}")
    public StudentResponse getStudentById(
            @PathVariable UUID id
    ) {

        return studentService.getStudentById(id);
    }

    // UPDATE STUDENT
    @PutMapping("/{id}")
    public StudentResponse updateStudent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStudentRequest request
    ) {

        log.info("StudentController: update student request, id={}", id);

        return studentService.updateStudent(id, request);
    }

    // DEACTIVATE STUDENT
    @PatchMapping("/{id}/deactivate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateStudent(
            @PathVariable UUID id
    ) {

        log.info("StudentController: deactivate student, id={}", id);

        studentService.deactivateStudent(id);
    }

    // ACTIVATE STUDENT
    @PatchMapping("/{id}/activate")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activateStudent(
            @PathVariable UUID id
    ) {

        log.info("StudentController: activate student, id={}", id);

        studentService.activateStudent(id);
    }
}
