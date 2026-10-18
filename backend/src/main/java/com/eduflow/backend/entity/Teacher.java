package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
    name = "teachers", uniqueConstraints = {
            @UniqueConstraint(
                    name = "uq_teachers_user_id",
                    columnNames = "user_id"
            )
    }
)
@Getter
@Setter
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "employee_id", nullable = false, unique = true)
    private String employeeId;

    @Column(name = "department_id", nullable = false)
    private UUID departmentId;
}