
package com.eduflow.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReturnAssessmentRequest(

        @NotBlank(message = "Correction remark is required")
        @Size(max = 500, message = "Remark cannot exceed 500 characters")
        String remark

) {
}
