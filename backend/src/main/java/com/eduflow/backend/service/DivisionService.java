
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateDivisionRequest;
import com.eduflow.backend.dto.request.UpdateDivisionRequest;
import com.eduflow.backend.dto.response.DivisionResponse;
import com.eduflow.backend.entity.Division;
import com.eduflow.backend.entity.Semester;
import com.eduflow.backend.mapper.DivisionMapper;
import com.eduflow.backend.repository.DivisionRepository;
import com.eduflow.backend.repository.SemesterRepository;

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
public class DivisionService {

    private final DivisionRepository divisionRepository;
    private final SemesterRepository semesterRepository;


    // CREATE DIVISION
    @Transactional
    public DivisionResponse createDivision(CreateDivisionRequest request) {

        String name = request.name().trim().toUpperCase(Locale.ROOT);

        Semester semester = semesterRepository.findById(request.semesterId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Semester not found"
                ));

        if (divisionRepository.existsBySemester_IdAndName(
                request.semesterId(),
                name
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This division already exists in the selected semester"
            );
        }

        Division division = new Division();

        division.setName(name);
        division.setSemester(semester);

        Division savedDivision = divisionRepository.save(division);

        return DivisionMapper.toResponse(savedDivision);
    }


    // GET ALL DIVISIONS
    @Transactional(readOnly = true)
    public List<DivisionResponse> getAllDivisions() {

        return divisionRepository.findAll()
                .stream()
                .map(DivisionMapper::toResponse)
                .toList();
    }


    // GET DIVISION BY ID
    @Transactional(readOnly = true)
    public DivisionResponse getDivisionById(UUID id) {

        Division division = divisionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Division not found"
                ));

        return DivisionMapper.toResponse(division);
    }


    // GET DIVISIONS BY SEMESTER
    @Transactional(readOnly = true)
    public List<DivisionResponse> getDivisionsBySemester(UUID semesterId) {

        if (!semesterRepository.existsById(semesterId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Semester not found"
            );
        }

        return divisionRepository.findAllBySemester_Id(semesterId)
                .stream()
                .map(DivisionMapper::toResponse)
                .toList();
    }


    // UPDATE DIVISION
    @Transactional
    public DivisionResponse updateDivision(
            UUID id,
            UpdateDivisionRequest request
    ) {

        Division division = divisionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Division not found"
                ));

        String name = request.name().trim().toUpperCase(Locale.ROOT);

        Semester semester = semesterRepository.findById(request.semesterId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Semester not found"
                ));

        if (divisionRepository.existsBySemester_IdAndNameAndIdNot(
                request.semesterId(),
                name,
                id
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This division already exists in the selected semester"
            );
        }

        division.setName(name);
        division.setSemester(semester);

        Division updatedDivision = divisionRepository.save(division);

        return DivisionMapper.toResponse(updatedDivision);
    }
}
