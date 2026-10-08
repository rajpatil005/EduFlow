import { ReactNode } from 'react';

interface Action {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

interface TableActionsProps {
  actions: Action[];
}

export const TableActions = ({ actions }: TableActionsProps) => (
  <div className="flex items-center gap-1">
    {actions.map((a, i) => (
      <button
        key={i}
        onClick={a.onClick}
        title={a.label}
        className={`p-1.5 rounded-md transition-colors ${
          a.danger
            ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        }`}
      >
        {a.icon ?? <span className="text-xs">{a.label}</span>}
      </button>
    ))}
  </div>
);

export const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const DeleteIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
  </svg>
);

export const ViewIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);