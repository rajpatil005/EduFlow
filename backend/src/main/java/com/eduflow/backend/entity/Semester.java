
package com.eduflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(
        name = "semesters",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_programme_semester_number",
                        columnNames = {"programme_id", "number"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private Integer number;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "programme_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_semesters_programme")
    )
    private Programme programme;
}
