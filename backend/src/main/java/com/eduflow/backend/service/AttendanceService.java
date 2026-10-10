
package com.eduflow.backend.service;

import com.eduflow.backend.dto.AttendanceRecordRequest;
import com.eduflow.backend.dto.AttendanceRecordResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AttendanceService {

    AttendanceRecordResponse create(
            AttendanceRecordRequest request
    );

    AttendanceRecordResponse getById(UUID id);

    List<AttendanceRecordResponse> getAll();

    List<AttendanceRecordResponse> getByStudent(UUID studentId);

    List<AttendanceRecordResponse> getBySubject(UUID subjectId);

    List<AttendanceRecordResponse> getByDate(LocalDate date);

    AttendanceRecordResponse update(
            UUID id,
            AttendanceRecordRequest request
    );

    void delete(UUID id);
}
