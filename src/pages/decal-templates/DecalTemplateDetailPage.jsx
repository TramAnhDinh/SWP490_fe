import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Image,
    Package,
    Calendar,
    AlertTriangle,
    Download,
    Share,
    Eye
} from 'lucide-react';
import { decalTemplateService } from '../../services/decalTemplateService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const DecalTemplateDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: template, isLoading, error } = useQuery({
        queryKey: ['decalTemplate', id],
        queryFn: () => decalTemplateService.getDecalTemplateById(id),
        enabled: !!id,
    });

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
                    <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/decal-templates')}
                        className="p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{template.templateName}</h1>
                        <p className="text-gray-600">Chi tiết mẫu decal</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/decal-templates/edit/${id}`)}
                        className="flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Tên mẫu decal
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {template.templateName}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    ID
                                </label>
                                <p className="text-sm font-mono text-gray-600">
                                    {template.templateID}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Loại decal
                                </label>
                                <Badge variant="secondary">{template.decalTypeName}</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Image Display */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Image className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Hình ảnh mẫu</h2>
                        </div>

                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {template.imageURL ? (
                                <img
                                    src={template.imageURL}
                                    alt={template.templateName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Chưa có hình ảnh</p>
                                </div>
                            )}
                        </div>

                        {template.imageURL && (
                            <div className="flex items-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(template.imageURL, '_blank')}
                                    className="flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Xem ảnh gốc
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = template.imageURL;
                                        link.download = `${template.templateName}.jpg`;
                                        link.click();
                                        toast.success('Đã tải xuống hình ảnh!');
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Tải xuống
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(template.imageURL);
                                        toast.success('Đã copy link hình ảnh!');
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Share className="w-4 h-4" />
                                    Chia sẻ
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Mẫu decal này có thể được sử dụng để tạo dịch vụ decal</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Hình ảnh giúp khách hàng dễ dàng nhận diện</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Loại decal xác định thuộc tính kỹ thuật</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DecalTemplateDetailPage;