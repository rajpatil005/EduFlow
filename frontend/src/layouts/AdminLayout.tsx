import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarLink } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';

const adminLinks: SidebarLink[] = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Departments', path: '/admin/departments' },
  { label: 'Programmes', path: '/admin/programmes' },
  { label: 'Academic Years', path: '/admin/academic-years' },
  { label: 'Semesters', path: '/admin/semesters' },
  { label: 'Divisions', path: '/admin/divisions' },
  { label: 'Subjects', path: '/admin/subjects' },
  { label: 'HOD Management', path: '/admin/hod' },
  { label: 'Audit Logs', path: '/admin/audit' },
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        links={adminLinks} 
        title="Admin" 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={user?.name ?? 'Admin'}
          userRole={user?.role ?? 'ADMIN'}
          onLogout={handleLogout} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};