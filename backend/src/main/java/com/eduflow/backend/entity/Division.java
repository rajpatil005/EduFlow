
package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
        name = "divisions",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_semester_division_name",
                        columnNames = {"semester_id", "name"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Division {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 20)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "semester_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_divisions_semester")
    )
    private Semester semester;
}
