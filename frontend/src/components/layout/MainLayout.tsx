import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { SidebarLink } from './Sidebar';

interface MainLayoutProps {
  links: SidebarLink[];
  title: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  children?: ReactNode;
}

export const MainLayout = ({
  links,
  title,
  userName,
  userRole,
  onLogout,
  children,
}: MainLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar links={links} title={title} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          userName={userName}
          userRole={userRole}
          onLogout={onLogout}
        />

        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
