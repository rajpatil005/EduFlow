
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.CreateAssessmentRequest;
import com.eduflow.backend.dto.request.SubmitMarksRequest;
import com.eduflow.backend.dto.request.UpdateAssessmentRequest;
import com.eduflow.backend.dto.response.AssessmentResponse;
import com.eduflow.backend.dto.response.StudentMarksEntryResponse;
import com.eduflow.backend.entity.*;
import com.eduflow.backend.mapper.AssessmentMapper;
import com.eduflow.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentComponentRepository componentRepository;
    private final TeacherAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final AssessmentMarkRepository markRepository;
    private final UserRepository userRepository;
    private final AssessmentMapper mapper;

    @Transactional
    public AssessmentResponse create(
            CreateAssessmentRequest request,
            String teacherEmail
    ) {
        UUID userId = getUserId(teacherEmail);

        TeacherAssignment assignment = assignmentRepository
                .findByIdAndTeacher_UserId(
                        request.teacherAssignmentId(),
                        userId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You are not assigned to this subject and division"
                ));

        AssessmentComponent component = componentRepository
                .findById(request.assessmentComponentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assessment component not found"
                ));

        if (!component.getSubject().getId()
                .equals(assignment.getSubject().getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Assessment component does not belong to the assigned subject"
            );
        }

        if (request.maxMarks() > component.getMaxMarks()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Assessment maximum marks cannot exceed component maximum marks"
            );
        }

        Assessment assessment = new Assessment(
                component,
                assignment,
                request.name().trim(),
                request.maxMarks(),
                request.assessmentDate()
        );

        return mapper.toResponse(
                assessmentRepository.save(assessment)
        );
    }

    @Transactional(readOnly = true)
    public List<AssessmentResponse> getMyAssessments(
            String teacherEmail
    ) {
        UUID userId = getUserId(teacherEmail);

        return assessmentRepository
                .findAllByTeacherAssignment_Teacher_UserIdOrderByAssessmentDateDesc(
                        userId
                )
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssessmentResponse getOne(
            UUID id,
            String teacherEmail
    ) {
        return mapper.toResponse(
                getOwnedAssessment(id, teacherEmail)
        );
    }

    @Transactional
    public AssessmentResponse update(
            UUID id,
            UpdateAssessmentRequest request,
            String teacherEmail
    ) {
        Assessment assessment = getOwnedAssessment(id, teacherEmail);

        if (request.maxMarks() >
                assessment.getAssessmentComponent().getMaxMarks()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Assessment maximum marks cannot exceed component maximum marks"
            );
        }

        assessment.updateDetails(
                request.name().trim(),
                request.maxMarks(),
                request.assessmentDate()
        );

        return mapper.toResponse(assessment);
    }

    @Transactional(readOnly = true)
    public List<StudentMarksEntryResponse> getStudents(
            UUID assessmentId,
            String teacherEmail
    ) {
        Assessment assessment = getOwnedAssessment(
                assessmentId,
                teacherEmail
        );

        UUID divisionId = assessment.getTeacherAssignment()
                .getDivision().getId();

        List<Student> students = studentRepository
                .findAllByDivision_IdAndActiveTrueOrderByRollNoAsc(
                        divisionId
                );

        return students.stream().map(student -> {
            var existingMark = markRepository
                    .findByAssessment_IdAndStudent_Id(
                            assessmentId,
                            student.getId()
                    );

            return new StudentMarksEntryResponse(
                    student.getId(),
                    student.getUser().getName(),
                    student.getEnrollmentNo(),
                    student.getRollNo(),
                    existingMark
                            .map(AssessmentMark::getMarksObtained)
                            .orElse(null)
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<StudentMarksEntryResponse> getMarks(
            UUID assessmentId,
            String teacherEmail
    ) {
        getOwnedAssessment(assessmentId, teacherEmail);

        return markRepository
                .findAllByAssessment_Id(assessmentId)
                .stream()
                .map(mark -> new StudentMarksEntryResponse(
                        mark.getStudent().getId(),
                        mark.getStudent().getUser().getName(),
                        mark.getStudent().getEnrollmentNo(),
                        mark.getStudent().getRollNo(),
                        mark.getMarksObtained()
                ))
                .toList();
    }

    @Transactional
    public void saveMarks(
            UUID assessmentId,
            SubmitMarksRequest request,
            String teacherEmail
    ) {
        Assessment assessment = getOwnedAssessment(
                assessmentId,
                teacherEmail
        );

        if (assessment.getStatus() != AssessmentStatus.DRAFT &&
                assessment.getStatus() != AssessmentStatus.RETURNED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Marks cannot be changed after submission"
            );
        }

        UUID divisionId = assessment.getTeacherAssignment()
                .getDivision().getId();

        for (var entry : request.marks()) {

            if (entry.marksObtained().compareTo(
                    BigDecimal.valueOf(assessment.getMaxMarks())
            ) > 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Marks cannot exceed the assessment maximum marks"
                );
            }

            Student student = studentRepository
                    .findById(entry.studentId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Student not found"
                    ));

            if (!student.isActive() ||
                    !student.getDivision().getId().equals(divisionId)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Student is inactive or does not belong to this assessment division"
                );
            }

            AssessmentMark mark = markRepository
                    .findByAssessment_IdAndStudent_Id(
                            assessmentId,
                            student.getId()
                    )
                    .orElseGet(() -> new AssessmentMark(
                            assessment,
                            student,
                            entry.marksObtained()
                    ));

            mark.updateMarks(entry.marksObtained());
            markRepository.save(mark);
        }
    }

    @Transactional
    public AssessmentResponse submit(
            UUID assessmentId,
            String teacherEmail
    ) {
        Assessment assessment = getOwnedAssessment(
                assessmentId,
                teacherEmail
        );

        long activeStudentCount = studentRepository
                .findAllByDivision_IdAndActiveTrueOrderByRollNoAsc(
                        assessment.getTeacherAssignment()
                                .getDivision().getId()
                )
                .size();

        long enteredMarksCount = markRepository
                .findAllByAssessment_Id(assessmentId)
                .size();

        if (activeStudentCount == 0 ||
                enteredMarksCount != activeStudentCount) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter marks for every active student before submitting"
            );
        }

        assessment.submit();

        return mapper.toResponse(assessment);
    }

    private Assessment getOwnedAssessment(
            UUID assessmentId,
            String teacherEmail
    ) {
        UUID userId = getUserId(teacherEmail);

        return assessmentRepository
                .findByIdAndTeacherAssignment_Teacher_UserId(
                        assessmentId,
                        userId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assessment not found"
                ));
    }

    private UUID getUserId(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"
                ))
                .getId();
    }
}
