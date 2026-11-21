
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.Assessment;
import com.eduflow.backend.entity.AssessmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssessmentRepository
        extends JpaRepository<Assessment, UUID> {

    // Teacher queries

    List<Assessment>
    findAllByTeacherAssignment_Teacher_UserIdOrderByAssessmentDateDesc(
            UUID userId
    );

    Optional<Assessment>
    findByIdAndTeacherAssignment_Teacher_UserId(
            UUID id,
            UUID userId
    );

    List<Assessment>
    findAllByTeacherAssignment_IdOrderByAssessmentDateDesc(
            UUID assignmentId
    );

    // HOD queries

    List<Assessment>
    findAllByStatusAndTeacherAssignment_Division_Semester_Programme_Department_IdOrderBySubmittedAtDesc(
            AssessmentStatus status,
            UUID departmentId
    );

    Optional<Assessment>
    findByIdAndStatusAndTeacherAssignment_Division_Semester_Programme_Department_Id(
            UUID id,
            AssessmentStatus status,
            UUID departmentId
    );
}
