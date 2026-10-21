
package com.eduflow.backend.service;

import com.eduflow.backend.dto.HodDepartmentReportResponse;
import com.eduflow.backend.repository.HodReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HodReportService {

    private final HodReportRepository hodReportRepository;

    public HodReportService(HodReportRepository hodReportRepository) {
        this.hodReportRepository = hodReportRepository;
    }

    @Transactional(readOnly = true)
    public List<HodDepartmentReportResponse> getDepartmentReports() {
        return hodReportRepository.getDepartmentReports();
    }
}
