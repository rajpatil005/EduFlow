import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export const Header = ({ userName = 'User', userRole = 'Admin', onLogout }: HeaderProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Welcome back, {userName}</h2>
        <p className="text-xs text-slate-500">{userRole} Dashboard</p>
      </div>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-full pl-1 pr-3 py-1 hover:bg-slate-50 transition-colors"
        >
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </span>
          <span className="text-sm font-medium text-slate-700">{userName}</span>
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2.5 border-b border-slate-100">
              <p className="text-sm font-medium text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
            <button
              onClick={() => { setOpen(false); navigate('/profile'); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              My Profile
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/settings'); }}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Settings
            </button>
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={() => { setOpen(false); onLogout?.(); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};