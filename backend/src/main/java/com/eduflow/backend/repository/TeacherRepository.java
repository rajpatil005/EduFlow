package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeacherRepository
        extends JpaRepository<Teacher, UUID> {

    boolean existsByEmployeeId(String employeeId);

    boolean existsByUserId(UUID userId);

    List<Teacher> findAllByDepartmentId(UUID departmentId);

    Optional<Teacher> findByUserId(UUID userId);
}