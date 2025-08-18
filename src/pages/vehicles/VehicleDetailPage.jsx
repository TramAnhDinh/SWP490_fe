import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Car,
    User,
    Calendar,
    MapPin,
    Settings,
    Eye,
    ExternalLink
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../../components/common';
import { customerVehicleService } from '../../services/customerVehicles';
import { format } from 'date-fns';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Get vehicle data
    const { data: vehicle, isLoading, error } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => customerVehicleService.getVehicleById(id),
        enabled: !!id,
    });

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
            try {
                await customerVehicleService.deleteVehicle(id);
                toast.success('Xóa phương tiện thành công!');
                navigate('/vehicles');
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                toast.error('Có lỗi xảy ra khi xóa phương tiện');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            return 'N/A';
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
                    <p className="text-red-500 mb-4">Không thể tải thông tin phương tiện</p>
                    <Button onClick={() => navigate('/vehicles')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Không tìm thấy phương tiện</p>
                    <Button onClick={() => navigate('/vehicles')}>
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
                        onClick={() => navigate('/vehicles')}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Quay lại</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chi tiết phương tiện</h1>
                        <p className="text-gray-600">Thông tin chi tiết về phương tiện</p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Link to={`/vehicles/${id}/edit`}>
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
                    {/* Vehicle Information */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <Car className="h-5 w-5 mr-2" />
                                Thông tin phương tiện
                            </h3>
                            <Badge variant="success" size="sm">
                                Hoạt động
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div key="vehicleId">
                                <label className="text-sm font-medium text-gray-500">Mã phương tiện</label>
                                <p className="text-gray-900 font-medium">{vehicle.vehicleID}</p>
                            </div>

                            <div key="licensePlate">
                                <label className="text-sm font-medium text-gray-500">Biển số xe</label>
                                <p className="text-gray-900 font-medium">{vehicle.licensePlate}</p>
                            </div>

                            {vehicle.chassisNumber && (
                                <div key="chassisNumber">
                                    <label className="text-sm font-medium text-gray-500">Số khung</label>
                                    <p className="text-gray-900">{vehicle.chassisNumber}</p>
                                </div>
                            )}

                            {vehicle.color && (
                                <div key="color">
                                    <label className="text-sm font-medium text-gray-500">Màu sắc</label>
                                    <p className="text-gray-900">{vehicle.color}</p>
                                </div>
                            )}

                            {vehicle.year && (
                                <div key="year">
                                    <label className="text-sm font-medium text-gray-500">Năm sản xuất</label>
                                    <p className="text-gray-900">{vehicle.year}</p>
                                </div>
                            )}

                            {vehicle.initialKM && (
                                <div key="initialKM">
                                    <label className="text-sm font-medium text-gray-500">Số km ban đầu</label>
                                    <p className="text-gray-900">{vehicle.initialKM.toLocaleString()} km</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Vehicle Model Information */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Settings className="h-5 w-5 mr-2" />
                            Thông tin mẫu xe
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vehicle.vehicleBrandName && (
                                <div key="brandName">
                                    <label className="text-sm font-medium text-gray-500">Thương hiệu</label>
                                    <p className="text-gray-900">{vehicle.vehicleBrandName}</p>
                                </div>
                            )}

                            {vehicle.vehicleModelName && (
                                <div key="modelName">
                                    <label className="text-sm font-medium text-gray-500">Mẫu xe</label>
                                    <p className="text-gray-900">{vehicle.vehicleModelName}</p>
                                </div>
                            )}

                            {vehicle.modelID && (
                                <div key="modelId">
                                    <label className="text-sm font-medium text-gray-500">Mã mẫu</label>
                                    <p className="text-gray-900">{vehicle.modelID}</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Chủ sở hữu
                            </h3>
                            {vehicle.customerID && (
                                <Link to={`/customers/${vehicle.customerID}`}>
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        Xem chi tiết
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {vehicle.customerFullName && (
                            <div className="space-y-3">
                                <div key="customerName">
                                    <label className="text-sm font-medium text-gray-500">Tên khách hàng</label>
                                    <p className="text-gray-900 font-medium">{vehicle.customerFullName}</p>
                                </div>

                                {vehicle.customerID && (
                                    <div key="customerId">
                                        <label className="text-sm font-medium text-gray-500">Mã khách hàng</label>
                                        <p className="text-gray-900">{vehicle.customerID}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>

                        <div className="space-y-3">
                            <Link to={`/orders/create?vehicleId=${vehicle.vehicleID}`}>
                                <Button className="w-full" variant="outline">
                                    <Car className="h-4 w-4 mr-2" />
                                    Tạo đơn hàng mới
                                </Button>
                            </Link>

                            <Link to={`/vehicles/${id}/edit`}>
                                <Button className="w-full" variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa thông tin
                                </Button>
                            </Link>

                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => navigate(`/orders?vehicleId=${vehicle.vehicleID}`)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Xem đơn hàng
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;
