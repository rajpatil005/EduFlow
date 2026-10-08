import { ReactNode } from 'react';

interface Tab {
  key: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  children?: ReactNode;
}

export const Tabs = ({ tabs, active, onChange, children }: TabsProps) => (
  <div>
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
            active === t.key
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);