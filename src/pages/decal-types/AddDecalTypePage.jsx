import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { decalTypeService } from '../../services/decalTypeService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AddDecalTypePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        decalTypeName: '',
        material: '',
    });

    const createMutation = useMutation({
        mutationFn: decalTypeService.createDecalType,
        onSuccess: () => {
            toast.success('Đã tạo loại decal thành công!');
            queryClient.invalidateQueries(['decalTypes']);
            navigate('/decal-types');
        },
        onError: (error) => {
            console.error('Create decal type error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo loại decal';
            toast.error('Lỗi khi tạo loại decal: ' + errorMessage);
            setIsSubmitting(false);
        },
    });

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.decalTypeName.trim()) {
            newErrors.decalTypeName = 'Tên loại decal là bắt buộc';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const submitData = {
            decalTypeName: formData.decalTypeName.trim(),
            material: formData.material.trim() || null,
            width: 10.0, // Default width
            height: 10.0, // Default height
        };

        createMutation.mutate(submitData);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/decal-types')}
                    className="p-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm Loại Decal Mới</h1>
                    <p className="text-gray-600">Tạo loại decal mới với thông số kỹ thuật</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên loại decal <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="decalTypeName"
                                        value={formData.decalTypeName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên loại decal"
                                        error={errors.decalTypeName}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vật liệu
                                    </label>
                                    <Input
                                        name="material"
                                        value={formData.material}
                                        onChange={handleInputChange}
                                        placeholder="Nhập vật liệu (ví dụ: Vinyl, PP, PET...)"
                                        error={errors.material}
                                    />
                                </div>
                            </div>
                        </Card>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Tên loại decal sẽ được sử dụng để phân loại các mẫu decal</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Vật liệu giúp xác định chất lượng và đặc tính của decal</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Kích thước có thể được bỏ trống nếu chưa xác định</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động</h3>
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isSubmitting ? 'Đang tạo...' : 'Tạo loại decal'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/decal-types')}
                                    className="w-full"
                                >
                                    Hủy
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddDecalTypePage;
