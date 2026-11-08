
package com.eduflow.backend.dto.response;

import java.util.List;
import java.util.UUID;

public record DepartmentOverviewResponse(
        UUID departmentId,
        String departmentName,
        String departmentCode,
        DepartmentStaffResponse hod,
        List<DepartmentStaffResponse> teachers
) {}
