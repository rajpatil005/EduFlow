
package com.eduflow.backend.service;

import com.eduflow.backend.dto.StudentMarksReportResponse;
import com.eduflow.backend.entity.Assessment;
import com.eduflow.backend.entity.AssessmentMark;
import com.eduflow.backend.repository.AssessmentMarkRepository;
import com.eduflow.backend.repository.AssessmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentMarksReportServiceTest {

    @Mock
    private AssessmentMarkRepository marksRepository;

    @Mock
    private AssessmentRepository assessmentRepository;

    @InjectMocks
    private StudentMarksReportService reportService;

    @Test
    void shouldReturnMarksWithAssessmentDetails() {
        UUID studentId = UUID.randomUUID();
        UUID assessmentId = UUID.randomUUID();

        AssessmentMark mark = new AssessmentMark();
        mark.setStudentId(studentId);
        mark.setAssessmentId(assessmentId);
        mark.setMarksObtained(new BigDecimal("18.50"));

        Assessment assessment = new Assessment();
        assessment.setName("Unit Test 1");
        assessment.setMaxMarks(25);
        assessment.setAssessmentDate(LocalDate.of(2026, 10, 1));

        when(marksRepository.findByStudentId(studentId))
                .thenReturn(List.of(mark));
        when(assessmentRepository.findById(assessmentId))
                .thenReturn(Optional.of(assessmentWithId(assessment, assessmentId)));

        List<StudentMarksReportResponse> result =
                reportService.getStudentMarks(studentId);

        assertEquals(1, result.size());
        assertEquals("Unit Test 1", result.get(0).assessmentName());
        assertEquals(new BigDecimal("18.50"), result.get(0).marksObtained());
        assertEquals(25, result.get(0).maxMarks());
        assertEquals(new BigDecimal("74.00"), result.get(0).percentage());
    }

    @Test
    void shouldReturnEmptyListWhenStudentHasNoMarks() {
        UUID studentId = UUID.randomUUID();

        when(marksRepository.findByStudentId(studentId))
                .thenReturn(List.of());

        List<StudentMarksReportResponse> result =
                reportService.getStudentMarks(studentId);

        assertEquals(0, result.size());
    }

    private Assessment assessmentWithId(Assessment assessment, UUID id) {
        try {
            var field = Assessment.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(assessment, id);
            return assessment;
        } catch (ReflectiveOperationException exception) {
            throw new IllegalStateException(exception);
        }
    }
}
