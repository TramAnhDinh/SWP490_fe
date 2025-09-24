import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Save,
    Package,
    DollarSign,
    Clock,
    Tag,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { Button, Card, Input, LoadingSpinner, Badge } from '../../components/common';
import { serviceService } from '../../services/serviceService';

const ServiceEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        serviceName: '',
        description: '',
        price: '',
        standardWorkUnits: 1,
        decalTemplateID: ''
    });

    const [errors, setErrors] = useState({});

    // Get service data
    const { data: service, isLoading: serviceLoading, error: serviceError } = useQuery({
        queryKey: ['service', id],
        queryFn: () => serviceService.getServiceById(id),
        enabled: !!id,
    });

    // Get decal templates for dropdown
    const { data: decalTemplates = [], isLoading: templatesLoading } = useQuery({
        queryKey: ['decal-templates'],
        queryFn: serviceService.getDecalTemplates,
    });

    // Update service mutation
    const updateMutation = useMutation({
        mutationFn: (data) => serviceService.updateService(id, data),
        onSuccess: () => {
            toast.success('Cập nhật dịch vụ thành công!');
            queryClient.invalidateQueries(['service', id]);
            queryClient.invalidateQueries(['services']);
            navigate(-1);
        },
        onError: (error) => {
            console.error('Error updating service:', error);
            toast.error('Có lỗi xảy ra khi cập nhật dịch vụ');
        },
    });

    // Populate form when service data loads
    useEffect(() => {
        if (service) {
            setFormData({
                serviceName: service.serviceName || '',
                description: service.description || '',
                price: service.price || '',
                standardWorkUnits: service.standardWorkUnits || 1,
                decalTemplateID: service.decalTemplateID || ''
            });
        }
    }, [service]);

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
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.serviceName?.trim()) {
            newErrors.serviceName = 'Tên dịch vụ là bắt buộc';
        }

        if (!formData.price || parseFloat(formData.price) < 0) {
            newErrors.price = 'Giá dịch vụ phải lớn hơn hoặc bằng 0';
        }

        if (!formData.decalTemplateID) {
            newErrors.decalTemplateID = 'Mẫu decal là bắt buộc';
        }

        if (formData.standardWorkUnits < 1) {
            newErrors.standardWorkUnits = 'Đơn vị công sức phải lớn hơn 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
            return;
        }

        const updateData = {
            serviceName: formData.serviceName.trim(),
            description: formData.description?.trim() || null,
            price: parseFloat(formData.price),
            standardWorkUnits: parseInt(formData.standardWorkUnits),
            decalTemplateID: formData.decalTemplateID
        };

        updateMutation.mutate(updateData);
    };

    if (serviceLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (serviceError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 mb-4">Không thể tải thông tin dịch vụ</p>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Không tìm thấy dịch vụ</p>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
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
                        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa dịch vụ</h1>
                        <p className="text-gray-600">Cập nhật thông tin dịch vụ</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Badge variant="outline" size="sm">
                        ID: {service.serviceID}
                    </Badge>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
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
                                        placeholder="Nhập tên dịch vụ..."
                                        error={errors.serviceName}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả dịch vụ
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mô tả dịch vụ..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="h-4 w-4 inline mr-1" />
                                            Giá dịch vụ (VNĐ) <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            min="0"
                                            step="1000"
                                            error={errors.price}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="h-4 w-4 inline mr-1" />
                                            Đơn vị công sức <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            name="standardWorkUnits"
                                            type="number"
                                            value={formData.standardWorkUnits}
                                            onChange={handleInputChange}
                                            placeholder="1"
                                            min="1"
                                            error={errors.standardWorkUnits}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Decal Template Selection */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Tag className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-medium text-gray-900">Mẫu decal</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chọn mẫu decal <span className="text-red-500">*</span>
                                </label>
                                {templatesLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <LoadingSpinner size="sm" />
                                        <span className="ml-2 text-gray-600">Đang tải mẫu decal...</span>
                                    </div>
                                ) : (
                                    <select
                                        name="decalTemplateID"
                                        value={formData.decalTemplateID}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.decalTemplateID ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        required
                                    >
                                        <option value="">Chọn mẫu decal...</option>
                                        {decalTemplates.map(template => (
                                            <option key={template.templateID} value={template.templateID}>
                                                {template.templateName} - {template.decalType?.decalTypeName || 'Chưa phân loại'}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {errors.decalTemplateID && (
                                    <p className="mt-1 text-sm text-red-600">{errors.decalTemplateID}</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Information */}
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin hiện tại</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tên dịch vụ</label>
                                    <p className="text-gray-900 font-medium">{service.serviceName}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Giá hiện tại</label>
                                    <p className="text-gray-900 font-medium">
                                        {service.price?.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Công sức</label>
                                    <p className="text-gray-900 font-medium">
                                        {service.standardWorkUnits} đơn vị
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Mẫu decal</label>
                                    <p className="text-gray-900 font-medium">
                                        {service.decalTemplateName || 'Chưa chọn'}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Loại decal</label>
                                    <p className="text-gray-900 font-medium">
                                        {service.decalTypeName || 'Chưa phân loại'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Actions */}
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Hành động</h3>

                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="w-full"
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <LoadingSpinner size="sm" className="mr-2" />
                                            Đang cập nhật...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Lưu thay đổi
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="w-full"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Hủy bỏ
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ServiceEditPage;

