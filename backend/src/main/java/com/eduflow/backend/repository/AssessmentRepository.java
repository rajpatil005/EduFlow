
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AssessmentRepository
        extends JpaRepository<Assessment, UUID> {
}
