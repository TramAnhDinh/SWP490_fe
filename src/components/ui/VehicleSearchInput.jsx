import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const VehicleSearchInput = ({
  className,
  label,
  error,
  helper,
  required = false,
  disabled = false,
  value,
  onChange,
  onSelect,
  vehicles = [],
  placeholder = "Tìm kiếm theo biển số hoặc số khung xe...",
  allowCreate = true,
  onCreateNew,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputId = React.useId();

  // Sync searchTerm with value prop when value changes
  useEffect(() => {
    if (value && selectedVehicle) {
      setSearchTerm(`${selectedVehicle.licensePlate || selectedVehicle.chassisNumber} - ${selectedVehicle.vehicleBrandName} ${selectedVehicle.vehicleModelName}`);
    } else if (!value) {
      setSearchTerm('');
      setSelectedVehicle(null);
    }
  }, [value, selectedVehicle]);

  // Find and set selectedVehicle when value changes
  useEffect(() => {
    if (value && vehicles.length > 0) {
      const vehicle = vehicles.find(v => v.vehicleID === value);
      if (vehicle) {
        setSelectedVehicle(vehicle);
        setSearchTerm(`${vehicle.licensePlate || vehicle.chassisNumber} - ${vehicle.vehicleBrandName} ${vehicle.vehicleModelName}`);
      }
    }
  }, [value, vehicles]);

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => {
    if (!searchTerm) return true;
    
    try {
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;
      
      return (
        vehicle.licensePlate?.toLowerCase().includes(searchLower) ||
        vehicle.chassisNumber?.toLowerCase().includes(searchLower) ||
        vehicle.vehicleModelName?.toLowerCase().includes(searchLower) ||
        vehicle.vehicleBrandName?.toLowerCase().includes(searchLower) ||
        vehicle.customerFullName?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.warn('Error filtering vehicle:', vehicle, error);
      return false;
    }
  });

  // Check if we should show "Create new" option
  const showCreateOption = allowCreate && searchTerm && searchTerm.length >= 2 && filteredVehicles.length === 0;

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
    
    // Don't call onChange here as it should only be called when a vehicle is selected
    // onChange should only receive vehicleID, not search term
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    console.log('VehicleSearchInput - Vehicle selected:', vehicle);
    console.log('VehicleSearchInput - Vehicle ID:', vehicle.vehicleID);
    setSelectedVehicle(vehicle);
    setSearchTerm(`${vehicle.licensePlate || vehicle.chassisNumber} - ${vehicle.vehicleBrandName} ${vehicle.vehicleModelName}`);
    setIsOpen(false);
    
    if (onSelect) {
      onSelect(vehicle);
    }
    if (onChange) {
      console.log('VehicleSearchInput - Calling onChange with vehicleID:', vehicle.vehicleID);
      onChange(vehicle.vehicleID);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear selection
  const handleClear = () => {
    setSelectedVehicle(null);
    setSearchTerm('');
    setIsOpen(false);
    if (onChange) {
      onChange('');
    }
    if (onSelect) {
      onSelect(null);
    }
  };

  // Handle create new vehicle
  const handleCreateNew = () => {
    setIsOpen(false);
    if (onCreateNew) {
      onCreateNew(searchTerm);
    }
  };

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
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            // Base styles
            'block w-full rounded-md border-gray-300 shadow-sm',
            'focus:border-primary-500 focus:ring-primary-500',
            'placeholder-gray-400 text-gray-900',
            'transition-colors duration-200',
            
            // Size
            'px-3 py-2 pr-10 text-sm',
            
            // States
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
            
            className
          )}
          disabled={disabled}
          {...props}
        />
        
        {/* Search/Clear icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchTerm ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        
        {/* Dropdown */}
        {isOpen && searchTerm && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleID}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {vehicle.licensePlate || vehicle.chassisNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.vehicleBrandName} {vehicle.vehicleModelName}
                      </div>
                      {vehicle.customerFullName && (
                        <div className="text-xs text-gray-400">
                          Khách hàng: {vehicle.customerFullName}
                        </div>
                      )}
                    </div>
                    <div className="ml-2">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            ) : showCreateOption ? (
              <div
                onClick={handleCreateNew}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 text-blue-600"
              >
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div>
                    <div className="font-medium text-sm">Tạo phương tiện mới</div>
                    <div className="text-xs text-blue-500">"{searchTerm}"</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không tìm thấy phương tiện nào
                {allowCreate && (
                  <div className="text-xs mt-1 text-blue-600">
                    Gõ ít nhất 2 ký tự để tạo mới
                  </div>
                )}
              </div>
            )}
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

export default VehicleSearchInput;