import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { decalTemplateService } from '../../services/decalTemplateService';
import { decalTypeService } from '../../services/decalTypeService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Select from '../../components/common/Select';

const EditDecalTemplatePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        templateName: '',
        imageURL: '',
        decalTypeID: '',
    });

    // Get decal template data
    const { data: template, isLoading, error } = useQuery({
        queryKey: ['decalTemplate', id],
        queryFn: () => decalTemplateService.getDecalTemplateById(id),
        enabled: !!id,
    });

    // Get decal types for dropdown
    const { data: decalTypes = [] } = useQuery({
        queryKey: ['decalTypes'],
        queryFn: () => decalTypeService.getDecalTypes(),
    });

    // Update form data when template is loaded
    useEffect(() => {
        if (template) {
            setFormData({
                templateName: template.templateName || '',
                imageURL: template.imageURL || '',
                decalTypeID: template.decalTypeID || '',
            });
        }
    }, [template]);

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => decalTemplateService.updateDecalTemplate(id, data),
        onSuccess: () => {
            toast.success('Đã cập nhật mẫu decal thành công!');
            queryClient.invalidateQueries(['decalTemplates']);
            queryClient.invalidateQueries(['decalTemplate', id]);
            navigate(`/decal-templates/${id}`);
        },
        onError: (error) => {
            console.error('Update decal template error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật mẫu decal';
            toast.error('Lỗi khi cập nhật mẫu decal: ' + errorMessage);
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

        if (!formData.templateName.trim()) {
            newErrors.templateName = 'Tên mẫu decal là bắt buộc';
        }

        if (!formData.decalTypeID) {
            newErrors.decalTypeID = 'Vui lòng chọn loại decal';
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
            templateName: formData.templateName.trim(),
            imageURL: formData.imageURL || null,
            decalTypeID: formData.decalTypeID,
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
                    <Button onClick={() => navigate('/decal-templates')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy mẫu decal</h2>
                    <p className="text-gray-600 mb-4">Mẫu decal bạn tìm kiếm không tồn tại</p>
                    <Button onClick={() => navigate('/decal-templates')}>
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
                    onClick={() => navigate(`/decal-templates/${id}`)}
                    className="p-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Mẫu Decal</h1>
                    <p className="text-gray-600">Cập nhật thông tin mẫu decal: {template.templateName}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Save className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên mẫu decal <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="templateName"
                                        value={formData.templateName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên mẫu decal"
                                        error={errors.templateName}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL hình ảnh
                                    </label>
                                    <Input
                                        name="imageURL"
                                        value={formData.imageURL}
                                        onChange={handleInputChange}
                                        placeholder="Nhập URL hình ảnh"
                                        error={errors.imageURL}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Loại decal <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        name="decalTypeID"
                                        value={formData.decalTypeID}
                                        onChange={handleInputChange}
                                        options={decalTypes.map(type => ({
                                            value: type.decalTypeID,
                                            label: type.decalTypeName
                                        }))}
                                        placeholder="Chọn loại decal"
                                        error={errors.decalTypeID}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động</h3>
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(`/decal-templates/${id}`)}
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

export default EditDecalTemplatePage;