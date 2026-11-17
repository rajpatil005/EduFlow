
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateStudentRequest;
import com.eduflow.backend.dto.request.UpdateStudentRequest;
import com.eduflow.backend.dto.response.StudentResponse;

import com.eduflow.backend.entity.Division;
import com.eduflow.backend.entity.Role;
import com.eduflow.backend.entity.Student;
import com.eduflow.backend.entity.User;

import com.eduflow.backend.mapper.StudentMapper;

import com.eduflow.backend.repository.DivisionRepository;
import com.eduflow.backend.repository.StudentRepository;
import com.eduflow.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DivisionRepository divisionRepository;
    private final StudentMapper studentMapper;
    private final PasswordEncoder passwordEncoder;

    // CREATE STUDENT
    @Transactional
    public StudentResponse createStudent(CreateStudentRequest request) {

        String email = request.email().trim().toLowerCase();
        String enrollmentNo = request.enrollmentNo().trim();
        String rollNo = request.rollNo().trim();

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        if (studentRepository.existsByEnrollmentNo(enrollmentNo)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Enrollment number already exists"
            );
        }

        Division division = divisionRepository.findById(
                request.divisionId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Division not found"
        ));

        if (studentRepository.existsByDivision_IdAndRollNo(
                division.getId(), rollNo
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Roll number already exists in this division"
            );
        }

        // Create associated User account
        User user = new User(
                request.name().trim(),
                Role.STUDENT,
                email,
                passwordEncoder.encode(request.password())
        );

        User savedUser = userRepository.save(user);

        // Create Student academic profile
        Student student = new Student(
                savedUser,
                enrollmentNo,
                rollNo,
                division
        );

        Student savedStudent = studentRepository.save(student);

        return studentMapper.toResponse(savedStudent);
    }

    // GET ALL STUDENTS
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {

        return studentRepository.findAllByOrderByEnrollmentNoAsc()
                .stream()
                .map(studentMapper::toResponse)
                .toList();
    }

    // GET STUDENTS BY DIVISION
    @Transactional(readOnly = true)
    public List<StudentResponse> getStudentsByDivision(UUID divisionId) {

        if (!divisionRepository.existsById(divisionId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Division not found"
            );
        }

        return studentRepository
                .findAllByDivision_IdOrderByRollNoAsc(divisionId)
                .stream()
                .map(studentMapper::toResponse)
                .toList();
    }

    // GET STUDENT BY ID
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(UUID id) {

        Student student = findStudent(id);

        return studentMapper.toResponse(student);
    }

    // UPDATE STUDENT
    @Transactional
    public StudentResponse updateStudent(
            UUID id,
            UpdateStudentRequest request
    ) {

        Student student = findStudent(id);

        User user = student.getUser();

        String email = request.email().trim().toLowerCase();
        String enrollmentNo = request.enrollmentNo().trim();
        String rollNo = request.rollNo().trim();

        if (userRepository.findByEmail(email)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        if (studentRepository.existsByEnrollmentNoAndIdNot(
                enrollmentNo, id
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Enrollment number already exists"
            );
        }

        Division division = divisionRepository.findById(
                request.divisionId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Division not found"
        ));

        if (studentRepository.existsByDivision_IdAndRollNoAndIdNot(
                division.getId(), rollNo, id
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Roll number already exists in this division"
            );
        }

        user.updateProfile(
                request.name().trim(),
                email
        );

        student.updateDetails(
                enrollmentNo,
                rollNo,
                division
        );

        return studentMapper.toResponse(student);
    }

    // DEACTIVATE STUDENT
    @Transactional
    public void deactivateStudent(UUID id) {

        Student student = findStudent(id);

        student.deactivate();

        // Also disable the associated user account
        student.getUser().deactivate();
    }

    // ACTIVATE STUDENT
    @Transactional
    public void activateStudent(UUID id) {

        Student student = findStudent(id);

        student.activate();

        // Also enable the associated user account
        student.getUser().activate();
    }

    // COMMON STUDENT LOOKUP
    private Student findStudent(UUID id) {

        return studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Student not found"
                ));
    }
}
