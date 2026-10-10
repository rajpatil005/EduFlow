
package com.eduflow.backend.mapper;

import com.eduflow.backend.dto.AttendanceRecordResponse;
import com.eduflow.backend.entity.AttendanceRecord;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceRecordResponse toResponse(AttendanceRecord record) {
        return new AttendanceRecordResponse(
                record.getId(),
                record.getStudentId(),
                record.getSubjectId(),
                record.getDate(),
                record.getStatus(),
                record.getTeacherAssignmentId()
        );
    }
}
