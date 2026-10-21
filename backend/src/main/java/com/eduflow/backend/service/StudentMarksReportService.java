package com.eduflow.backend.service;

import com.eduflow.backend.dto.StudentMarksReportResponse;
import com.eduflow.backend.entity.Assessment;
import com.eduflow.backend.entity.AssessmentMark;
import com.eduflow.backend.repository.AssessmentMarkRepository;
import com.eduflow.backend.repository.AssessmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class StudentMarksReportService {

    private final AssessmentMarkRepository marksRepository;
    private final AssessmentRepository assessmentRepository;

    public StudentMarksReportService(
            AssessmentMarkRepository marksRepository,
            AssessmentRepository assessmentRepository
    ) {
        this.marksRepository = marksRepository;
        this.assessmentRepository = assessmentRepository;
    }

    @Transactional(readOnly = true)
    public List<StudentMarksReportResponse> getStudentMarks(UUID studentId) {

        List<AssessmentMark> marks =
                marksRepository.findByStudentId(studentId);

        List<StudentMarksReportResponse> reports = new ArrayList<>();

        for (AssessmentMark mark : marks) {
            Assessment assessment = assessmentRepository
                    .findById(mark.getAssessmentId())
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "Assessment not found: "
                                            + mark.getAssessmentId()
                            )
                    );

            BigDecimal percentage = BigDecimal.ZERO;

            if (assessment.getMaxMarks() != null
                    && assessment.getMaxMarks() > 0) {
                percentage = mark.getMarksObtained()
                        .multiply(BigDecimal.valueOf(100))
                        .divide(
                                BigDecimal.valueOf(assessment.getMaxMarks()),
                                2,
                                RoundingMode.HALF_UP
                        );
            }

            reports.add(new StudentMarksReportResponse(
                    assessment.getId(),
                    assessment.getName(),
                    mark.getMarksObtained(),
                    assessment.getMaxMarks(),
                    assessment.getAssessmentDate(),
                    percentage
            ));
        }

        return reports;
    }
}