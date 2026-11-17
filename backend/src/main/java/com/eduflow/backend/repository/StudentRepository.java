
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StudentRepository
        extends JpaRepository<Student, UUID> {

    boolean existsByEnrollmentNo(String enrollmentNo);

    boolean existsByEnrollmentNoAndIdNot(
            String enrollmentNo,
            UUID id
    );

    boolean existsByDivision_IdAndRollNo(
            UUID divisionId,
            String rollNo
    );

    boolean existsByDivision_IdAndRollNoAndIdNot(
            UUID divisionId,
            String rollNo,
            UUID id
    );

    List<Student> findAllByOrderByEnrollmentNoAsc();

    List<Student> findAllByDivision_IdOrderByRollNoAsc(
            UUID divisionId
    );

    List<Student> findAllByDivision_IdAndActiveTrueOrderByRollNoAsc(
            UUID divisionId
    );
}
