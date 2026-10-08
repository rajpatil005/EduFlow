import type { ReactNode, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from 'react';

export function Table({ children, className = '', ...props }: TableHTMLAttributes<HTMLTableElement> & { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-sm text-left ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function THead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <thead className={`bg-slate-50 border-b border-slate-200 ${className}`}>{children}</thead>;
}

export function TBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-slate-100 ${className}`}>{children}</tbody>;
}

export function TR({ children, className = '', ...props }: HTMLAttributes<HTMLTableRowElement> & { children: ReactNode }) {
  return <tr className={className} {...props}>{children}</tr>;
}

export function TH({ children, className = '', ...props }: ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <th className={`px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TD({ children, className = '', ...props }: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td className={`px-4 py-3 text-slate-700 ${className}`} {...props}>
      {children}
    </td>
  );
}