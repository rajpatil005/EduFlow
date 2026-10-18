package com.eduflow.backend.repository;

import com.eduflow.backend.entity.DepartmentHodAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DepartmentHodAssignmentRepository
        extends JpaRepository<DepartmentHodAssignment, UUID> {

    Optional<DepartmentHodAssignment>
    findByDepartmentIdAndEndedAtIsNull(UUID departmentId);

    List<DepartmentHodAssignment>
    findAllByDepartmentIdOrderByAssignedAtDesc(UUID departmentId);
}