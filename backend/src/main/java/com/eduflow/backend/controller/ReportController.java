
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.StudentAttendanceSummaryResponse;
import com.eduflow.backend.dto.StudentMarksReportResponse;
import com.eduflow.backend.service.StudentAttendanceReportService;
import com.eduflow.backend.service.StudentMarksReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final StudentAttendanceReportService reportService;
    private final StudentMarksReportService marksReportService;

    public ReportController(
            StudentAttendanceReportService reportService,
            StudentMarksReportService marksReportService
    ) {
        this.reportService = reportService;
        this.marksReportService = marksReportService;
    }

    @GetMapping("/students/{studentId}/attendance-summary")
    public StudentAttendanceSummaryResponse getStudentAttendanceSummary(
            @PathVariable UUID studentId
    ) {
        return reportService.getSummary(studentId);
    }

    @GetMapping("/students/{studentId}/marks")
    public List<StudentMarksReportResponse> getStudentMarks(
            @PathVariable UUID studentId
    ) {
        return marksReportService.getStudentMarks(studentId);
    }
}
