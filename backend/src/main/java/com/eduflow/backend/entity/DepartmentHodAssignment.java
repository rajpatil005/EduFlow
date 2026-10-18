package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "department_hod_assignments")
@Getter
@Setter
@NoArgsConstructor
public class DepartmentHodAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;

    @Column(name = "teacher_id", nullable = false)
    private UUID teacherId;

    @Column(name = "assigned_by", nullable = false)
    private UUID assignedBy;

    @Column(name = "assigned_at", nullable = false)
    private Instant assignedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @PrePersist
    public void onCreate() {
        if (assignedAt == null) {
            assignedAt = Instant.now();
        }
    }
}