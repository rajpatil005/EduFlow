import { Routes, Route, Navigate } from 'react-router-dom';
import { TeacherLayout } from '@/layouts/TeacherLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HodLayout } from '@/layouts/HodLayout';
import { MainLayout } from '@/layouts/MainLayout';

// Login page --starting page
import Login from '@/pages/auth/Login';

// Common Pages (Available for all authenticated users)
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
import Reports from '@/pages/teacher/Reports';

// Temp chnage develop team members
import AdminDashboard from '@/pages/admin/Dashboard';

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
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Common User Routes (Profile & Settings wrapped in user's role layout) */}
    <Route element={<MainLayout />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    {/* teacher routes */}
    <Route path="/teacher" element={<TeacherLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      <Route path="subjects" element={<MySubjects />} />
      <Route path="students" element={<MyStudents />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="assessments" element={<Assessments />} />
      <Route path="marks-entry" element={<MarksEntry />} />
      <Route path="syllabus" element={<Syllabus />} />
      <Route path="reports" element={<Reports />} />
    </Route>

    {/* Admin routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      {/* Add itar admin routes ithe */}
    </Route>

    {/*  HOD routes */}
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

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);
