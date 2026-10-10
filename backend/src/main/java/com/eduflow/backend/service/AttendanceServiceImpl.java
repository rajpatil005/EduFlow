
package com.eduflow.backend.service;

import com.eduflow.backend.dto.AttendanceRecordRequest;
import com.eduflow.backend.dto.AttendanceRecordResponse;
import com.eduflow.backend.entity.AttendanceRecord;
import com.eduflow.backend.mapper.AttendanceMapper;
import com.eduflow.backend.repository.AttendanceRecordRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRecordRepository repository;
    private final AttendanceMapper mapper;

    public AttendanceServiceImpl(
            AttendanceRecordRepository repository,
            AttendanceMapper mapper
    ) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public AttendanceRecordResponse create(
            AttendanceRecordRequest request
    ) {
        AttendanceRecord record = new AttendanceRecord();
        applyRequest(record, request);

        AttendanceRecord saved = repository.save(record);
        return mapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceRecordResponse getById(UUID id) {
        return mapper.toResponse(findRecord(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordResponse> getByStudent(UUID studentId) {
        return repository.findByStudentId(studentId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordResponse> getBySubject(UUID subjectId) {
        return repository.findBySubjectId(subjectId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecordResponse> getByDate(LocalDate date) {
        return repository.findByDate(date)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public AttendanceRecordResponse update(
            UUID id,
            AttendanceRecordRequest request
    ) {
        AttendanceRecord record = findRecord(id);
        applyRequest(record, request);

        AttendanceRecord saved = repository.save(record);
        return mapper.toResponse(saved);
    }

    @Override
    public void delete(UUID id) {
        AttendanceRecord record = findRecord(id);
        repository.delete(record);
    }

    private void applyRequest(
            AttendanceRecord record,
            AttendanceRecordRequest request
    ) {
        record.setStudentId(request.studentId());
        record.setSubjectId(request.subjectId());
        record.setDate(request.date());
        record.setStatus(request.status());
        record.setTeacherAssignmentId(
                request.teacherAssignmentId()
        );
    }

    private AttendanceRecord findRecord(UUID id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "Attendance record not found: " + id
                        )
                );
    }
}
