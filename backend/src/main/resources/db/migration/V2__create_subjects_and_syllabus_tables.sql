-- 1 subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    credits INTEGER NOT NULL,
    semester_id UUID NOT NULL,

    CONSTRAINT fk_subjects_semester
        FOREIGN KEY (semester_id)
        REFERENCES semesters(id)
);

-- 2 syllabus
CREATE TABLE syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL,
    academic_year_id UUID NOT NULL,
    version VARCHAR(20) NOT NULL,

    CONSTRAINT fk_syllabus_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(id),

    CONSTRAINT fk_syllabus_academic_year
        FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(id)
);