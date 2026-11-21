
package com.eduflow.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record SubmitMarksRequest(
        @NotEmpty List<@Valid StudentMarkEntry> marks
) {
    public record StudentMarkEntry(
            @NotNull UUID studentId,
            @NotNull @DecimalMin("0.00") BigDecimal marksObtained
    ) {}
}
