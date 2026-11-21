
package com.eduflow.backend.service;

import com.eduflow.backend.dto.request.ReturnAssessmentRequest;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HodAssessmentReviewService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentMarkRepository markRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final DepartmentHodAssignmentRepository hodAssignmentRepository;
    private final AssessmentMapper assessmentMapper;

    @Transactional(readOnly = true)
    public List<AssessmentResponse> getSubmittedAssessments(
            String hodEmail
    ) {
        UUID departmentId = getHodDepartmentId(hodEmail);

        return assessmentRepository
                .findAllByStatusAndTeacherAssignment_Division_Semester_Programme_Department_IdOrderBySubmittedAtDesc(
                        AssessmentStatus.SUBMITTED,
                        departmentId
                )
                .stream()
                .map(assessmentMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssessmentResponse getAssessment(
            UUID assessmentId,
            String hodEmail
    ) {
        Assessment assessment = getSubmittedAssessment(
                assessmentId,
                hodEmail
        );

        return assessmentMapper.toResponse(assessment);
    }

    @Transactional(readOnly = true)
    public List<StudentMarksEntryResponse> getAssessmentMarks(
            UUID assessmentId,
            String hodEmail
    ) {
        getSubmittedAssessment(assessmentId, hodEmail);

        return markRepository.findAllByAssessment_Id(assessmentId)
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
    public AssessmentResponse approveAssessment(
            UUID assessmentId,
            String hodEmail
    ) {
        User hodUser = getHodUser(hodEmail);
        UUID departmentId = getHodDepartmentId(hodEmail);

        Assessment assessment = getSubmittedAssessment(
                assessmentId,
                departmentId
        );

        assessment.approve(hodUser.getId());

        return assessmentMapper.toResponse(assessment);
    }

    @Transactional
    public AssessmentResponse returnAssessment(
            UUID assessmentId,
            ReturnAssessmentRequest request,
            String hodEmail
    ) {
        User hodUser = getHodUser(hodEmail);
        UUID departmentId = getHodDepartmentId(hodEmail);

        Assessment assessment = getSubmittedAssessment(
                assessmentId,
                departmentId
        );

        assessment.returnForCorrection(
                hodUser.getId(),
                request.remark()
        );

        return assessmentMapper.toResponse(assessment);
    }

    private Assessment getSubmittedAssessment(
            UUID assessmentId,
            String hodEmail
    ) {
        UUID departmentId = getHodDepartmentId(hodEmail);

        return getSubmittedAssessment(assessmentId, departmentId);
    }

    private Assessment getSubmittedAssessment(
            UUID assessmentId,
            UUID departmentId
    ) {
        return assessmentRepository
                .findByIdAndStatusAndTeacherAssignment_Division_Semester_Programme_Department_Id(
                        assessmentId,
                        AssessmentStatus.SUBMITTED,
                        departmentId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Submitted assessment not found in your department"
                ));
    }

    private UUID getHodDepartmentId(String hodEmail) {
        User hodUser = getHodUser(hodEmail);

        Teacher teacher = teacherRepository
                .findByUserId(hodUser.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "HOD teacher record not found"
                ));

        DepartmentHodAssignment assignment =
                hodAssignmentRepository
                        .findByDepartmentIdAndEndedAtIsNull(
                                teacher.getDepartmentId()
                        )
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "You are not assigned as an active HOD"
                        ));

        if (!assignment.getTeacherId().equals(teacher.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not the active HOD of this department"
            );
        }

        return assignment.getDepartmentId();
    }

    private User getHodUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"
                ));
    }
}
