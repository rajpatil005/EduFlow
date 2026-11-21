
package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "assessment_components")
@Getter
@NoArgsConstructor
public class AssessmentComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "subject_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_assessment_components_subject")
    )
    private Subject subject;

    @Column(nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(nullable = false)
    private Integer weightage;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    public AssessmentComponent(
            Subject subject,
            String code,
            String name,
            Integer maxMarks,
            Integer weightage,
            Integer displayOrder
    ) {
        this.subject = subject;
        this.code = code;
        this.name = name;
        this.maxMarks = maxMarks;
        this.weightage = weightage;
        this.displayOrder = displayOrder;
    }

    public void updateDetails(
            Subject subject,
            String code,
            String name,
            Integer maxMarks,
            Integer weightage,
            Integer displayOrder
    ) {
        this.subject = subject;
        this.code = code;
        this.name = name;
        this.maxMarks = maxMarks;
        this.weightage = weightage;
        this.displayOrder = displayOrder;
    }
}
