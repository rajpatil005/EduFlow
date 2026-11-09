
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Programme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProgrammeRepository extends JpaRepository<Programme, UUID> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, UUID id);

    List<Programme> findAllByDepartment_Id(UUID departmentId);
}
