import * as React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-earth-700 mb-1.5 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-sm border border-earth-300 bg-white px-4 py-3 text-earth-900 text-sm',
              'placeholder:text-earth-400',
              'focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-earth-100',
              icon && 'pl-10',
              error && 'border-red-400 focus:ring-red-400/50 focus:border-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
