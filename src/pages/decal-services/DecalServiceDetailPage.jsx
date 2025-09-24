import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Edit,
    Package,
    DollarSign,
    Clock,
    Calendar,
    AlertTriangle,
    Copy,
    Download
} from 'lucide-react';
import { decalService } from '../../services/decalService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';

const DecalServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: service, isLoading, error } = useQuery({
        queryKey: ['decalService', id],
        queryFn: () => decalService.getDecalServiceById(id),
        enabled: !!id,
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
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
                    <Button onClick={() => navigate('/decal-services')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy dịch vụ decal</h2>
                    <p className="text-gray-600 mb-4">Dịch vụ decal bạn tìm kiếm không tồn tại</p>
                    <Button onClick={() => navigate('/decal-services')}>
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
                        onClick={() => navigate('/decal-services')}
                        className="p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{service.serviceName}</h1>
                        <p className="text-gray-600">Chi tiết dịch vụ decal</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/decal-services/${id}/edit`)}
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
                                    Tên dịch vụ
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {service.serviceName}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    ID
                                </label>
                                <p className="text-sm font-mono text-gray-600">
                                    {service.serviceID}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Mô tả
                                </label>
                                {service.description ? (
                                    <p className="text-gray-900">{service.description}</p>
                                ) : (
                                    <span className="text-gray-400">Chưa có mô tả</span>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Pricing and Work Units */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Giá cả và thông số</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Giá dịch vụ
                                </label>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatPrice(service.price)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Đơn vị công việc chuẩn
                                </label>
                                <p className="text-2xl font-bold text-blue-600">
                                    {service.standardWorkUnits} đơn vị
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Thông tin bổ sung</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Dịch vụ này yêu cầu {service.standardWorkUnits} đơn vị công việc để hoàn thành,
                                với giá {formatPrice(service.price)} mỗi dịch vụ.
                            </p>
                        </div>
                    </Card>

                    {/* Decal Template Information */}
                    <Card className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">Thông tin mẫu decal</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Mẫu decal
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {service.decalTemplateName}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Loại decal
                                </label>
                                <Badge variant="secondary">{service.decalTypeName}</Badge>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Template ID
                                </label>
                                <p className="text-sm font-mono text-gray-600">
                                    {service.decalTemplateID}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                        <div className="space-y-3">
                            <Button
                                onClick={() => navigate(`/decal-services/${id}/edit`)}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Chỉnh sửa
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/decal-services')}
                                className="w-full"
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    </Card>

                    {/* Service Info */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin dịch vụ</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Trạng thái:</span>
                                <span className="text-green-600">Hoạt động</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Mẫu decal:</span>
                                <span className="font-medium">{service.decalTemplateName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Loại decal:</span>
                                <Badge variant="secondary" className="text-xs">
                                    {service.decalTypeName}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Giá:</span>
                                <span className="font-medium text-green-600">
                                    {formatPrice(service.price)}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Dịch vụ này có thể được sử dụng trong các đơn hàng</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Giá dịch vụ được tính theo VND</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p>Đơn vị công việc giúp tính toán thời gian hoàn thành</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DecalServiceDetailPage;
