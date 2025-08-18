import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import Button from '../common/Button';
import Input from '../common/Input';
import SearchableSelect from './SearchableSelect';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateVehicleModal = ({
  isOpen,
  onClose,
  onSave,
  initialSearchTerm = '',
  vehicleBrands = [],
  vehicleModels = [],
  isLoading = false,
  customerInfo = null
}) => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    chassisNumber: '',
    color: '',
    year: '',
    initialKM: '',
    customerID: '',
    modelID: '',
    // Customer info for new customer
    customerFirstName: '',
    customerLastName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [createNewCustomer, setCreateNewCustomer] = useState(true);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        licensePlate: initialSearchTerm,
        chassisNumber: '',
        color: '',
        year: '',
        initialKM: '',
        customerID: '',
        modelID: '',
        customerFirstName: customerInfo?.firstName || '',
        customerLastName: customerInfo?.lastName || '',
        customerPhone: customerInfo?.phoneNumber || '',
        customerEmail: customerInfo?.email || '',
        customerAddress: customerInfo?.address || ''
      });
      setErrors({});
    }
  }, [isOpen, initialSearchTerm, customerInfo]);

  // Nếu có customerInfo, luôn set createNewCustomer = false
  useEffect(() => {
    if (customerInfo) setCreateNewCustomer(false);
  }, [customerInfo]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Vehicle validation
    if (!formData.chassisNumber) {
      newErrors.chassisNumber = 'Vui lòng nhập số khung xe';
    }

    if (!formData.modelID) {
      newErrors.modelID = 'Vui lòng chọn model xe';
    }

    if (formData.year && (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
      newErrors.year = 'Năm sản xuất không hợp lệ';
    }

    // Nếu KHÔNG có customerInfo thì mới validate thông tin khách hàng
    if (!customerInfo) {
      if (createNewCustomer) {
        if (!formData.customerFirstName) newErrors.customerFirstName = 'Vui lòng nhập tên khách hàng';
        if (!formData.customerLastName) newErrors.customerLastName = 'Vui lòng nhập họ khách hàng';
        if (!formData.customerPhone) {
          newErrors.customerPhone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.customerPhone)) {
          newErrors.customerPhone = 'Số điện thoại không hợp lệ';
        }
      } else if (!formData.customerID) {
        newErrors.customerID = 'Vui lòng chọn khách hàng';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Nếu có customerInfo, chỉ trả về thông tin xe + customerID
    if (customerInfo) {
      const vehicleData = {
        licensePlate: formData.licensePlate,
        chassisNumber: formData.chassisNumber,
        color: formData.color,
        year: formData.year ? parseInt(formData.year) : null,
        initialKM: formData.initialKM ? parseFloat(formData.initialKM) : null,
        modelID: formData.modelID,
        customerID: customerInfo.customerID,
      };
      onSave(vehicleData);
      return;
    }

    const vehicleData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : null,
      initialKM: formData.initialKM ? parseFloat(formData.initialKM) : null,
      createNewCustomer
    };

    onSave(vehicleData);
  };

  const handleClose = () => {
    setFormData({
      licensePlate: '',
      chassisNumber: '',
      color: '',
      year: '',
      initialKM: '',
      customerID: '',
      modelID: '',
      customerFirstName: '',
      customerLastName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Tạo Phương Tiện Mới</h2>
            <p className="text-sm text-gray-600 mt-1">Nhập thông tin xe và khách hàng</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Thông Tin Xe
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Biển số xe"
                value={formData.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                placeholder="29A-12345"
                helper="Biển số xe (không bắt buộc)"
              />

              <Input
                label="Số khung xe"
                value={formData.chassisNumber}
                onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
                error={errors.chassisNumber}
                required
                placeholder="VF1234567890"
              />

              <SearchableSelect
                label="Model xe"
                value={formData.modelID}
                onChange={(value) => handleInputChange('modelID', value)}
                options={vehicleModels}
                getOptionLabel={(model) => `${model.vehicleBrandName} ${model.modelName}`}
                getOptionValue={(model) => model.modelID}
                placeholder="Chọn model xe..."
                searchPlaceholder="Tìm kiếm model..."
                error={errors.modelID}
                required
              />

              <Input
                label="Màu sắc"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Đen, Trắng, Đỏ..."
              />

              <Input
                label="Năm sản xuất"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                error={errors.year}
                placeholder="2023"
              />

              <Input
                label="Số km ban đầu"
                type="number"
                min="0"
                step="0.1"
                value={formData.initialKM}
                onChange={(e) => handleInputChange('initialKM', e.target.value)}
                placeholder="0"
                helper="Số km hiện tại của xe"
              />
            </div>
          </div>

          {/* Customer Information */}
          {customerInfo && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông Tin Khách Hàng
              </h3>
              <div className="mb-4 p-4 bg-green-50 rounded border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="font-medium text-green-900">{customerInfo.firstName} {customerInfo.lastName}</div>
                </div>
                <div className="text-sm text-green-700">{customerInfo.phoneNumber}</div>
                {customerInfo.email && <div className="text-sm text-green-600">{customerInfo.email}</div>}
                {customerInfo.address && <div className="text-sm text-green-600">{customerInfo.address}</div>}
                <div className="text-xs text-green-500 mt-2">
                  Xe mới sẽ được thêm vào danh sách phương tiện của khách hàng này
                </div>
              </div>
            </div>
          )}

          {!customerInfo && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Thông Tin Khách Hàng
                </h3>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createNewCustomer}
                    onChange={(e) => setCreateNewCustomer(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Tạo khách hàng mới</span>
                </label>
              </div>

              {createNewCustomer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tên"
                    value={formData.customerFirstName}
                    onChange={(e) => handleInputChange('customerFirstName', e.target.value)}
                    error={errors.customerFirstName}
                    required={!customerInfo && createNewCustomer}
                    placeholder="Nguyễn"
                  />

                  <Input
                    label="Họ"
                    value={formData.customerLastName}
                    onChange={(e) => handleInputChange('customerLastName', e.target.value)}
                    error={errors.customerLastName}
                    required={!customerInfo && createNewCustomer}
                    placeholder="Văn A"
                  />

                  <Input
                    label="Số điện thoại"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    error={errors.customerPhone}
                    required={!customerInfo && createNewCustomer}
                    placeholder="0901234567"
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    placeholder="example@email.com"
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Địa chỉ"
                      value={formData.customerAddress}
                      onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                      placeholder="Số nhà, đường, phường, quận, thành phố"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-md">
                  Tính năng chọn khách hàng có sẵn sẽ được phát triển sau
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Đang tạo...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tạo Xe
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicleModal;