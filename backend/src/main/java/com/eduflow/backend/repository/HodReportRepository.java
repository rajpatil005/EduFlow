package com.eduflow.backend.repository;

import com.eduflow.backend.dto.HodDepartmentReportResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HodReportRepository {

    private final JdbcTemplate jdbcTemplate;

    public HodReportRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<HodDepartmentReportResponse> getDepartmentReports() {
        String sql = """
                WITH student_counts AS (
                    SELECT p.department_id, COUNT(DISTINCT s.id) AS student_count
                    FROM students s
                    JOIN divisions d ON d.id = s.division_id
                    JOIN semesters sem ON sem.id = d.semester_id
                    JOIN programmes p ON p.id = sem.programme_id
                    GROUP BY p.department_id
                ),
                teacher_counts AS (
                    SELECT department_id, COUNT(*) AS teacher_count
                    FROM teachers
                    GROUP BY department_id
                ),
                attendance_stats AS (
                    SELECT
                        p.department_id,
                        COUNT(ar.id) AS total_records,
                        COUNT(*) FILTER (WHERE ar.status = 'PRESENT') AS present_count,
                        COUNT(*) FILTER (WHERE ar.status = 'ABSENT') AS absent_count,
                        COUNT(*) FILTER (WHERE ar.status = 'LATE') AS late_count,
                        COUNT(*) FILTER (WHERE ar.status = 'EXCUSED') AS excused_count
                    FROM attendance_records ar
                    JOIN students s ON s.id = ar.student_id
                    JOIN divisions d ON d.id = s.division_id
                    JOIN semesters sem ON sem.id = d.semester_id
                    JOIN programmes p ON p.id = sem.programme_id
                    GROUP BY p.department_id
                )
                SELECT
                    dep.id AS department_id,
                    dep.name AS department_name,
                    dep.code AS department_code,
                    COALESCE(sc.student_count, 0) AS student_count,
                    COALESCE(tc.teacher_count, 0) AS teacher_count,
                    COALESCE(ast.total_records, 0) AS total_records,
                    COALESCE(ast.present_count, 0) AS present_count,
                    COALESCE(ast.absent_count, 0) AS absent_count,
                    COALESCE(ast.late_count, 0) AS late_count,
                    COALESCE(ast.excused_count, 0) AS excused_count
                FROM departments dep
                LEFT JOIN student_counts sc ON sc.department_id = dep.id
                LEFT JOIN teacher_counts tc ON tc.department_id = dep.id
                LEFT JOIN attendance_stats ast ON ast.department_id = dep.id
                ORDER BY dep.name
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            long present = rs.getLong("present_count");
            long absent = rs.getLong("absent_count");
            long late = rs.getLong("late_count");
            long eligible = present + absent + late;

            double percentage = eligible == 0
                    ? 0.0
                    : present * 100.0 / eligible;

            return new HodDepartmentReportResponse(
                    rs.getObject("department_id", java.util.UUID.class),
                    rs.getString("department_name"),
                    rs.getString("department_code"),
                    rs.getLong("student_count"),
                    rs.getLong("teacher_count"),
                    rs.getLong("total_records"),
                    present,
                    absent,
                    late,
                    rs.getLong("excused_count"),
                    percentage
            );
        });
    }
}