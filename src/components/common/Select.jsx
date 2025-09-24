import React from 'react';
import { cn } from '../../utils/cn';

const Select = ({
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Chọn một tùy chọn',
    error,
    className,
    disabled = false,
    ...props
}) => {
    return (
        <div className="w-full">
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                    disabled && 'bg-gray-100 cursor-not-allowed',
                    className
                )}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Select;
