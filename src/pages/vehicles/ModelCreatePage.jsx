import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Car } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/common';
import { vehicleModelService } from '../../services/vehicleModels';
import { vehicleBrandService } from '../../services/vehicleBrands';

const ModelCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state - bao gồm VehicleType và ChassisNumber với dữ liệu nạp cứng
  const [formData, setFormData] = useState({
    modelName: '',
    brandID: '',
    vehicleType: 'Xe máy', // Nạp cứng giá trị mặc định
    chassisNumber: 'DEFAULT_CHASSIS', // Nạp cứng giá trị mặc định
    description: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Fetch vehicle brands for dropdown
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['vehicle-brands'],
    queryFn: () => vehicleBrandService.getVehicleBrands(),
    staleTime: 1000 * 60 * 5,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function - chỉ validate các trường hiển thị trên UI
  const validateForm = () => {
    const newErrors = {};

    if (!formData.modelName.trim()) {
      newErrors.modelName = 'Tên mẫu xe là bắt buộc';
    }

    if (!formData.brandID) {
      newErrors.brandID = 'Vui lòng chọn thương hiệu';
    }

    // vehicleType và chassisNumber đã được nạp cứng nên không cần validate

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create model mutation
  const createModelMutation = useMutation({
    mutationFn: (modelData) => vehicleModelService.createVehicleModel(modelData),
    onSuccess: (data) => {
      toast.success('Thêm mẫu xe thành công!');
      queryClient.invalidateQueries(['vehicle-models']);
      navigate('/vehicles');
    },
    onError: (error) => {
      console.error('Error creating model:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm mẫu xe');
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
      await createModelMutation.mutateAsync(formData);
    } catch (error) {
      // Error is handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  if (brandsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Thêm mẫu xe mới</h1>
            <p className="text-gray-600">Nhập thông tin mẫu xe mới</p>
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
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên mẫu xe <span className="text-red-500">*</span>
                </label>
                <Input
                  name="modelName"
                  value={formData.modelName}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Civic, Camry, F-150..."
                  className={errors.modelName ? 'border-red-500' : ''}
                />
                {errors.modelName && (
                  <p className="text-red-500 text-sm mt-1">{errors.modelName}</p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu <span className="text-red-500">*</span>
                </label>
                <select
                  name="brandID"
                  value={formData.brandID}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.brandID ? 'border-red-500' : ''
                    }`}
                >
                  <option value="">Chọn thương hiệu</option>
                  {brands?.map((brand) => (
                    <option key={brand.brandID} value={brand.brandID}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
                {errors.brandID && (
                  <p className="text-red-500 text-sm mt-1">{errors.brandID}</p>
                )}
              </div>

            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Mô tả về mẫu xe..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
                  <span>Lưu mẫu xe</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ModelCreatePage;