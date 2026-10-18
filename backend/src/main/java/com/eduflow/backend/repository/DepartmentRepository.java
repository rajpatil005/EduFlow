package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DepartmentRepository
        extends JpaRepository<Department, UUID> {
}