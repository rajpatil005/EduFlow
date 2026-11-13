
import { Routes, Route, Navigate } from 'react-router-dom';

import { TeacherLayout } from '@/layouts/TeacherLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HodLayout } from '@/layouts/HodLayout';
import { MainLayout } from '@/layouts/MainLayout';

// Authentication
import Login from '@/pages/auth/Login';

// Common Pages
import Profile from '@/pages/common/Profile';
import Settings from '@/pages/common/Settings';

// Teacher Pages
import TeacherDashboard from '@/pages/teacher/Dashboard';
import MySubjects from '@/pages/teacher/MySubjects';
import MyStudents from '@/pages/teacher/MyStudents';
import Attendance from '@/pages/teacher/Attendance';
import Assessments from '@/pages/teacher/Assessments';
import MarksEntry from '@/pages/teacher/MarksEntry';
import Syllabus from '@/pages/teacher/Syllabus';
import TeacherReports from '@/pages/teacher/Reports';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import Departments from '@/pages/admin/academic/Departments';
import Programmes from '@/pages/admin/academic/Programmes';
import AcademicYears from '@/pages/admin/academic/AcademicYears';
import Semesters from '@/pages/admin/academic/Semesters';
import Divisions from '@/pages/admin/academic/Divisions';
import Subjects from '@/pages/admin/academic/Subjects';
import Users from '@/pages/admin/users/Users';
import HodManagement from '@/pages/admin/hod/HodManagement';
import AuditLogs from '@/pages/admin/audit/AuditLogs';
import AdminReports from '@/pages/admin/reports/Reports';

// HOD Pages
import HodDashboard from '@/pages/hod/Dashboard';
import HodDepartment from '@/pages/hod/Department';
import HodTeachers from '@/pages/hod/Teachers';
import HodStudents from '@/pages/hod/Students';
import HodSubjects from '@/pages/hod/Subjects';
import HodTeacherAssignments from '@/pages/hod/TeacherAssignments';
import HodMarksApproval from '@/pages/hod/MarksApproval';
import HodAttendance from '@/pages/hod/Attendance';
import HodReports from '@/pages/hod/Reports';

export const AppRoutes = () => (
  <Routes>
    {/* Authentication */}
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Common User Routes */}
    <Route element={<MainLayout />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    {/* Teacher Routes */}
    <Route path="/teacher" element={<TeacherLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="subjects" element={<MySubjects />} />
      <Route path="students" element={<MyStudents />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="assessments" element={<Assessments />} />
      <Route path="marks-entry" element={<MarksEntry />} />
      <Route path="syllabus" element={<Syllabus />} />
      <Route path="reports" element={<TeacherReports />} />
    </Route>

    {/* Admin Routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />

      {/* Academic Management */}
      <Route path="departments" element={<Departments />} />
      <Route path="programmes" element={<Programmes />} />
      <Route path="academic-years" element={<AcademicYears />} />
      <Route path="semesters" element={<Semesters />} />
      <Route path="divisions" element={<Divisions />} />
      <Route path="subjects" element={<Subjects />} />

      {/* User Management */}
      <Route path="users" element={<Users />} />

      {/* HOD Management */}
      <Route path="hod" element={<HodManagement />} />

      {/* Audit Logs */}
      <Route path="audit" element={<AuditLogs />} />

      {/* Admin Reports */}
      <Route path="reports" element={<AdminReports />} />
    </Route>

    {/* HOD Routes */}
    <Route path="/hod" element={<HodLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<HodDashboard />} />
      <Route path="department" element={<HodDepartment />} />
      <Route path="teachers" element={<HodTeachers />} />
      <Route path="students" element={<HodStudents />} />
      <Route path="subjects" element={<HodSubjects />} />
      <Route path="teacher-assignments" element={<HodTeacherAssignments />} />
      <Route path="marks-approval" element={<HodMarksApproval />} />
      <Route path="attendance" element={<HodAttendance />} />
      <Route path="reports" element={<HodReports />} />
    </Route>

    {/* Invalid Routes */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);
