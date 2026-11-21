
-- Add the teacher assignment relationship.
-- Nullable so existing assessment rows are not broken.
ALTER TABLE assessments
    ADD COLUMN IF NOT EXISTS teacher_assignment_id UUID;

-- Track the assessment workflow.
ALTER TABLE assessments
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';

ALTER TABLE assessments
    ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;

DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'fk_assessments_teacher_assignment'
        ) THEN
            ALTER TABLE assessments
                ADD CONSTRAINT fk_assessments_teacher_assignment
                    FOREIGN KEY (teacher_assignment_id)
                        REFERENCES teacher_assignments(id);
        END IF;
    END $$;

-- One marks row per student per assessment.
CREATE UNIQUE INDEX IF NOT EXISTS uq_assessment_marks_student
    ON assessment_marks (assessment_id, student_id);

-- Useful for fetching assessments by assignment.
CREATE INDEX IF NOT EXISTS idx_assessments_teacher_assignment
    ON assessments (teacher_assignment_id);
