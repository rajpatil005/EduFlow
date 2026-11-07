package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AssignHodRequest(

        @NotNull(message = "Teacher ID is required")
        UUID teacherId

) {}