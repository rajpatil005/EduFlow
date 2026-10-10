
package com.eduflow.backend.repository;

import com.eduflow.backend.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AttendanceRecordRepository
        extends JpaRepository<AttendanceRecord, UUID> {

    List<AttendanceRecord> findByStudentId(UUID studentId);

    List<AttendanceRecord> findBySubjectId(UUID subjectId);

    List<AttendanceRecord> findByDate(LocalDate date);

    List<AttendanceRecord> findByStudentIdAndSubjectId(
            UUID studentId,
            UUID subjectId
    );

    List<AttendanceRecord> findBySubjectIdAndDate(
            UUID subjectId,
            LocalDate date
    );

    List<AttendanceRecord> findByTeacherAssignmentId(
            UUID teacherAssignmentId
    );
}
