import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-5xl mb-3">📭</div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);