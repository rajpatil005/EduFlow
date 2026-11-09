package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "teacher_assignments")
@Getter
@Setter
@NoArgsConstructor
public class TeacherAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "teacher_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_teacher_assignments_teacher")
    )
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "subject_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_teacher_assignments_subject")
    )
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "division_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_teacher_assignments_division")
    )
    private Division division;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "academic_year_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_teacher_assignments_academic_year")
    )
    private AcademicYear academicYear;

    @Column(name = "assignment_type", nullable = false, length = 30)
    private String assignmentType;
}