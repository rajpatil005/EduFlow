
ALTER TABLE assessments
    ADD COLUMN reviewed_by UUID,
    ADD COLUMN reviewed_at TIMESTAMP,
    ADD COLUMN review_remark VARCHAR(500);

ALTER TABLE assessments
    ADD CONSTRAINT fk_assessments_reviewed_by
        FOREIGN KEY (reviewed_by)
            REFERENCES users(id);
