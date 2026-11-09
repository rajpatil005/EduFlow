
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Division;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DivisionRepository extends JpaRepository<Division, UUID> {

    boolean existsBySemester_IdAndName(
            UUID semesterId,
            String name
    );

    boolean existsBySemester_IdAndNameAndIdNot(
            UUID semesterId,
            String name,
            UUID id
    );

    List<Division> findAllBySemester_Id(UUID semesterId);
}
