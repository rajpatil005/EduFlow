
package com.eduflow.backend.dto.response;

import java.util.UUID;

public record DepartmentStaffResponse(
        UUID teacherId,
        String employeeId,
        String name,
        String email,
        boolean isActive
) {}
