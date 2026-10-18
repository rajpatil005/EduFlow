CREATE UNIQUE INDEX uq_teacher_assignment_slot
ON teacher_assignments (
    subject_id,
    division_id,
    academic_year_id,
    UPPER(TRIM(assignment_type))
);
