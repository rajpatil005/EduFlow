
package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "students")
@Getter
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true,
            foreignKey = @ForeignKey(name = "fk_students_user")
    )
    private User user;

    @Column(name = "enrollment_no", nullable = false, length = 50)
    private String enrollmentNo;

    @Column(name = "roll_no", nullable = false, length = 20)
    private String rollNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "division_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_students_division")
    )
    private Division division;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public Student(
            User user,
            String enrollmentNo,
            String rollNo,
            Division division
    ) {
        this.user = user;
        this.enrollmentNo = enrollmentNo;
        this.rollNo = rollNo;
        this.division = division;
    }

    public void updateDetails(
            String enrollmentNo,
            String rollNo,
            Division division
    ) {
        this.enrollmentNo = enrollmentNo;
        this.rollNo = rollNo;
        this.division = division;
    }

    public void deactivate() {
        this.active = false;
    }

    public void activate() {
        this.active = true;
    }
}
