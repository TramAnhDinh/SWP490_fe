import React, { useState } from 'react';
import { X, UserPlus, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Input from '../common/Input';
import { Textarea } from './Textarea';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateCustomerModal = ({ isOpen, onClose, onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    createAccount: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Họ là bắt buộc';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Tên là bắt buộc';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.createAccount && !formData.email) {
      newErrors.email = 'Email là bắt buộc khi tạo tài khoản';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        createAccount: false,
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      address: '',
      createAccount: false,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Tạo Khách Hàng Mới
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Họ"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={errors.firstName}
                    required
                    placeholder="Nhập họ..."
                    icon={<UserPlus className="h-4 w-4" />}
                  />

                  <Input
                    label="Tên"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={errors.lastName}
                    required
                    placeholder="Nhập tên..."
                    icon={<UserPlus className="h-4 w-4" />}
                  />
                </div>

                {/* Contact Information */}
                <Input
                  label="Số điện thoại"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  error={errors.phoneNumber}
                  required
                  placeholder="0901234567"
                  icon={<Phone className="h-4 w-4" />}
                  helper="Số điện thoại 10-11 chữ số"
                />

                <Input
                  label="Email (tùy chọn)"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  placeholder="example@email.com"
                  icon={<Mail className="h-4 w-4" />}
                  helper="Email để liên lạc và tạo tài khoản"
                />

                <Textarea
                  label="Địa chỉ (tùy chọn)"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Nhập địa chỉ chi tiết..."
                  rows={2}
                  icon={<MapPin className="h-4 w-4" />}
                />

                {/* Account Creation Option */}
                <div className="border-t pt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.createAccount}
                      onChange={(e) => handleInputChange('createAccount', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Tạo tài khoản cho khách hàng
                      </span>
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Nếu chọn, hệ thống sẽ tạo tài khoản đăng nhập cho khách hàng với email và mật khẩu tự động
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto sm:ml-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Đang tạo...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Tạo Khách Hàng
                  </div>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:w-auto mt-3 sm:mt-0"
              >
                Hủy bỏ
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerModal;