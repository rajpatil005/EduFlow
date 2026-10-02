CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- 2. departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE
);

-- 3. academic_years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) NOT NULL,
    start_year INTEGER NOT NULL,
    end_year INTEGER NOT NULL
);

-- 4. programmes
CREATE TABLE programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    department_id UUID NOT NULL,

    CONSTRAINT fk_programmes_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
);

-- 5. semesters
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    number INTEGER NOT NULL,
    programme_id UUID NOT NULL,

    CONSTRAINT fk_semesters_programme
        FOREIGN KEY (programme_id)
        REFERENCES programmes(id)
);

-- 6. divisions
CREATE TABLE divisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) NOT NULL,
    semester_id UUID NOT NULL,

    CONSTRAINT fk_divisions_semester
        FOREIGN KEY (semester_id)
        REFERENCES semesters(id)
);

-- 7. teacher_assignments
CREATE TABLE teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    division_id UUID NOT NULL,
    academic_year_id UUID NOT NULL,
    assignment_type VARCHAR(30) NOT NULL,

    CONSTRAINT fk_teacher_assignments_division
        FOREIGN KEY (division_id)
        REFERENCES divisions(id),

    CONSTRAINT fk_teacher_assignments_academic_year
        FOREIGN KEY (academic_year_id)
        REFERENCES academic_years(id)
);

-- 8. assessment_components
CREATE TABLE assessment_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    max_marks INTEGER NOT NULL,
    weightage INTEGER NOT NULL,
    display_order INTEGER NOT NULL
);

-- 9. assessment_marks
CREATE TABLE assessment_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL,
    student_id UUID NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL
);