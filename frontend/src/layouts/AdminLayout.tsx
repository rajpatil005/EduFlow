import { Outlet } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { useAuth } from '../hooks/useAuth';
import type { SidebarLink } from '../components/layout/Sidebar';

const adminLinks: SidebarLink[] = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Students', path: '/admin/students' },
  { label: 'Teachers', path: '/admin/teachers' },
  { label: 'Departments', path: '/admin/departments' },
  { label: 'Subjects', path: '/admin/subjects' },
  { label: 'Attendance', path: '/admin/attendance' },
  { label: 'Marks Entry', path: '/admin/marks' },
  { label: 'Timetable', path: '/admin/timetable' },
  { label: 'Reports', path: '/admin/reports' },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <MainLayout
      title="EduFlow Admin"
      links={adminLinks}
      userName={user?.name ?? 'Admin'}
      userRole="Administrator"
      onLogout={logout}
    >
      <Outlet />
    </MainLayout>
  );
};

export default AdminLayout;