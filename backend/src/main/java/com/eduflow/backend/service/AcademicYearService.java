package com.eduflow.backend.service;

import com.eduflow.backend.entity.AcademicYear;
import com.eduflow.backend.repository.AcademicYearRepository;
import com.eduflow.backend.dto.request.CreateAcademicYearRequest;
import com.eduflow.backend.dto.response.AcademicYearResponse;
import com.eduflow.backend.mapper.AcademicYearMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicYearService {

    private final AcademicYearRepository academicYearRepository;

    // Create Academic Year
    @Transactional
    public AcademicYearResponse createAcademicYear(CreateAcademicYearRequest request) {
        if (!request.endYear().equals(request.startYear() + 1)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End year must be exactly one year after start year"
            );
        }

        String name = request.startYear() + "-" + request.endYear();

        if (academicYearRepository.existsByName(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Academic year already exists"
            );
        }

        AcademicYear academicYear = new AcademicYear();

        academicYear.setName(name);
        academicYear.setStartYear(request.startYear());
        academicYear.setEndYear(request.endYear());
        academicYear.setIsActive(false);

        AcademicYear savedAcademicYear =
                academicYearRepository.save(academicYear);

        return AcademicYearMapper.toResponse(savedAcademicYear);
    }

    // Get All Academic Years
    @Transactional(readOnly = true)
    public List<AcademicYearResponse> getAllAcademicYears() {

        return academicYearRepository.findAll()
                .stream()
                .map(AcademicYearMapper::toResponse)
                .toList();
    }

    // Get Academic Year By ID
    @Transactional(readOnly = true)
    public AcademicYearResponse getAcademicYearById(UUID id) {

        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Academic year not found"
                ));

        return AcademicYearMapper.toResponse(academicYear);
    }

    // Activate Academic Year
    @Transactional
    public AcademicYearResponse activateAcademicYear(UUID id) {

        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Academic year not found"
                ));

        if (Boolean.TRUE.equals(academicYear.getIsActive())) {
            return AcademicYearMapper.toResponse(academicYear);
        }

        academicYearRepository.findByIsActiveTrue().ifPresent(activeYear -> {
            activeYear.setIsActive(false);
            academicYearRepository.saveAndFlush(activeYear);
        });

        academicYear.setIsActive(true);

        AcademicYear savedAcademicYear =
                academicYearRepository.save(academicYear);

        return AcademicYearMapper.toResponse(savedAcademicYear);
    }
}

