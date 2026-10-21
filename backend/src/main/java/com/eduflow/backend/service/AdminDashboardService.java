package com.eduflow.backend.service;

import com.eduflow.backend.dto.AdminDashboardResponse;
import com.eduflow.backend.repository.AdminDashboardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminDashboardService {

    private final AdminDashboardRepository dashboardRepository;

    public AdminDashboardService(AdminDashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStats() {
        return dashboardRepository.getDashboardStats();
    }
}
