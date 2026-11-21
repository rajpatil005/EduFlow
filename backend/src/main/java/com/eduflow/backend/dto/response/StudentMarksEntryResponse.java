
package com.eduflow.backend.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record StudentMarksEntryResponse(
        UUID studentId,
        String name,
        String enrollmentNo,
        String rollNo,
        BigDecimal marksObtained
) {}
