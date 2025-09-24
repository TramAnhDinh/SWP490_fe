import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Package, AlertTriangle } from 'lucide-react';
import { decalTypeService } from '../../services/decalTypeService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditDecalTypePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        decalTypeName: '',
        material: '',
        width: '',
        height: '',
    });

    // Get decal type data
    const { data: decalType, isLoading, error } = useQuery({
        queryKey: ['decalType', id],
        queryFn: () => decalTypeService.getDecalTypeById(id),
        enabled: !!id,
    });

    // Update form data when decal type is loaded
    useEffect(() => {
        if (decalType) {
            setFormData({
                decalTypeName: decalType.decalTypeName || '',
                material: decalType.material || '',
                width: decalType.width ? decalType.width.toString() : '',
                height: decalType.height ? decalType.height.toString() : '',
            });
        }
    }, [decalType]);

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => decalTypeService.updateDecalType(id, data),
        onSuccess: () => {
            toast.success('Đã cập nhật loại decal thành công!');
            queryClient.invalidateQueries(['decalTypes']);
            queryClient.invalidateQueries(['decalType', id]);
            navigate(`/decal-types/${id}`);
        },
        onError: (error) => {
            console.error('Update decal type error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật loại decal';
            toast.error('Lỗi khi cập nhật loại decal: ' + errorMessage);
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

        if (formData.width && (isNaN(formData.width) || parseFloat(formData.width) < 0)) {
            newErrors.width = 'Chiều rộng phải là số dương';
        }

        if (formData.height && (isNaN(formData.height) || parseFloat(formData.height) < 0)) {
            newErrors.height = 'Chiều cao phải là số dương';
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
            width: formData.width ? parseFloat(formData.width) : null,
            height: formData.height ? parseFloat(formData.height) : null,
        };

        updateMutation.mutate({ id, data: submitData });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <Button onClick={() => navigate('/decal-types')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    if (!decalType) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy loại decal</h2>
                    <p className="text-gray-600 mb-4">Loại decal bạn tìm kiếm không tồn tại</p>
                    <Button onClick={() => navigate('/decal-types')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/decal-types/${id}`)}
                    className="p-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Loại Decal</h1>
                    <p className="text-gray-600">Cập nhật thông tin loại decal: {decalType.decalTypeName}</p>
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

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Thông số kỹ thuật</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chiều rộng (cm)
                                    </label>
                                    <Input
                                        name="width"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={formData.width}
                                        onChange={handleInputChange}
                                        placeholder="0.0"
                                        error={errors.width}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chiều cao (cm)
                                    </label>
                                    <Input
                                        name="height"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        placeholder="0.0"
                                        error={errors.height}
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
                                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(`/decal-types/${id}`)}
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

export default EditDecalTypePage;
