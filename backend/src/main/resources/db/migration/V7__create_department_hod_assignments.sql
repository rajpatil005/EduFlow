-- 1. Ensure each user has at most one teacher profile.
ALTER TABLE teachers
    ADD CONSTRAINT uq_teachers_user_id
        UNIQUE (user_id);

-- 2. Ensure each user has at most one student profile.
ALTER TABLE students
    ADD CONSTRAINT uq_students_user_id
        UNIQUE (user_id);

-- 3. Create HOD assignment history.
CREATE TABLE department_hod_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    department_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    assigned_by UUID NOT NULL,

    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,

    CONSTRAINT fk_hod_assignment_department
        FOREIGN KEY (department_id)
            REFERENCES departments(id),

    CONSTRAINT fk_hod_assignment_teacher
        FOREIGN KEY (teacher_id)
            REFERENCES teachers(id),

    CONSTRAINT fk_hod_assignment_admin
        FOREIGN KEY (assigned_by)
            REFERENCES users(id),

    CONSTRAINT chk_hod_assignment_dates
        CHECK (ended_at IS NULL OR ended_at >= assigned_at)
);

-- 4. Only one current HOD per department.
CREATE UNIQUE INDEX uq_department_current_hod
    ON department_hod_assignments (department_id)
    WHERE ended_at IS NULL;

-- 5. A teacher can be the current HOD of only one department.
CREATE UNIQUE INDEX uq_teacher_current_hod
    ON department_hod_assignments (teacher_id)
    WHERE ended_at IS NULL;

-- 6. Indexes for assignment history queries.
CREATE INDEX idx_hod_assignments_teacher
    ON department_hod_assignments (teacher_id);

CREATE INDEX idx_hod_assignments_department_history
    ON department_hod_assignments (department_id, assigned_at DESC);
