import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Package,
    DollarSign,
    Tag
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../../components/common';
import { serviceService } from '../../services/serviceService';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: service, isLoading, error } = useQuery({
        queryKey: ['service', id],
        queryFn: () => serviceService.getServiceById(id),
        enabled: !!id,
    });

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            try {
                await serviceService.deleteService(id);
                toast.success('Xóa dịch vụ thành công!');
                navigate(-1);
            } catch (error) {
                console.error('Error deleting service:', error);
                toast.error('Có lỗi xảy ra khi xóa dịch vụ');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Không thể tải thông tin dịch vụ</p>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Không tìm thấy dịch vụ</p>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách
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
                        <h1 className="text-2xl font-bold text-gray-900">{service.serviceName}</h1>
                        <p className="text-gray-600">Thông tin chi tiết dịch vụ</p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Link to={`/admin/services/${id}/edit`}>
                        <Button variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Package className="h-5 w-5 mr-2" />
                                Thông tin cơ bản
                            </h3>
                            <Badge variant="success" size="sm">
                                {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tên dịch vụ</label>
                                <p className="text-gray-900 font-medium">{service.serviceName}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Mã dịch vụ</label>
                                <p className="text-gray-900 font-medium">{service.serviceID}</p>
                            </div>

                            {service.price && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Giá dịch vụ</label>
                                    <p className="text-gray-900 flex items-center">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        {service.price.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            )}

                            {service.decalType && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Loại decal</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Tag className="h-4 w-4 mr-1" />
                                        {service.decalType.decalTypeName}
                                    </p>
                                </div>
                            )}
                        </div>

                        {service.description && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                                <p className="text-gray-900 mt-1">{service.description}</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Statistics */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Trạng thái</span>
                                <Badge variant={service.isActive ? "success" : "secondary"} size="sm">
                                    {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                </Badge>
                            </div>

                            {service.price && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Giá dịch vụ</span>
                                    <span className="font-semibold text-gray-900">
                                        {service.price.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Hành động nhanh</h3>

                        <div className="space-y-3">
                            <Link to={`/admin/services/${id}/edit`}>
                                <Button variant="outline" className="w-full">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa dịch vụ
                                </Button>
                            </Link>

                            <Link to="/admin/services">
                                <Button className="w-full">
                                    <Package className="h-4 w-4 mr-2" />
                                    Quản lý dịch vụ
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailPage;
