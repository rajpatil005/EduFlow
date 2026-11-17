
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.response.StudentResponse;
import com.eduflow.backend.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentResponse toResponse(Student student) {

        return new StudentResponse(
                student.getId(),
                student.getUser().getId(),
                student.getUser().getName(),
                student.getUser().getEmail(),
                student.getEnrollmentNo(),
                student.getRollNo(),
                student.getDivision().getId(),
                student.getDivision().getName(),
                student.isActive()
        );
    }
}
