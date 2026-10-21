package com.eduflow.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record StudentMarksReportResponse(
        UUID assessmentId,
        String assessmentName,
        BigDecimal marksObtained,
        Integer maxMarks,
        LocalDate assessmentDate,
        BigDecimal percentage
) {}