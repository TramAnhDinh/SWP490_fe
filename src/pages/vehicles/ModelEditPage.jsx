import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Car } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/common';
import SearchableSelect from '../../components/ui/SearchableSelect';
import { vehicleModelService } from '../../services/vehicleModels';
import { vehicleBrandService } from '../../services/vehicleBrands';

const ModelEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state - bao gồm VehicleType và ChassisNumber
    const [formData, setFormData] = useState({
        modelName: '',
        brandID: '',
        vehicleType: 'Xe máy',
        chassisNumber: '',
        description: ''
    });

    // Validation state
    const [errors, setErrors] = useState({});

    // Get model data
    const { data: model, isLoading: modelLoading, error: modelError } = useQuery({
        queryKey: ['vehicle-model', id],
        queryFn: () => vehicleModelService.getVehicleModelById(id),
        enabled: !!id,
    });

    // Get brands data
    const { data: brands = [], isLoading: brandsLoading } = useQuery({
        queryKey: ['vehicle-brands'],
        queryFn: vehicleBrandService.getVehicleBrands,
    });

    // Load model data into form
    useEffect(() => {
        if (model) {
            console.log('Model data loaded:', model);
            setFormData({
                modelName: model.modelName || '',
                brandID: model.brandID || '',
                vehicleType: 'Xe máy', // Nạp cứng giá trị
                chassisNumber: 'DEFAULT_CHASSIS', // Nạp cứng giá trị
                description: model.description || ''
            });
        }
    }, [model]);

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

    // Handle select changes
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user selects
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
            newErrors.modelName = 'Tên model là bắt buộc';
        }

        if (!formData.brandID) {
            newErrors.brandID = 'Thương hiệu là bắt buộc';
        }

        // vehicleType và chassisNumber đã được nạp cứng nên không cần validate

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update model mutation
    const updateModelMutation = useMutation({
        mutationFn: ({ id, data }) => {
            console.log('Mutation function called with:', { id, data });
            return vehicleModelService.updateVehicleModel(id, data);
        },
        onSuccess: (data) => {
            console.log('Update successful:', data);
            toast.success('Cập nhật model thành công!');
            queryClient.invalidateQueries(['vehicle-models']);
            queryClient.invalidateQueries(['vehicle-model', id]);
            navigate('/vehicles');
        },
        onError: (error) => {
            console.error('Error updating model:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);

            let errorMessage = 'Có lỗi xảy ra khi cập nhật model';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const validationErrors = Object.values(error.response.data.errors).flat();
                errorMessage = validationErrors.join(', ');
            } else if (error.response?.status === 400) {
                errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
            }

            toast.error(errorMessage);
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

        // Debug: Log the data being sent
        console.log('Sending data:', { id, data: formData });

        // Prepare update data - include all original fields with updated values
        const updateData = {
            ...model, // Include all original model data
            ...formData // Override with form data
        };

        console.log('Update data prepared:', updateData);

        try {
            await updateModelMutation.mutateAsync({ id, data: updateData });
        } catch (error) {
            // Error is handled in mutation
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (modelLoading || brandsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (modelError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải dữ liệu</h3>
                    <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
                    <Button onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                </div>
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
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Quay lại</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa model xe</h1>
                        <p className="text-gray-600">Cập nhật thông tin model xe</p>
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
                                    Tên model <span className="text-red-500">*</span>
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
                                <SearchableSelect
                                    value={formData.brandID}
                                    onChange={(value) => handleSelectChange('brandID', value)}
                                    options={brands}
                                    getOptionLabel={(brand) => brand.brandName}
                                    getOptionValue={(brand) => brand.brandID}
                                    placeholder="Chọn thương hiệu..."
                                    error={errors.brandID}
                                />
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
                            placeholder="Mô tả về model xe..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
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
                                    <span>Đang cập nhật...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Cập nhật model</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ModelEditPage;

