import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarLink } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  links: SidebarLink[];
  title: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export const MainLayout = ({
  links,
  title,
  userName,
  userRole,
  onLogout,
}: MainLayoutProps) => (
    
  <div className="flex h-screen bg-slate-50">
    <Sidebar links={links} title={title} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header userName={userName} userRole={userRole} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);