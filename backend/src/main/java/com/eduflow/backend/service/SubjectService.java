
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateSubjectRequest;
import com.eduflow.backend.dto.request.UpdateSubjectRequest;
import com.eduflow.backend.dto.response.SubjectResponse;
import com.eduflow.backend.entity.Semester;
import com.eduflow.backend.entity.Subject;
import com.eduflow.backend.mapper.SubjectMapper;
import com.eduflow.backend.repository.SemesterRepository;
import com.eduflow.backend.repository.SubjectRepository;

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
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final SemesterRepository semesterRepository;

    // CREATE SUBJECT
    @Transactional
    public SubjectResponse create(CreateSubjectRequest request) {

        String name = request.name().trim();
        String code = request.code().trim().toUpperCase(Locale.ROOT);

        if (subjectRepository.existsByCode(code)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Subject code already exists"
            );
        }

        Semester semester = semesterRepository.findById(request.semesterId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Semester not found"
                ));

        Subject subject = new Subject();

        subject.setName(name);
        subject.setCode(code);
        subject.setCredits(request.credits());
        subject.setSemester(semester);

        Subject savedSubject = subjectRepository.save(subject);

        return SubjectMapper.toResponse(savedSubject);
    }

    // GET ALL SUBJECTS
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAll() {

        return subjectRepository.findAll()
                .stream()
                .map(SubjectMapper::toResponse)
                .toList();
    }

    // GET SUBJECT BY ID
    @Transactional(readOnly = true)
    public SubjectResponse getById(UUID id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Subject not found"
                ));

        return SubjectMapper.toResponse(subject);
    }

    // GET SUBJECTS BY SEMESTER
    @Transactional(readOnly = true)
    public List<SubjectResponse> getBySemester(UUID semesterId) {

        if (!semesterRepository.existsById(semesterId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Semester not found"
            );
        }

        return subjectRepository.findAllBySemester_Id(semesterId)
                .stream()
                .map(SubjectMapper::toResponse)
                .toList();
    }

    // UPDATE SUBJECT
    @Transactional
    public SubjectResponse update(UUID id, UpdateSubjectRequest request) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Subject not found"
                ));

        String name = request.name().trim();
        String code = request.code().trim().toUpperCase(Locale.ROOT);

        if (subjectRepository.existsByCodeAndIdNot(code, id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Subject code already exists"
            );
        }

        Semester semester = semesterRepository.findById(request.semesterId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Semester not found"
                ));

        subject.setName(name);
        subject.setCode(code);
        subject.setCredits(request.credits());
        subject.setSemester(semester);

        Subject updatedSubject = subjectRepository.save(subject);

        return SubjectMapper.toResponse(updatedSubject);
    }
}
