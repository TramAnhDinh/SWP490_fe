import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  helper,
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputId = React.useId();

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium text-gray-700',
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
          )}
        >
          {label}
        </label>
      )}
      
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          // Base styles
          'block w-full rounded-md border-gray-300 shadow-sm',
          'focus:border-primary-500 focus:ring-primary-500',
          'placeholder-gray-400 text-gray-900',
          'transition-colors duration-200',
          
          // Size
          'px-3 py-2 text-sm',
          
          // States
          error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
          disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
          
          className
        )}
        disabled={disabled}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;