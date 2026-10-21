
package com.eduflow.backend.controller;

import com.eduflow.backend.dto.HodDepartmentReportResponse;
import com.eduflow.backend.service.HodReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hod")
public class HodReportController {

    private final HodReportService hodReportService;

    public HodReportController(HodReportService hodReportService) {
        this.hodReportService = hodReportService;
    }

    @GetMapping("/reports")
    public List<HodDepartmentReportResponse> getReports() {
        return hodReportService.getDepartmentReports();
    }
}
