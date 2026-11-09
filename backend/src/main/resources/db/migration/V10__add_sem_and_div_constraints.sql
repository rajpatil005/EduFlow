

-- semester constraints
ALTER TABLE semesters
    ADD CONSTRAINT chk_semester_number
        CHECK (number > 0);

ALTER TABLE semesters
    ADD CONSTRAINT uq_programme_semester_number
        UNIQUE (programme_id, number);

-- division constraints
ALTER TABLE divisions
    ADD CONSTRAINT uq_semester_division_name
        UNIQUE (semester_id, name);

ALTER TABLE divisions
    ADD CONSTRAINT chk_division_name
        CHECK (LENGTH(TRIM(name)) > 0);
