import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Image, Upload, X } from 'lucide-react';
import { decalTemplateService } from '../../services/decalTemplateService';
import { decalTypeService } from '../../services/decalTypeService';
import { uploadToCloudinary } from '../../config/cloudinary';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchableSelect from '../../components/ui/SearchableSelect';

const AddDecalTemplatePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        templateID: '',
        templateName: '',
        imageURL: '',
        decalTypeID: '',
    });

    // Get decal types for dropdown
    const { data: decalTypes = [] } = useQuery({
        queryKey: ['decalTypes'],
        queryFn: () => decalTypeService.getDecalTypes(),
    });

    const createMutation = useMutation({
        mutationFn: decalTemplateService.createDecalTemplate,
        onSuccess: () => {
            toast.success('Đã tạo mẫu decal thành công!');
            queryClient.invalidateQueries(['decalTemplates']);
            navigate('/decal-templates');
        },
        onError: (error) => {
            console.error('Create decal template error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo mẫu decal';
            toast.error('Lỗi khi tạo mẫu decal: ' + errorMessage);
            setIsSubmitting(false);
        },
    });

    // Cloudinary upload function
    const handleCloudinaryUpload = async (file) => {
        return await uploadToCloudinary(file, {
            folder: 'decal-templates',
            tags: 'decal,template,upload'
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file ảnh hợp lệ');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 5MB');
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setIsUploadingImage(true);

        try {
            const result = await handleCloudinaryUpload(file);
            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    imageURL: result.url
                }));
                toast.success('Tải ảnh lên thành công!');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Lỗi khi tải ảnh lên Cloudinary: ' + error.message);
            setImageFile(null);
            setImagePreview(null);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData(prev => ({
            ...prev,
            imageURL: ''
        }));
    };

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

        if (!formData.templateID.trim()) {
            newErrors.templateID = 'ID mẫu decal là bắt buộc';
        }

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
            templateID: formData.templateID.trim(),
            templateName: formData.templateName.trim(),
            imageURL: formData.imageURL || null,
            decalTypeID: formData.decalTypeID,
        };

        createMutation.mutate(submitData);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/decal-templates')}
                    className="p-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm Mẫu Decal Mới</h1>
                    <p className="text-gray-600">Tạo mẫu decal mới với hình ảnh</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Image className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ID mẫu decal <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="templateID"
                                        value={formData.templateID}
                                        onChange={handleInputChange}
                                        placeholder="Nhập ID mẫu decal (ví dụ: TEMP001)"
                                        error={errors.templateID}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên mẫu decal <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="templateName"
                                        value={formData.templateName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên mẫu decal"
                                        error={errors.templateName}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại decal <span className="text-red-500">*</span>
                                    </label>
                                    <SearchableSelect
                                        options={decalTypes.map(type => ({
                                            value: type.decalTypeID,
                                            label: type.decalTypeName
                                        }))}
                                        value={formData.decalTypeID}
                                        onChange={(value) => setFormData(prev => ({ ...prev, decalTypeID: value }))}
                                        placeholder="Chọn loại decal"
                                        error={errors.decalTypeID}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Hình ảnh mẫu</h2>
                            </div>

                            <div className="space-y-4">
                                {!imagePreview ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={isUploadingImage}
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-lg font-medium text-gray-900 mb-2">
                                                {isUploadingImage ? 'Đang tải lên...' : 'Tải lên hình ảnh'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Kéo thả file hoặc click để chọn (PNG, JPG, GIF - tối đa 5MB)
                                            </p>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
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
                                    <p>Tên mẫu decal sẽ được hiển thị trong danh sách</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Hình ảnh giúp khách hàng dễ dàng nhận diện mẫu</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p>Loại decal xác định thuộc tính kỹ thuật</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động</h3>
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isUploadingImage}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isSubmitting ? 'Đang tạo...' : 'Tạo mẫu decal'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/decal-templates')}
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

export default AddDecalTemplatePage;
