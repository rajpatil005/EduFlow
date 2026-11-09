package com.eduflow.backend.dto.response;

import java.util.UUID;

public record TeacherAssignmentResponse(

        UUID id,

        UUID teacherId,

        UUID subjectId,
        String subjectName,
        String subjectCode,

        UUID divisionId,
        String divisionName,

        UUID semesterId,
        String semesterName,

        UUID academicYearId,
        String academicYearName,

        String assignmentType

) {
}