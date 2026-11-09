
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateSemesterRequest;
import com.eduflow.backend.dto.request.UpdateSemesterRequest;
import com.eduflow.backend.dto.response.SemesterResponse;
import com.eduflow.backend.entity.Programme;
import com.eduflow.backend.entity.Semester;
import com.eduflow.backend.mapper.SemesterMapper;
import com.eduflow.backend.repository.ProgrammeRepository;
import com.eduflow.backend.repository.SemesterRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SemesterService {

    private final SemesterRepository semesterRepository;
    private final ProgrammeRepository programmeRepository;


    // CREATE SEMESTER
    @Transactional
    public SemesterResponse createSemester(CreateSemesterRequest request) {

        Programme programme = programmeRepository.findById(request.programmeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Programme not found"
                ));

        if (semesterRepository.existsByProgramme_IdAndNumber(
                request.programmeId(),
                request.number()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This semester number already exists in the selected programme"
            );
        }

        Semester semester = new Semester();

        semester.setName(request.name().trim());
        semester.setNumber(request.number());
        semester.setProgramme(programme);

        Semester savedSemester = semesterRepository.save(semester);

        return SemesterMapper.toResponse(savedSemester);
    }


    // GET ALL SEMESTERS
    @Transactional(readOnly = true)
    public List<SemesterResponse> getAllSemesters() {

        return semesterRepository.findAll()
                .stream()
                .map(SemesterMapper::toResponse)
                .toList();
    }


    // GET SEMESTER BY ID
    @Transactional(readOnly = true)
    public SemesterResponse getSemesterById(UUID id) {

        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Semester not found"
                ));

        return SemesterMapper.toResponse(semester);
    }


    // GET SEMESTERS BY PROGRAMME
    @Transactional(readOnly = true)
    public List<SemesterResponse> getSemestersByProgramme(UUID programmeId) {

        if (!programmeRepository.existsById(programmeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Programme not found"
            );
        }

        return semesterRepository.findAllByProgramme_Id(programmeId)
                .stream()
                .map(SemesterMapper::toResponse)
                .toList();
    }


    // UPDATE SEMESTER
    @Transactional
    public SemesterResponse updateSemester(
            UUID id,
            UpdateSemesterRequest request
    ) {

        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Semester not found"
                ));

        Programme programme = programmeRepository.findById(request.programmeId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Programme not found"
                ));

        if (semesterRepository.existsByProgramme_IdAndNumberAndIdNot(
                request.programmeId(),
                request.number(),
                id
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This semester number already exists in the selected programme"
            );
        }

        semester.setName(request.name().trim());
        semester.setNumber(request.number());
        semester.setProgramme(programme);

        Semester updatedSemester = semesterRepository.save(semester);

        return SemesterMapper.toResponse(updatedSemester);
    }
}
