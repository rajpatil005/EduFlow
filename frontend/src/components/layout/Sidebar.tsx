import { NavLink } from 'react-router-dom';
import { ReactNode } from 'react';

export interface SidebarLink {
  label: string;
  path: string;
  icon?: ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  title: string;
  subtitle?: string;
}

export const Sidebar = ({ links, title, subtitle }: SidebarProps) => (
  <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
    <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-200">
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
        EF
      </div>
      <div>

        <h1 className="text-base font-bold text-slate-900 leading-tight">EduFlow</h1>
        <p className="text-[11px] text-slate-500 leading-tight">{title}</p>
        
      </div>
    </div>
    <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
      {links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.icon && (
                <span className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}>
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
    {subtitle && (
      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    )}
  </aside>
);