import { ReactNode } from 'react';

export const Table = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className="overflow-x-auto">
    <table className={`w-full text-sm ${className}`}>{children}</table>
  </div>
);

export const THead = ({ children }: { children: ReactNode }) => (
  <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
);

export const TBody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-gray-100">{children}</tbody>
);

export const TR = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>
);

export const TH = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${className}`}>
    {children}
  </th>
);

export const TD = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>
);