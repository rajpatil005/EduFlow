package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.TeacherAssignmentResponse;
import com.eduflow.backend.entity.TeacherAssignment;

public class TeacherAssignmentMapper {

    public static TeacherAssignmentResponse toResponse(
            TeacherAssignment assignment
    ) {

        return new TeacherAssignmentResponse(

                assignment.getId(),

                assignment.getTeacher().getId(),

                assignment.getSubject().getId(),
                assignment.getSubject().getName(),
                assignment.getSubject().getCode(),

                assignment.getDivision().getId(),
                assignment.getDivision().getName(),

                assignment.getDivision().getSemester().getId(),
                assignment.getDivision().getSemester().getName(),

                assignment.getAcademicYear().getId(),
                assignment.getAcademicYear().getName(),

                assignment.getAssignmentType()
        );
    }
}