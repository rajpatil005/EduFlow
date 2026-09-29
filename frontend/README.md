# EduFlow
## Digital Student Marking, Examination & Academic Performance Management System

EduFlow is a web-based academic management system designed to centralize and organize student academic information such as marks, examinations, attendance, assignments, syllabus, and other academic records.

The system is planned to provide role-based functionality for Admin, HOD, Teachers, and Students according to their responsibilities. The main goal of the project is to reduce manual academic record management, improve data organization, and provide authorized users with easy access to relevant academic information.

---

## 📌 Project Status

**Current Status: Initial Development**

The project has recently been started and is currently in the initial development stage.

The basic frontend and backend project structures have been created, and initial database-related models and migration setup are being developed.

Major modules and functionalities are planned and will be implemented progressively during the development of the project.

> Note: The project is currently under development. All features described as planned are not necessarily implemented yet.

---

## 🎯 Project Objectives

The main objectives of EduFlow are:

- To develop a centralized web-based system for managing student academic activities.
- To manage student marks and examination-related information.
- To maintain attendance and assignment-related information.
- To provide syllabus and academic information in an organized manner.
- To provide role-based access for Admin, HOD, Teachers, and Students.
- To maintain academic data in a structured database.
- To reduce manual work in academic record management.
- To improve accessibility and organization of student academic information.

---

## 👥 User Roles

The proposed system will contain the following major user roles:

### 1. Admin

The Admin will be responsible for managing the overall academic system.

Planned responsibilities include:

- Manage users
- Manage departments
- Manage programmes
- Manage semesters
- Manage divisions
- Manage teachers
- Manage students
- Manage academic years
- Manage syllabus
- Manage assessment components
- Change HOD

---

### 2. HOD

The Head of Department will manage department-level academic activities.

Planned responsibilities include:

- Assign class teachers
- Assign teachers
- View department information
- Distribute subjects
- Manage examination-related activities
- View reports

---

### 3. Teacher

Teachers will manage academic activities related to their assigned students and subjects.

Planned responsibilities include:

- View assigned subjects
- Enter marks
- Manage students
- Manage attendance
- Manage assignments
- View syllabus

---

### 4. Student

Students will be able to access their academic information.

Planned functionalities include:

- View marks
- View attendance
- View assignments
- View syllabus

---

## 🏗️ Project Architecture

EduFlow is planned as a full-stack web application consisting of the following major layers:

```text
+-----------------------------+
|           Users             |
| Admin | HOD | Teacher       |
|       | Student             |
+-------------+---------------+
              |
              v
+-----------------------------+
|        Frontend             |
|      React + Vite           |
|   Web-based User Interface  |
+-------------+---------------+
              |
              v
+-----------------------------+
|        Backend / API        |
|       Spring Boot           |
| REST APIs + Security + JWT  |
+-------------+---------------+
              |
              v
+-----------------------------+
|          Database           |
|         PostgreSQL          |
| Spring Data JPA / Hibernate |
+-----------------------------+