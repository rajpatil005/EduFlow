import { ReactNode, useEffect, useRef, useState } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
}

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border z-50 py-1">
          {children}
        </div>
      )}
    </div>
  );
};