# EduFlow

## Digital Student Marking, Examination & Academic Performance Management System

EduFlow is a web-based academic management system designed to centralize and organize student academic information such as marks, examinations, attendance, assignments, syllabus, and other academic records.

The system is planned to provide role-based functionality for Admin, HOD, Teachers, and Students according to their responsibilities. The main objective is to reduce manual work, improve academic data organization, and provide authorized users with easy access to relevant academic information.

---

## 📌 Project Status

**Status: Initial Development**

EduFlow is currently in the initial development stage. The basic project structure, frontend development, backend foundation, and database-related work have been started.

The major modules and functionalities are being developed progressively.

> This project is currently under active development. Some features described in this README are planned and may not yet be fully implemented.

---

## 🎯 Objectives

- Develop a centralized web-based academic management system.
- Manage student marks and examination-related information.
- Manage attendance and assignment-related information.
- Provide syllabus and academic information in an organized manner.
- Provide role-based access for Admin, HOD, Teachers, and Students.
- Maintain academic information in a structured database.
- Reduce manual work in academic record management.
- Improve accessibility and organization of student academic information.

---

## 👥 User Roles

### Admin

The Admin will manage the overall academic system.

Planned responsibilities:

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

### HOD

The HOD will manage department-level academic activities.

Planned responsibilities:

- Assign class teachers
- Assign teachers
- View department information
- Distribute subjects
- Manage examination-related activities
- View reports

### Teacher

Teachers will manage academic activities related to their assigned subjects and students.

Planned responsibilities:

- View assigned subjects
- Enter marks
- Manage students
- Manage attendance
- Manage assignments
- View syllabus

### Student

Students will be able to access their academic information.

Planned functionalities:

- View marks
- View attendance
- View assignments
- View syllabus

---

## 🏗️ System Architecture

The proposed system follows a layered full-stack web application architecture.

```text
+------------------------------------------------+
|                    Users                       |
|     Admin | HOD | Teacher | Student            |
+-------------------------+----------------------+
                          |
                          v
+------------------------------------------------+
|                  Frontend                      |
|              React + Vite                     |
|          Web Application / UI                  |
+-------------------------+----------------------+
                          |
                          v
+------------------------------------------------+
|                Backend / API                   |
|                Java + Spring Boot              |
|      REST APIs + Security + Business Logic     |
+-------------------------+----------------------+
                          |
                          v
+------------------------------------------------+
|                   Database                     |
|                  PostgreSQL                    |
|           JPA + Hibernate + Flyway             |
+------------------------------------------------+
