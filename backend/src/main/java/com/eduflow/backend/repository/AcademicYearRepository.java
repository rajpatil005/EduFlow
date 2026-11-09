package com.eduflow.backend.repository;

import com.eduflow.backend.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AcademicYearRepository
        extends JpaRepository<AcademicYear, UUID> {
    boolean existsByName(String name);
    Optional<AcademicYear> findByIsActiveTrue();
}
