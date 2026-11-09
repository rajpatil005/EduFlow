package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateTeacherAssignmentRequest;
import com.eduflow.backend.dto.request.UpdateTeacherAssignmentRequest;
import com.eduflow.backend.dto.response.TeacherAssignmentResponse;

import com.eduflow.backend.entity.AcademicYear;
import com.eduflow.backend.entity.Division;
import com.eduflow.backend.entity.Subject;
import com.eduflow.backend.entity.Teacher;
import com.eduflow.backend.entity.TeacherAssignment;

import com.eduflow.backend.mapper.TeacherAssignmentMapper;

import com.eduflow.backend.repository.AcademicYearRepository;
import com.eduflow.backend.repository.DivisionRepository;
import com.eduflow.backend.repository.SubjectRepository;
import com.eduflow.backend.repository.TeacherAssignmentRepository;
import com.eduflow.backend.repository.TeacherRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeacherAssignmentService {

    private final TeacherAssignmentRepository teacherAssignmentRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final DivisionRepository divisionRepository;
    private final AcademicYearRepository academicYearRepository;

    // CREATE TEACHER ASSIGNMENT
    @Transactional
    public TeacherAssignmentResponse create(
            CreateTeacherAssignmentRequest request
    ) {

        Teacher teacher = getTeacher(request.teacherId());

        Subject subject = getSubject(request.subjectId());

        Division division = getDivision(request.divisionId());

        AcademicYear academicYear = getAcademicYear(
                request.academicYearId()
        );

        String assignmentType = normalizeAssignmentType(
                request.assignmentType()
        );

        validateSubjectAndDivision(subject, division);

        validateDuplicateAssignment(
                subject.getId(),
                division.getId(),
                academicYear.getId(),
                assignmentType
        );

        TeacherAssignment assignment = new TeacherAssignment();

        assignment.setTeacher(teacher);
        assignment.setSubject(subject);
        assignment.setDivision(division);
        assignment.setAcademicYear(academicYear);
        assignment.setAssignmentType(assignmentType);

        TeacherAssignment savedAssignment =
                teacherAssignmentRepository.save(assignment);

        return TeacherAssignmentMapper.toResponse(savedAssignment);
    }

    // GET ALL ASSIGNMENTS
    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getAll() {

        return teacherAssignmentRepository.findAll()
                .stream()
                .map(TeacherAssignmentMapper::toResponse)
                .toList();
    }

    // GET ASSIGNMENT BY ID
    @Transactional(readOnly = true)
    public TeacherAssignmentResponse getById(UUID id) {

        TeacherAssignment assignment =
                teacherAssignmentRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Teacher assignment not found"
                        ));

        return TeacherAssignmentMapper.toResponse(assignment);
    }

    // GET ASSIGNMENTS BY TEACHER
    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getByTeacher(UUID teacherId) {

        if (!teacherRepository.existsById(teacherId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Teacher not found"
            );
        }

        return teacherAssignmentRepository.findAllByTeacher_Id(teacherId)
                .stream()
                .map(TeacherAssignmentMapper::toResponse)
                .toList();
    }

    // GET ASSIGNMENTS BY DIVISION
    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getByDivision(UUID divisionId) {

        if (!divisionRepository.existsById(divisionId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Division not found"
            );
        }

        return teacherAssignmentRepository.findAllByDivision_Id(divisionId)
                .stream()
                .map(TeacherAssignmentMapper::toResponse)
                .toList();
    }

    // GET ASSIGNMENTS BY ACADEMIC YEAR
    @Transactional(readOnly = true)
    public List<TeacherAssignmentResponse> getByAcademicYear(
            UUID academicYearId
    ) {

        if (!academicYearRepository.existsById(academicYearId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Academic year not found"
            );
        }

        return teacherAssignmentRepository
                .findAllByAcademicYear_Id(academicYearId)
                .stream()
                .map(TeacherAssignmentMapper::toResponse)
                .toList();
    }

    // UPDATE TEACHER ASSIGNMENT
    @Transactional
    public TeacherAssignmentResponse update(
            UUID id,
            UpdateTeacherAssignmentRequest request
    ) {

        TeacherAssignment assignment =
                teacherAssignmentRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Teacher assignment not found"
                        ));

        Teacher teacher = getTeacher(request.teacherId());

        Subject subject = getSubject(request.subjectId());

        Division division = getDivision(request.divisionId());

        AcademicYear academicYear = getAcademicYear(
                request.academicYearId()
        );

        String assignmentType = normalizeAssignmentType(
                request.assignmentType()
        );

        validateSubjectAndDivision(subject, division);

        boolean duplicate =
                teacherAssignmentRepository
                        .existsBySubject_IdAndDivision_IdAndAcademicYear_IdAndAssignmentTypeAndIdNot(
                                subject.getId(),
                                division.getId(),
                                academicYear.getId(),
                                assignmentType,
                                id
                        );

        if (duplicate) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This assignment slot already exists"
            );
        }

        assignment.setTeacher(teacher);
        assignment.setSubject(subject);
        assignment.setDivision(division);
        assignment.setAcademicYear(academicYear);
        assignment.setAssignmentType(assignmentType);

        TeacherAssignment updatedAssignment =
                teacherAssignmentRepository.save(assignment);

        return TeacherAssignmentMapper.toResponse(updatedAssignment);
    }

    // HELPER: FIND TEACHER
    private Teacher getTeacher(UUID teacherId) {

        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Teacher not found"
                ));
    }

    // HELPER: FIND SUBJECT
    private Subject getSubject(UUID subjectId) {

        return subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Subject not found"
                ));
    }

    // HELPER: FIND DIVISION
    private Division getDivision(UUID divisionId) {

        return divisionRepository.findById(divisionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Division not found"
                ));
    }

    // HELPER: FIND ACADEMIC YEAR
    private AcademicYear getAcademicYear(UUID academicYearId) {

        return academicYearRepository.findById(academicYearId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Academic year not found"
                ));
    }

    // HELPER: VALIDATE SUBJECT AND DIVISION
    private void validateSubjectAndDivision(
            Subject subject,
            Division division
    ) {

        UUID subjectSemesterId = subject.getSemester().getId();

        UUID divisionSemesterId = division.getSemester().getId();

        if (!subjectSemesterId.equals(divisionSemesterId)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Subject does not belong to the semester of this division"
            );
        }
    }

    // HELPER: CHECK DUPLICATE ASSIGNMENT
    private void validateDuplicateAssignment(
            UUID subjectId,
            UUID divisionId,
            UUID academicYearId,
            String assignmentType
    ) {

        boolean exists =
                teacherAssignmentRepository
                        .existsBySubject_IdAndDivision_IdAndAcademicYear_IdAndAssignmentType(
                                subjectId,
                                divisionId,
                                academicYearId,
                                assignmentType
                        );

        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This assignment slot already exists"
            );
        }
    }

    // HELPER: NORMALIZE ASSIGNMENT TYPE
    private String normalizeAssignmentType(String assignmentType) {

        return assignmentType.trim().toUpperCase(Locale.ROOT);
    }
}