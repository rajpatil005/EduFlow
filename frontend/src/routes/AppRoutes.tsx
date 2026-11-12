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


// Admin model
import Departments from '@/pages/admin/academic/Departments';
import Programmes from '@/pages/admin/academic/Programmes';
import AcademicYears from '@/pages/admin/academic/AcademicYears';
import Semesters from '@/pages/admin/academic/Semesters';
import Divisions from '@/pages/admin/academic/Divisions';
import Subjects from '@/pages/admin/academic/Subjects';

// for User module
import Users from '@/pages/admin/users/Users';

import HodManagement  from '@/pages/admin/hod/HodManagement';
import AuditLogs from '@/pages/admin/audit/AuditLogs';
import AdminReports from '@/pages/admin/reports/Reports';


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

    {/* Admin routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />

      {/* Phase 1 Routes */}
      <Route path="departments" element={<Departments />} />
      <Route path="programmes" element={<Programmes />} />
      <Route path="academic-years" element={<AcademicYears />} />
      <Route path="semesters" element={<Semesters />} />
      <Route path="divisions" element={<Divisions />} />
      <Route path="subjects" element={<Subjects />} />
    </Route>

{/* for user */}
<Route path="/admin" element={<AdminLayout />}>
  <Route path="users" element={<Users />} />
</Route>

 {/* for HOD management */}
 <Route path="/admin" element= {<AdminLayout />}>
   <Route path="hod"  element= {<HodManagement />}></Route>
 </Route>


 {/* adudit log */}
 <Route path="/admin" element={<AdminLayout />}>
  <Route path="audit" element={<AuditLogs />} />
</Route>

<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<AdminDashboard />} />
  
  {/* ... (tumche Phase 1, 2, 3 che routes) ... */}
  
  {/* ⭐ NAVIN ADD KELELE ROUTES */}
  <Route path="reports" element={<AdminReports />} />
</Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>




);