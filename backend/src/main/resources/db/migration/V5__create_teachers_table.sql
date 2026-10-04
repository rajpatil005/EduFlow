CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    department_id UUID NOT NULL,

    CONSTRAINT fk_teachers_user
        FOREIGN KEY (user_id)
            REFERENCES users(id),

    CONSTRAINT fk_teachers_department
        FOREIGN KEY (department_id)
            REFERENCES departments(id)
);