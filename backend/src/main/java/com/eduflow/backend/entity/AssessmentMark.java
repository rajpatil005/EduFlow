
package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "assessment_marks",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_assessment_marks_student",
                columnNames = {"assessment_id", "student_id"}
        )
)
@Getter
@NoArgsConstructor
public class AssessmentMark {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "assessment_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_assessment_marks_assessment")
    )
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_assessment_marks_student")
    )
    private Student student;

    @Column(name = "marks_obtained", nullable = false, precision = 6, scale = 2)
    private BigDecimal marksObtained;

    public AssessmentMark(
            Assessment assessment,
            Student student,
            BigDecimal marksObtained
    ) {
        this.assessment = assessment;
        this.student = student;
        this.marksObtained = marksObtained;
    }

    public void updateMarks(BigDecimal marksObtained) {
        this.marksObtained = marksObtained;
    }
}
