import { ReactNode } from 'react';

 interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}

export const PageHeader = ({ title, subtitle, actions, breadcrumb }: PageHeaderProps) => (
  <div className="mb-6">
    {breadcrumb}
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}

      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  </div>
);