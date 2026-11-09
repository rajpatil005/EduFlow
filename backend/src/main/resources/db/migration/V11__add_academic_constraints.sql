ALTER TABLE academic_years
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE academic_years
    ADD CONSTRAINT chk_academic_year_range
        CHECK (end_year = start_year + 1),
    ADD CONSTRAINT uq_academic_year_name UNIQUE (name);

-- single academic year activation validation
CREATE UNIQUE INDEX uq_one_active_academic_year
    ON academic_years (is_active)
    WHERE is_active = TRUE;