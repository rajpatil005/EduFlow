
ALTER TABLE subjects
    ADD CONSTRAINT uq_subjects_code UNIQUE (code);

ALTER TABLE subjects
    ADD CONSTRAINT chk_subjects_credits
        CHECK (credits > 0);

ALTER TABLE subjects
    ADD CONSTRAINT chk_subjects_name
        CHECK (LENGTH(TRIM(name)) > 0);

ALTER TABLE subjects
    ADD CONSTRAINT chk_subjects_code
        CHECK (LENGTH(TRIM(code)) > 0);
