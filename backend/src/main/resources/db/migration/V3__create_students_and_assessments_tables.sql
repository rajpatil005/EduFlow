-- 1. students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    enrollment_no VARCHAR(50) NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    division_id UUID NOT NULL,

    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_students_division
        FOREIGN KEY (division_id)
        REFERENCES divisions(id)
);

-- 2. assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_component_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    max_marks INTEGER NOT NULL,
    assessment_date DATE NOT NULL,

    CONSTRAINT fk_assessments_component
        FOREIGN KEY (assessment_component_id)
        REFERENCES assessment_components(id)
);