
INSERT INTO users (name, role, email, password_hash)
VALUES
    ('Admin Demo', 'ADMIN', 'admin.demo@eduflow.local', 'demo-only'),
    ('Rajesh Patil', 'HOD', 'rajesh.patil@eduflow.local', 'demo-only'),
    ('Sneha Deshmukh', 'HOD', 'sneha.deshmukh@eduflow.local', 'demo-only'),
    ('Amit Kulkarni', 'TEACHER', 'amit.kulkarni@eduflow.local', 'demo-only'),
    ('Priya Shah', 'TEACHER', 'priya.shah@eduflow.local', 'demo-only'),
    ('Rohan Joshi', 'TEACHER', 'rohan.joshi@eduflow.local', 'demo-only'),
    ('Neha Patil', 'TEACHER', 'neha.patil@eduflow.local', 'demo-only'),
    ('Akash More', 'TEACHER', 'akash.more@eduflow.local', 'demo-only'),
    ('Aarav Shinde', 'STUDENT', 'aarav.shinde@eduflow.local', 'demo-only'),
    ('Ananya Pawar', 'STUDENT', 'ananya.pawar@eduflow.local', 'demo-only'),
    ('Vedant Jadhav', 'STUDENT', 'vedant.jadhav@eduflow.local', 'demo-only'),
    ('Isha Desai', 'STUDENT', 'isha.desai@eduflow.local', 'demo-only'),
    ('Omkar Kadam', 'STUDENT', 'omkar.kadam@eduflow.local', 'demo-only'),
    ('Sakshi Chavan', 'STUDENT', 'sakshi.chavan@eduflow.local', 'demo-only'),
    ('Aditya Sawant', 'STUDENT', 'aditya.sawant@eduflow.local', 'demo-only')
ON CONFLICT (email) DO NOTHING;
