import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Package, DollarSign, Clock } from 'lucide-react';
import { decalService } from '../../services/decalService';
import { decalTemplateService } from '../../services/decalTemplateService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchableSelect from '../../components/ui/SearchableSelect';

const AddDecalServicePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        serviceName: '',
        description: '',
        price: '',
        standardWorkUnits: '',
        decalTemplateID: '',
    });

    // Get decal templates for dropdown
    const { data: decalTemplates = [] } = useQuery({
        queryKey: ['decalTemplates'],
        queryFn: () => decalTemplateService.getDecalTemplates(),
    });

    const createMutation = useMutation({
        mutationFn: decalService.createDecalService,
        onSuccess: () => {
            toast.success('Đã tạo dịch vụ decal thành công!');
            queryClient.invalidateQueries(['decalServices']);
            navigate('/decal-services');
        },
        onError: (error) => {
            console.error('Create decal service error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo dịch vụ decal';
            toast.error('Lỗi khi tạo dịch vụ decal: ' + errorMessage);
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

        if (!formData.serviceName.trim()) {
            newErrors.serviceName = 'Tên dịch vụ là bắt buộc';
        }

        if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
            newErrors.price = 'Giá phải là số dương';
        }

        if (!formData.standardWorkUnits || isNaN(formData.standardWorkUnits) || parseInt(formData.standardWorkUnits) < 0) {
            newErrors.standardWorkUnits = 'Đơn vị công việc phải là số nguyên dương';
        }

        if (!formData.decalTemplateID) {
            newErrors.decalTemplateID = 'Vui lòng chọn mẫu decal';
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
            serviceName: formData.serviceName.trim(),
            description: formData.description.trim() || null,
            price: parseFloat(formData.price),
            standardWorkUnits: parseInt(formData.standardWorkUnits),
            decalTemplateID: formData.decalTemplateID,
        };

        createMutation.mutate(submitData);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/decal-services')}
                    className="p-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm Dịch vụ Decal Mới</h1>
                    <p className="text-gray-600">Tạo dịch vụ decal mới với giá cả và thông số</p>
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
                                        Tên dịch vụ <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="serviceName"
                                        value={formData.serviceName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên dịch vụ decal"
                                        error={errors.serviceName}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mô tả dịch vụ (tùy chọn)"
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mẫu decal <span className="text-red-500">*</span>
                                    </label>
                                    <SearchableSelect
                                        options={decalTemplates.map(template => ({
                                            value: template.templateID,
                                            label: `${template.templateName} (${template.decalTypeName})`
                                        }))}
                                        value={formData.decalTemplateID}
                                        onChange={(value) => setFormData(prev => ({ ...prev, decalTemplateID: value }))}
                                        placeholder="Chọn mẫu decal"
                                        error={errors.decalTemplateID}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Giá cả và thông số</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giá dịch vụ (VND) <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="price"
                                        type="number"
                                        step="1000"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        error={errors.price}
                                        required
                                    />
                                    {formData.price && !isNaN(formData.price) && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Hiển thị: {formatPrice(parseFloat(formData.price))}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đơn vị công việc chuẩn <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="standardWorkUnits"
                                        type="number"
                                        min="1"
                                        value={formData.standardWorkUnits}
                                        onChange={handleInputChange}
                                        placeholder="1"
                                        error={errors.standardWorkUnits}
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Số đơn vị công việc cần thiết để hoàn thành dịch vụ
                                    </p>
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
                                    <p>Tên dịch vụ sẽ được hiển thị trong danh sách và đơn hàng</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Giá dịch vụ được tính bằng VND</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Đơn vị công việc giúp tính toán thời gian hoàn thành</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Mẫu decal xác định loại dịch vụ và kỹ thuật</p>
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
                                    {isSubmitting ? 'Đang tạo...' : 'Tạo dịch vụ'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/decal-services')}
                                    className="w-full"
                                >
                                    Hủy
                                </Button>
                            </div>
                        </Card>

                        {/* Preview Card */}
                        {formData.serviceName && formData.price && (
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Xem trước</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tên dịch vụ:</span>
                                        <span className="font-medium">{formData.serviceName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Giá:</span>
                                        <span className="font-medium text-green-600">
                                            {formatPrice(parseFloat(formData.price) || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Đơn vị công việc:</span>
                                        <span className="font-medium">{formData.standardWorkUnits || '0'}</span>
                                    </div>
                                    {formData.decalTemplateID && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Mẫu decal:</span>
                                            <span className="font-medium">
                                                {decalTemplates.find(t => t.templateID === formData.decalTemplateID)?.templateName || 'Chưa chọn'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddDecalServicePage;
