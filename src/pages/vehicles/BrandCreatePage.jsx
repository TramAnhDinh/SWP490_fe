import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Car } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/common';
import { vehicleBrandService } from '../../services/vehicleBrands';

const BrandCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state - chỉ cần brandName
  const [formData, setFormData] = useState({
    brandName: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function - chỉ validate brandName
  const validateForm = () => {
    const newErrors = {};

    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Tên thương hiệu là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create brand mutation
  const createBrandMutation = useMutation({
    mutationFn: (brandData) => vehicleBrandService.createVehicleBrand(brandData),
    onSuccess: (data) => {
      toast.success('Thêm thương hiệu thành công!');
      queryClient.invalidateQueries(['vehicle-brands']);
      navigate('/vehicles');
    },
    onError: (error) => {
      console.error('Error creating brand:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm thương hiệu');
    }
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      await createBrandMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/vehicles')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thêm thương hiệu xe mới</h1>
            <p className="text-gray-600">Nhập thông tin thương hiệu xe mới</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Thông tin thương hiệu
            </h3>

            <div>
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên thương hiệu <span className="text-red-500">*</span>
                </label>
                <Input
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Honda, Toyota, Ford..."
                  className={errors.brandName ? 'border-red-500' : ''}
                />
                {errors.brandName && (
                  <p className="text-red-500 text-sm mt-1">{errors.brandName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/vehicles')}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Lưu thương hiệu</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BrandCreatePage;