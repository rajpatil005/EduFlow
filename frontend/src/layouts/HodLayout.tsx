import {Outlet} from 'react-router-dom';
import {MainLayout} from '../components/layout';
import {useAuth} from '../hooks/useAuth';
import type {SidebarLink} from '../components/layout/Sidebar';

const hodLinks: SidebarLink[] = [
  {label: 'Dashboard', path: '/hod/dashboard'},
  {label: 'Teachers', path: '/hod/teachers'},
  {label: 'Students', path: '/hod/students'},
  {label: 'Subjects', path: '/hod/subjects'},
  {label: 'Attendance', path: '/hod/attendance'},
  {label: 'Marks', path: '/hod/marks'},
  {label: 'Timetable', path: '/hod/timetable'},
  {label: 'Reports', path: '/hod/reports'},
];

export const HodLayout = () => {
  const {user, logout} = useAuth();

  return (
    <MainLayout
      title="EduFlow HOD"
      links={hodLinks}
      userName={user?.name ?? 'HOD'}
      userRole="Head of Department"
      onLogout={logout}
    >
      <Outlet />
    </MainLayout>
  );
};

export default HodLayout;