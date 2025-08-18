import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Car,
    Calendar,
    Tag,
    Users,
    Building
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../../components/common';
import { vehicleModelService } from '../../services/vehicleModels';
import { vehicleBrandService } from '../../services/vehicleBrands';

const ModelDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: model, isLoading, error } = useQuery({
        queryKey: ['vehicle-model', id],
        queryFn: () => vehicleModelService.getVehicleModelById(id),
        enabled: !!id,
    });

    const { data: brand } = useQuery({
        queryKey: ['vehicle-brand', model?.brandID],
        queryFn: () => vehicleBrandService.getVehicleBrandById(model?.brandID),
        enabled: !!model?.brandID,
    });

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mẫu xe này?')) {
            try {
                await vehicleModelService.deleteVehicleModel(id);
                toast.success('Xóa mẫu xe thành công!');
                navigate('/vehicles');
            } catch (error) {
                console.error('Error deleting model:', error);
                toast.error('Có lỗi xảy ra khi xóa mẫu xe');
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
                    <p className="text-red-500 mb-4">Không thể tải thông tin mẫu xe</p>
                    <Button onClick={() => navigate('/vehicles')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    if (!model) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Không tìm thấy mẫu xe</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">{model.modelName}</h1>
                        <p className="text-gray-600">Thông tin chi tiết mẫu xe</p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Link to={`/vehicles/models/${id}/edit`}>
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
                                <Car className="h-5 w-5 mr-2" />
                                Thông tin cơ bản
                            </h3>
                            <Badge variant="success" size="sm">
                                {model.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Tên mẫu xe</label>
                                <p className="text-gray-900 font-medium">{model.modelName}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Mã mẫu xe</label>
                                <p className="text-gray-900 font-medium">{model.modelID}</p>
                            </div>

                            {model.year && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Năm sản xuất</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {model.year}
                                    </p>
                                </div>
                            )}

                            {model.bodyType && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Loại thân xe</label>
                                    <p className="text-gray-900 flex items-center">
                                        <Tag className="h-4 w-4 mr-1" />
                                        {model.bodyType}
                                    </p>
                                </div>
                            )}
                        </div>

                        {model.description && (
                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                                <p className="text-gray-900 mt-1">{model.description}</p>
                            </div>
                        )}
                    </Card>

                    {/* Brand Information */}
                    {brand && (
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <Building className="h-5 w-5 mr-2" />
                                Thông tin thương hiệu
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Thương hiệu</label>
                                    <p className="text-gray-900 font-medium">{brand.brandName}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Mã thương hiệu</label>
                                    <p className="text-gray-900 font-medium">{brand.brandID}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link
                                    to={`/vehicles/brands/${brand.brandID}`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Xem chi tiết thương hiệu →
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Model Image */}
                    {model.imageUrl && (
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
                            <div className="flex justify-center">
                                <img
                                    src={model.imageUrl}
                                    alt={`${model.modelName} image`}
                                    className="h-32 w-32 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        </Card>
                    )}

                    {/* Statistics */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Trạng thái</span>
                                <Badge variant={model.isActive ? "success" : "secondary"} size="sm">
                                    {model.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                </Badge>
                            </div>

                            {model.year && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Năm sản xuất</span>
                                    <span className="font-semibold text-gray-900">{model.year}</span>
                                </div>
                            )}

                            {model.bodyType && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Loại thân xe</span>
                                    <span className="font-semibold text-gray-900">{model.bodyType}</span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Hành động nhanh</h3>

                        <div className="space-y-3">
                            <Link to={`/vehicles/models/${id}/edit`}>
                                <Button variant="outline" className="w-full">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa mẫu xe
                                </Button>
                            </Link>

                            {brand && (
                                <Link to={`/vehicles/brands/${brand.brandID}`}>
                                    <Button className="w-full">
                                        <Building className="h-4 w-4 mr-2" />
                                        Xem thương hiệu
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ModelDetailPage;
