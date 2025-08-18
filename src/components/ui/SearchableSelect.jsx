import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const SearchableSelect = ({
  className,
  label,
  error,
  helper,
  required = false,
  disabled = false,
  value,
  onChange,
  options = [],
  placeholder = "Chọn một tùy chọn...",
  searchPlaceholder = "Tìm kiếm...",
  getOptionLabel = (option) => {
    try {
      if (!option) return '';
      return option.label || option.name || String(option);
    } catch (error) {
      console.warn('Error getting option label:', option, error);
      return '';
    }
  },
  getOptionValue = (option) => {
    try {
      if (!option) return '';
      return option.value || option.id || option;
    } catch (error) {
      console.warn('Error getting option value:', option, error);
      return '';
    }
  },
  emptyMessage = "Không có tùy chọn nào",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputId = React.useId();

  // Find selected option
  useEffect(() => {
    if (value) {
      const option = options.find(opt => getOptionValue(opt) === value);
      setSelectedOption(option);
    } else {
      setSelectedOption(null);
    }
  }, [value, options, getOptionValue]);

  // Filter options based on search term
  const filteredOptions = options.filter(option => {
    if (!searchTerm) return true;
    
    try {
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;
      
      const label = getOptionLabel(option);
      if (!label) return false;
      
      const labelLower = label.toLowerCase();
      return labelLower.includes(searchLower);
    } catch (error) {
      console.warn('Error filtering option:', option, error);
      return false;
    }
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSearchTerm('');
    setIsOpen(false);
    
    if (onChange) {
      onChange(getOptionValue(option));
    }
  };

  // Handle clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    setSearchTerm('');
    setIsOpen(false);
    
    if (onChange) {
      onChange('');
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1 relative">
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
        <div
          ref={inputRef}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            // Base styles
            'relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            'transition-colors duration-200',
            
            // Size
            'text-sm',
            
            // States
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
            
            className
          )}
        >
          <span className={cn(
            'block truncate',
            !selectedOption && 'text-gray-400'
          )}>
            {selectedOption ? getOptionLabel(selectedOption) : placeholder}
          </span>
          
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {selectedOption && !disabled ? (
              <button
                type="button"
                onClick={handleClear}
                className="pointer-events-auto rounded p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg
                className={cn(
                  'h-4 w-4 text-gray-400 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </span>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-300"
          >
            {/* Search input */}
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                autoFocus
              />
            </div>
            
            {/* Options */}
            <div className="max-h-60 overflow-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={getOptionValue(option)}
                    onClick={() => handleOptionSelect(option)}
                    className={cn(
                      'relative cursor-pointer select-none py-2 px-3 hover:bg-gray-50 transition-colors',
                      selectedOption && getOptionValue(selectedOption) === getOptionValue(option) && 'bg-primary-50 text-primary-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="block truncate font-medium">
                        {getOptionLabel(option)}
                      </span>
                      {selectedOption && getOptionValue(selectedOption) === getOptionValue(option) && (
                        <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        )}
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
};

export default SearchableSelect;