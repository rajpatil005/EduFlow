package com.eduflow.backend.repository;

import com.eduflow.backend.entity.TeacherAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TeacherAssignmentRepository
        extends JpaRepository<TeacherAssignment, UUID> {

    boolean existsBySubject_IdAndDivision_IdAndAcademicYear_IdAndAssignmentType(
            UUID subjectId,
            UUID divisionId,
            UUID academicYearId,
            String assignmentType
    );

    boolean existsBySubject_IdAndDivision_IdAndAcademicYear_IdAndAssignmentTypeAndIdNot(
            UUID subjectId,
            UUID divisionId,
            UUID academicYearId,
            String assignmentType,
            UUID id
    );

    List<TeacherAssignment> findAllByTeacher_Id(UUID teacherId);

    List<TeacherAssignment> findAllByDivision_Id(UUID divisionId);

    List<TeacherAssignment> findAllByAcademicYear_Id(UUID academicYearId);
}