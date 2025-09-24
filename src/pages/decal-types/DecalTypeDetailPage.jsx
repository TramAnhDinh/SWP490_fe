import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Package,
    Ruler,
    Layers,
    Calendar,
    AlertTriangle
} from 'lucide-react';
import { decalTypeService } from '../../services/decalTypeService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const DecalTypeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: decalType, isLoading, error } = useQuery({
        queryKey: ['decalType', id],
        queryFn: () => decalTypeService.getDecalTypeById(id),
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/decal-types')}
                        className="p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{decalType.decalTypeName}</h1>
                        <p className="text-gray-600">Chi tiết loại decal</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/decal-types/${id}/edit`)}
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
                                    Tên loại decal
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {decalType.decalTypeName}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    ID
                                </label>
                                <p className="text-sm font-mono text-gray-600">
                                    {decalType.decalTypeID}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Vật liệu
                                </label>
                                {decalType.material ? (
                                    <Badge variant="secondary">{decalType.material}</Badge>
                                ) : (
                                    <span className="text-gray-400">Chưa xác định</span>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Technical Specifications */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Ruler className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Thông số kỹ thuật</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Chiều rộng
                                </label>
                                {decalType.width ? (
                                    <p className="text-lg font-semibold text-gray-900">
                                        {decalType.width} cm
                                    </p>
                                ) : (
                                    <span className="text-gray-400">Chưa xác định</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Chiều cao
                                </label>
                                {decalType.height ? (
                                    <p className="text-lg font-semibold text-gray-900">
                                        {decalType.height} cm
                                    </p>
                                ) : (
                                    <span className="text-gray-400">Chưa xác định</span>
                                )}
                            </div>
                        </div>

                        {decalType.width && decalType.height && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">Kích thước tổng thể</span>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    {decalType.width}cm × {decalType.height}cm
                                </p>
                                <p className="text-sm text-gray-600">
                                    Diện tích: {(decalType.width * decalType.height).toFixed(2)} cm²
                                </p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate(`/decal-types/${id}/edit`)}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Chỉnh sửa
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/decal-types')}
                                className="w-full"
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    </Card>

                    {/* Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Loại decal này có thể được sử dụng để tạo các mẫu decal</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Thông số kỹ thuật giúp xác định khả năng ứng dụng</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Vật liệu ảnh hưởng đến chất lượng và độ bền</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DecalTypeDetailPage;
