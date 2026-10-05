import { InputHTMLAttributes, forwardRef } from 'react';

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, id, ...rest }, ref) => (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        id={id}
        type="radio"
        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
        {...rest}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
);
Radio.displayName = 'Radio';