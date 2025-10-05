import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Car,
  Globe,
  MapPin,
  ExternalLink,
  Calendar,
  Users
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../../components/common';
import { vehicleBrandService } from '../../services/vehicleBrands';
import { vehicleModelService } from '../../services/vehicleModels';

const BrandDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: brand, isLoading, error } = useQuery({
    queryKey: ['vehicle-brand', id],
    queryFn: () => vehicleBrandService.getVehicleBrandById(id),
    enabled: !!id,
  });

  const { data: models, isLoading: modelsLoading, error: modelsError } = useQuery({
    queryKey: ['vehicle-models'],
    queryFn: () => vehicleModelService.getVehicleModels(),
    staleTime: 1000 * 60 * 5,
  });

  const brandModels = models?.filter(model =>
    model.brandID === id ||
    model.brandID?.toLowerCase() === id?.toLowerCase() ||
    model.brandID === parseInt(id) ||
    model.brandID === id?.toString()
  ) || [];

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        await vehicleBrandService.deleteVehicleBrand(id);
        toast.success('Xóa thương hiệu thành công!');
        navigate('/vehicles');
      } catch (error) {
        console.error('Error deleting brand:', error);
        toast.error('Có lỗi xảy ra khi xóa thương hiệu');
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
          <p className="text-red-500 mb-4">Không thể tải thông tin thương hiệu</p>
          <Button onClick={() => navigate('/vehicles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không tìm thấy thương hiệu</p>
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
            <h1 className="text-2xl font-bold text-gray-900">{brand.brandName}</h1>
            <p className="text-gray-600">Thông tin chi tiết thương hiệu xe</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link to={`/vehicles/brands/${id}/edit`}>
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
                {brand.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tên thương hiệu</label>
                <p className="text-gray-900 font-medium">{brand.brandName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Mã thương hiệu</label>
                <p className="text-gray-900 font-medium">{brand.brandID}</p>
              </div>

              {brand.country && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Quốc gia</label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {brand.country}
                  </p>
                </div>
              )}

              {brand.website && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    {brand.website}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {brand.description && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Mô tả</label>
                <p className="text-gray-900 mt-1">{brand.description}</p>
              </div>
            )}
          </Card>

          {/* Brand Models */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Mẫu xe ({brandModels.length})
            </h3>

            {modelsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
                <span className="ml-2 text-gray-600">Đang tải danh sách mẫu xe...</span>
              </div>
            ) : modelsError ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-2">Lỗi khi tải danh sách mẫu xe</p>
                <p className="text-sm text-gray-600">{modelsError.message}</p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </Button>
              </div>
            ) : brandModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brandModels.map((model) => (
                  <div key={model.modelID} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{model.modelName}</h4>
                      <Badge variant="success" size="sm">
                        {model.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </Badge>
                    </div>
                    {model.year && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {model.year}
                      </p>
                    )}
                    {model.bodyType && (
                      <p className="text-sm text-gray-600">{model.bodyType}</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link
                        to={`/vehicles/models/${model.modelID}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Chưa có mẫu xe nào</p>
                <p className="text-sm text-gray-400">Thêm mẫu xe đầu tiên cho thương hiệu này</p>
                <div className="mt-4">
                  <Link to="/vehicles/models/create">
                    <Button size="sm">
                      <Car className="h-4 w-4 mr-2" />
                      Thêm mẫu xe
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Brand Logo */}
          {brand.logoUrl && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
              <div className="flex justify-center">
                <img
                  src={brand.logoUrl}
                  alt={`${brand.brandName} logo`}
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
                <span className="text-gray-600">Tổng mẫu xe</span>
                <span className="font-semibold text-gray-900">{brandModels.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mẫu xe hoạt động</span>
                <span className="font-semibold text-green-600">
                  {brandModels.filter(m => m.isActive).length}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái</span>
                <Badge variant={brand.isActive ? "success" : "secondary"} size="sm">
                  {brand.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </Badge>
              </div>
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
};

export default BrandDetailPage;