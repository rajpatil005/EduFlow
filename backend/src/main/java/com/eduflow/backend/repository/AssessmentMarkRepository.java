
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.AssessmentMark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssessmentMarkRepository
        extends JpaRepository<AssessmentMark, UUID> {

    List<AssessmentMark> findAllByAssessment_Id(UUID assessmentId);

    Optional<AssessmentMark> findByAssessment_IdAndStudent_Id(
            UUID assessmentId,
            UUID studentId
    );

    boolean existsByAssessment_Id(UUID assessmentId);
}
