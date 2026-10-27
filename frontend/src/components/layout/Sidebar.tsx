
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

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

export const Sidebar = ({
  links,
  title,
  subtitle,
}: SidebarProps) => (
  <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
    <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-sm">
        EF
      </div>

      <div className="min-w-0">
        <h1 className="text-base font-bold leading-tight text-slate-900">
          EduFlow
        </h1>
        <p className="truncate text-[11px] leading-tight text-slate-500">
          {title}
        </p>
      </div>
    </div>

    <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
      {links.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.icon && (
                <span
                  className={
                    isActive
                      ? 'text-indigo-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }
                >
                  {item.icon}
                </span>
              )}

              <span>{item.label}</span>

              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {subtitle && (
      <div className="shrink-0 border-t border-slate-200 p-4">
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    )}
  </aside>
);
