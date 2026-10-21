
package com.eduflow.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "assessment_component_id", nullable = false)
    private UUID assessmentComponentId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(name = "assessment_date", nullable = false)
    private LocalDate assessmentDate;

    public Assessment() {
    }

    public UUID getId() {
        return id;
    }

    public UUID getAssessmentComponentId() {
        return assessmentComponentId;
    }

    public void setAssessmentComponentId(UUID assessmentComponentId) {
        this.assessmentComponentId = assessmentComponentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public LocalDate getAssessmentDate() {
        return assessmentDate;
    }

    public void setAssessmentDate(LocalDate assessmentDate) {
        this.assessmentDate = assessmentDate;
    }
}
