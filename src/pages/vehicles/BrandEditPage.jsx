import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Car } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/common';
import { vehicleBrandService } from '../../services/vehicleBrands';

const BrandEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state - chỉ cần brandName
    const [formData, setFormData] = useState({
        brandName: ''
    });

    // Validation state
    const [errors, setErrors] = useState({});

    // Get brand data
    const { data: brand, isLoading, error } = useQuery({
        queryKey: ['vehicle-brand', id],
        queryFn: () => vehicleBrandService.getVehicleBrandById(id),
        enabled: !!id,
    });

    // Load brand data into form
    useEffect(() => {
        if (brand) {
            setFormData({
                brandName: brand.brandName || ''
            });
        }
    }, [brand]);

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

    // Validation function - chỉ validate brandName
    const validateForm = () => {
        const newErrors = {};

        if (!formData.brandName.trim()) {
            newErrors.brandName = 'Tên thương hiệu là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Update brand mutation
    const updateBrandMutation = useMutation({
        mutationFn: ({ id, data }) => vehicleBrandService.updateVehicleBrand(id, data),
        onSuccess: (data) => {
            toast.success('Cập nhật thương hiệu thành công!');
            queryClient.invalidateQueries(['vehicle-brands']);
            queryClient.invalidateQueries(['vehicle-brand', id]);
            navigate('/vehicles');
        },
        onError: (error) => {
            console.error('Error updating brand:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thương hiệu');
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
            await updateBrandMutation.mutateAsync({ id, data: formData });
        } catch (error) {
            // Error is handled in mutation
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
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
                        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa thương hiệu xe</h1>
                        <p className="text-gray-600">Cập nhật thông tin thương hiệu xe</p>
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
                                    <span>Cập nhật thương hiệu</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default BrandEditPage;

