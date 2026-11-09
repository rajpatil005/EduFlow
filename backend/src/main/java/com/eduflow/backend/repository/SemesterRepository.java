
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SemesterRepository extends JpaRepository<Semester, UUID> {

    boolean existsByProgramme_IdAndNumber(UUID programmeId, Integer number);

    boolean existsByProgramme_IdAndNumberAndIdNot(
            UUID programmeId,
            Integer number,
            UUID id
    );

    List<Semester> findAllByProgramme_Id(UUID programmeId);
}
