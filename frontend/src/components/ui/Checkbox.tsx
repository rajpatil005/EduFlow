import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className = '', ...rest }, ref) => (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        id={id}
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
        {...rest}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
);
Checkbox.displayName = 'Checkbox';