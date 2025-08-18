import React from 'react';
import { cn } from '../../utils/cn';

const DateTimePicker = React.forwardRef(({
  className,
  label,
  error,
  helper,
  required = false,
  disabled = false,
  value,
  onChange,
  minDate,
  maxDate,
  ...props
}, ref) => {
  const inputId = React.useId();

  // Format datetime-local value
  const formatDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (onChange) {
      // Convert to ISO string for consistency
      onChange(value ? new Date(value).toISOString() : null);
    }
  };

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
      
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type="datetime-local"
          value={formatDateTimeLocal(value)}
          onChange={handleChange}
          min={minDate ? formatDateTimeLocal(minDate) : undefined}
          max={maxDate ? formatDateTimeLocal(maxDate) : undefined}
          className={cn(
            // Base styles
            'block w-full rounded-md border-gray-300 shadow-sm',
            'focus:border-primary-500 focus:ring-primary-500',
            'text-gray-900 transition-colors duration-200',
            
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
        
        {/* Calendar icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="h-4 w-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {helper}
        </p>
      )}
    </div>
  );
});

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;