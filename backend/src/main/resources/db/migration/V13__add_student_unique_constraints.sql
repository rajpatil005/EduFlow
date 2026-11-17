
-- Add academic active status
ALTER TABLE students
    ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Enrollment number must be globally unique
ALTER TABLE students
    ADD CONSTRAINT uq_students_enrollment_no
        UNIQUE (enrollment_no);

-- Roll number must be unique within a division
ALTER TABLE students
    ADD CONSTRAINT uq_students_division_roll
        UNIQUE (division_id, roll_no);
