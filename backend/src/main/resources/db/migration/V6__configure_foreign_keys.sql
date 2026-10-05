-- 1. teacher_assignments → teachers
ALTER TABLE teacher_assignments
    ADD CONSTRAINT fk_teacher_assignments_teacher
        FOREIGN KEY (teacher_id)
            REFERENCES teachers(id);

-- 2. teacher_assignments → subjects
ALTER TABLE teacher_assignments
    ADD CONSTRAINT fk_teacher_assignments_subject
        FOREIGN KEY (subject_id)
            REFERENCES subjects(id);

-- 3. assessment_components → subjects
ALTER TABLE assessment_components
    ADD CONSTRAINT fk_assessment_components_subject
        FOREIGN KEY (subject_id)
            REFERENCES subjects(id);

-- 4. assessment_marks → assessments
ALTER TABLE assessment_marks
    ADD CONSTRAINT fk_assessment_marks_assessment
        FOREIGN KEY (assessment_id)
            REFERENCES assessments(id);

-- 5. assessment_marks → students
ALTER TABLE assessment_marks
    ADD CONSTRAINT fk_assessment_marks_student
        FOREIGN KEY (student_id)
            REFERENCES students(id);