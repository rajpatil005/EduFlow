
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateAssessmentComponentRequest;
import com.eduflow.backend.dto.request.UpdateAssessmentComponentRequest;
import com.eduflow.backend.dto.response.AssessmentComponentResponse;
import com.eduflow.backend.entity.AssessmentComponent;
import com.eduflow.backend.mapper.AssessmentComponentMapper;
import com.eduflow.backend.repository.AssessmentComponentRepository;
import com.eduflow.backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssessmentComponentService {

    private final AssessmentComponentRepository componentRepository;
    private final SubjectRepository subjectRepository;
    private final AssessmentComponentMapper mapper;

    @Transactional
    public AssessmentComponentResponse create(
            CreateAssessmentComponentRequest request
    ) {
        var subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subject not found"
                ));

        if (componentRepository.existsBySubject_IdAndCodeIgnoreCase(
                request.subjectId(), request.code()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Component code already exists for this subject"
            );
        }

        AssessmentComponent component = new AssessmentComponent(
                subject,
                request.code().trim(),
                request.name().trim(),
                request.maxMarks(),
                request.weightage(),
                request.displayOrder()
        );

        return mapper.toResponse(componentRepository.save(component));
    }

    @Transactional(readOnly = true)
    public List<AssessmentComponentResponse> getAll(UUID subjectId) {
        List<AssessmentComponent> components = subjectId == null
                ? componentRepository.findAll()
                : componentRepository.findAllBySubject_IdOrderByDisplayOrderAsc(subjectId);

        return components.stream().map(mapper::toResponse).toList();
    }

    @Transactional
    public AssessmentComponentResponse update(
            UUID id,
            UpdateAssessmentComponentRequest request
    ) {
        AssessmentComponent component = componentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Assessment component not found"
                ));

        var subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subject not found"
                ));

        if (componentRepository.existsBySubject_IdAndCodeIgnoreCaseAndIdNot(
                request.subjectId(), request.code(), id
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Component code already exists for this subject"
            );
        }

        component.updateDetails(
                subject,
                request.code().trim(),
                request.name().trim(),
                request.maxMarks(),
                request.weightage(),
                request.displayOrder()
        );

        return mapper.toResponse(component);
    }
}
