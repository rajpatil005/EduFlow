
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.AssessmentComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssessmentComponentRepository
        extends JpaRepository<AssessmentComponent, UUID> {

    List<AssessmentComponent> findAllBySubject_IdOrderByDisplayOrderAsc(
            UUID subjectId
    );

    boolean existsBySubject_IdAndCodeIgnoreCase(UUID subjectId, String code);

    boolean existsBySubject_IdAndCodeIgnoreCaseAndIdNot(
            UUID subjectId,
            String code,
            UUID id
    );
}
