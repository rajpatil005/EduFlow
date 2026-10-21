
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.AssessmentMark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AssessmentMarkRepository
        extends JpaRepository<AssessmentMark, UUID> {

    List<AssessmentMark> findByStudentId(UUID studentId);

    List<AssessmentMark> findByAssessmentId(UUID assessmentId);

    List<AssessmentMark> findByStudentIdAndAssessmentId(
            UUID studentId,
            UUID assessmentId
    );
}
