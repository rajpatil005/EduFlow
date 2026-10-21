package com.eduflow.backend.controller;

import com.eduflow.backend.dto.TeacherAssignmentSummaryResponse;
import com.eduflow.backend.service.TeacherDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teachers")
public class TeacherDashboardController {

    private final TeacherDashboardService dashboardService;

    public TeacherDashboardController(TeacherDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{teacherId}/dashboard/assignments")
    public List<TeacherAssignmentSummaryResponse> getAssignments(
            @PathVariable UUID teacherId) {
        return dashboardService.getAssignments(teacherId);
    }

       @GetMapping("/{teacherId}/dashboard/attendance-summary")
    public List<TeacherDashboardService.TeacherAttendanceSummaryResponse>
            getAttendanceSummary(@PathVariable UUID teacherId) {
        return dashboardService.getAttendanceSummary(teacherId);
    }
}
