import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean; 
}

export const Card = ({ children, className = '', hoverable = false }: CardProps) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${hoverable ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`px-5 py-4 border-b border-gray-200 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h3 className={`text-base font-semibold text-gray-800 ${className}`}>{children}</h3>
);