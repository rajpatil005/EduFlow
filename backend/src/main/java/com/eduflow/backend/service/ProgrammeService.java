
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateProgrammeRequest;
import com.eduflow.backend.dto.request.UpdateProgrammeRequest;
import com.eduflow.backend.dto.response.ProgrammeResponse;
import com.eduflow.backend.entity.Department;
import com.eduflow.backend.entity.Programme;
import com.eduflow.backend.mapper.ProgrammeMapper;
import com.eduflow.backend.repository.DepartmentRepository;
import com.eduflow.backend.repository.ProgrammeRepository;

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
public class ProgrammeService {

    private final ProgrammeRepository programmeRepository;
    private final DepartmentRepository departmentRepository;


    // CREATE PROGRAMME
    @Transactional
    public ProgrammeResponse createProgramme(CreateProgrammeRequest request) {

        String name = request.name().trim();
        String code = request.code().trim().toUpperCase(Locale.ROOT);

        if (programmeRepository.existsByCode(code)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Programme code already exists"
            );
        }

        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Department not found"
                ));

        Programme programme = new Programme();

        programme.setName(name);
        programme.setCode(code);
        programme.setDepartment(department);

        Programme savedProgramme = programmeRepository.save(programme);

        return ProgrammeMapper.toResponse(savedProgramme);
    }


    // GET ALL PROGRAMMES
    @Transactional(readOnly = true)
    public List<ProgrammeResponse> getAllProgrammes() {

        return programmeRepository.findAll()
                .stream()
                .map(ProgrammeMapper::toResponse)
                .toList();
    }


    // GET PROGRAMME BY ID
    @Transactional(readOnly = true)
    public ProgrammeResponse getProgrammeById(UUID id) {

        Programme programme = programmeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Programme not found"
                ));

        return ProgrammeMapper.toResponse(programme);
    }


    // GET PROGRAMMES BY DEPARTMENT
    @Transactional(readOnly = true)
    public List<ProgrammeResponse> getProgrammesByDepartment(UUID departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Department not found"
            );
        }

        return programmeRepository.findAllByDepartment_Id(departmentId)
                .stream()
                .map(ProgrammeMapper::toResponse)
                .toList();
    }


    // UPDATE PROGRAMME
    @Transactional
    public ProgrammeResponse updateProgramme(
            UUID id,
            UpdateProgrammeRequest request
    ) {

        Programme programme = programmeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Programme not found"
                ));

        String name = request.name().trim();
        String code = request.code().trim().toUpperCase(Locale.ROOT);

        if (programmeRepository.existsByCodeAndIdNot(code, id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Programme code already exists"
            );
        }

        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Department not found"
                ));

        programme.setName(name);
        programme.setCode(code);
        programme.setDepartment(department);

        Programme updatedProgramme = programmeRepository.save(programme);

        return ProgrammeMapper.toResponse(updatedProgramme);
    }
}
