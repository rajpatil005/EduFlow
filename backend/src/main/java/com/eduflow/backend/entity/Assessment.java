
package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assessments")
@Getter
@NoArgsConstructor
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "assessment_component_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_assessments_component")
    )
    private AssessmentComponent assessmentComponent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "teacher_assignment_id",
            foreignKey = @ForeignKey(name = "fk_assessments_teacher_assignment")
    )
    private TeacherAssignment teacherAssignment;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(name = "assessment_date", nullable = false)
    private LocalDate assessmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private AssessmentStatus status = AssessmentStatus.DRAFT;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_by")
    private UUID reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "review_remark", length = 500)
    private String reviewRemark;

    public Assessment(
            AssessmentComponent assessmentComponent,
            TeacherAssignment teacherAssignment,
            String name,
            Integer maxMarks,
            LocalDate assessmentDate
    ) {
        this.assessmentComponent = assessmentComponent;
        this.teacherAssignment = teacherAssignment;
        this.name = name;
        this.maxMarks = maxMarks;
        this.assessmentDate = assessmentDate;
        this.status = AssessmentStatus.DRAFT;
    }

    public void updateDetails(
            String name,
            Integer maxMarks,
            LocalDate assessmentDate
    ) {
        if (status != AssessmentStatus.DRAFT &&
                status != AssessmentStatus.RETURNED) {
            throw new IllegalStateException(
                    "Only draft or returned assessments can be updated"
            );
        }

        this.name = name;
        this.maxMarks = maxMarks;
        this.assessmentDate = assessmentDate;
    }

    public void submit() {
        if (status != AssessmentStatus.DRAFT &&
                status != AssessmentStatus.RETURNED) {
            throw new IllegalStateException(
                    "Only draft or returned assessments can be submitted"
            );
        }

        this.status = AssessmentStatus.SUBMITTED;
        this.submittedAt = LocalDateTime.now();

        // Clear the previous review when the teacher resubmits.
        this.reviewedBy = null;
        this.reviewedAt = null;
        this.reviewRemark = null;
    }

    public void approve(UUID hodUserId) {
        if (status != AssessmentStatus.SUBMITTED) {
            throw new IllegalStateException(
                    "Only submitted assessments can be approved"
            );
        }

        this.status = AssessmentStatus.APPROVED;
        this.reviewedBy = hodUserId;
        this.reviewedAt = LocalDateTime.now();
        this.reviewRemark = null;
    }

    public void returnForCorrection(
            UUID hodUserId,
            String remark
    ) {
        if (status != AssessmentStatus.SUBMITTED) {
            throw new IllegalStateException(
                    "Only submitted assessments can be returned"
            );
        }

        if (remark == null || remark.isBlank()) {
            throw new IllegalArgumentException(
                    "Correction remark is required"
            );
        }

        this.status = AssessmentStatus.RETURNED;
        this.reviewedBy = hodUserId;
        this.reviewedAt = LocalDateTime.now();
        this.reviewRemark = remark.trim();
    }
}
