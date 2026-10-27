import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, SidebarLink } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';

const hodLinks: SidebarLink[] = [
  { label: 'Dashboard', path: '/hod/dashboard' },
  { label: 'Teachers', path: '/hod/teachers' },
  { label: 'Distribution', path: '/hod/distribution' },
  { label: 'Verification', path: '/hod/verification' },
  { label: 'Subjects', path: '/hod/subjects' },
  { label: 'Reports', path: '/hod/reports' },
];

export const HodLayout = () => {
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
        links={hodLinks} 
        title="HOD" 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={user?.name ?? 'HOD'}
          userRole={user?.role ?? 'HOD'}
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