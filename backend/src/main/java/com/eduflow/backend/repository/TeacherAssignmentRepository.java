package com.eduflow.backend.repository;

import com.eduflow.backend.entity.TeacherAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TeacherAssignmentRepository
        extends JpaRepository<TeacherAssignment, UUID> {

    List<TeacherAssignment> findByTeacherId(UUID teacherId);

    List<TeacherAssignment> findBySubjectId(UUID subjectId);

    List<TeacherAssignment> findByDivisionId(UUID divisionId);

    List<TeacherAssignment> findByAcademicYearId(UUID academicYearId);

    List<TeacherAssignment> findByTeacherIdAndAcademicYearId(
            UUID teacherId,
            UUID academicYearId
    );

    @Query("""
    SELECT a
    FROM TeacherAssignment a
    JOIN Teacher t ON t.id = a.teacherId
    WHERE t.departmentId = :departmentId
    """)
    List<TeacherAssignment> findByTeacherDepartmentId(
            @Param("departmentId") UUID departmentId
    );

    List<TeacherAssignment> findByDivisionIdAndAcademicYearId(
            UUID divisionId,
            UUID academicYearId
    );

    boolean existsBySubjectIdAndDivisionIdAndAcademicYearIdAndAssignmentType(
            UUID subjectId,
            UUID divisionId,
            UUID academicYearId,
            String assignmentType
    );

    boolean existsBySubjectIdAndDivisionIdAndAcademicYearIdAndAssignmentTypeAndIdNot(
            UUID subjectId,
            UUID divisionId,
            UUID academicYearId,
            String assignmentType,
            UUID id
    );
}
