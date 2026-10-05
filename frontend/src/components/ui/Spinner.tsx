interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent ${sizeClasses[size]} ${className}`} />
);