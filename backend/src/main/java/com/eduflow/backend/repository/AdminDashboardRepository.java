package com.eduflow.backend.repository;

import com.eduflow.backend.dto.AdminDashboardResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AdminDashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    public AdminDashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public AdminDashboardResponse getDashboardStats() {
        String sql = """
                SELECT
                    (SELECT COUNT(*) FROM students) AS total_students,
                    (SELECT COUNT(*) FROM teachers) AS total_teachers,
                    (SELECT COUNT(*) FROM departments) AS total_departments,
                    (SELECT COUNT(*) FROM subjects) AS total_subjects,
                    (SELECT COUNT(*) FROM attendance_records) AS total_attendance_records,
                    (SELECT COUNT(*) FROM attendance_records WHERE status = 'PRESENT') AS present_count,
                    (SELECT COUNT(*) FROM attendance_records WHERE status = 'ABSENT') AS absent_count,
                    (SELECT COUNT(*) FROM attendance_records WHERE status = 'LATE') AS late_count,
                    (SELECT COUNT(*) FROM attendance_records WHERE status = 'EXCUSED') AS excused_count,
                    (SELECT COUNT(*) FROM assessments) AS total_assessments,
                    (SELECT COUNT(*) FROM assessment_marks) AS total_assessment_marks
                """;

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            long present = rs.getLong("present_count");
            long absent = rs.getLong("absent_count");
            long late = rs.getLong("late_count");
            long eligible = present + absent + late;

            double percentage = eligible == 0
                    ? 0.0
                    : present * 100.0 / eligible;

            return new AdminDashboardResponse(
                    rs.getLong("total_students"),
                    rs.getLong("total_teachers"),
                    rs.getLong("total_departments"),
                    rs.getLong("total_subjects"),
                    rs.getLong("total_attendance_records"),
                    present,
                    absent,
                    late,
                    rs.getLong("excused_count"),
                    percentage,
                    rs.getLong("total_assessments"),
                    rs.getLong("total_assessment_marks")
            );
        });
    }
}
