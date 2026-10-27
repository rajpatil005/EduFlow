import {Outlet, useNavigate} from 'react-router-dom';
import {Sidebar, SidebarLink} from '@/components/layout/Sidebar';
import {Header} from '@/components/layout/Header';
import {useAuth} from '@/hooks/useAuth';

const teacherLinks: SidebarLink[] = [
  {label: 'Dashboard', path: '/teacher/dashboard'},
  {label: 'My Subjects', path: '/teacher/subjects'},
  {label: 'My Students', path: '/teacher/students'},
  {label: 'Attendance', path: '/teacher/attendance'},
  {label: 'Assessments', path: '/teacher/assessments'},
  {label: 'Marks Entry', path: '/teacher/marks-entry'},
  {label: 'Syllabus', path: '/teacher/syllabus'},
  {label: 'Reports', path: '/teacher/reports'},
];

export const TeacherLayout = () => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar links={teacherLinks} title="Teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={user?.name ?? 'Teacher'}
          userRole={user?.role ?? 'TEACHER'}
          onLogout={handleLogout} 
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};