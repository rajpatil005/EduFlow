import { Routes, Route, Navigate } from 'react-router-dom';
import { TeacherLayout } from '@/layouts/TeacherLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { HodLayout } from '@/layouts/HodLayout';

// Login page --starting page
import Login from '@/pages/auth/Login';

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
import HodDashboard from '@/pages/hod/Dashboard';

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

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
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);