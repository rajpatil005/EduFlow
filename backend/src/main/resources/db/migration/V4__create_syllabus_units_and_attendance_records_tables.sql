-- 1. syllabus_units
CREATE TABLE syllabus_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    syllabus_id UUID NOT NULL,
    unit_number INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,

    CONSTRAINT fk_syllabus_units_syllabus
        FOREIGN KEY (syllabus_id)
        REFERENCES syllabus(id)
);

-- 2. attendance_records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(30) NOT NULL,
    teacher_assignment_id UUID NOT NULL,

    CONSTRAINT fk_attendance_records_student
        FOREIGN KEY (student_id)
        REFERENCES students(id),

    CONSTRAINT fk_attendance_records_subject
        FOREIGN KEY (subject_id)
        REFERENCES subjects(id),

    CONSTRAINT fk_attendance_records_teacher_assignment
        FOREIGN KEY (teacher_assignment_id)
        REFERENCES teacher_assignments(id)
);