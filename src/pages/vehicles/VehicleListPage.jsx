import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Car, Settings, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Input, Card, Badge, LoadingSpinner } from '../../components/common';
import { vehicleBrandService } from '../../services/vehicleBrands';
import { vehicleModelService } from '../../services/vehicleModels';
import { useQuery } from '@tanstack/react-query';

const VehicleListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('brands'); // 'brands' or 'models'

  // Fetch vehicle brands
  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['vehicle-brands'],
    queryFn: () => vehicleBrandService.getVehicleBrands(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch vehicle models
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['vehicle-models'],
    queryFn: () => vehicleModelService.getVehicleModels(),
    staleTime: 1000 * 60 * 5,
  });

  const filteredBrands = brands?.filter(brand => 
    searchTerm === '' || 
    brand.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredModels = models?.filter(model => 
    searchTerm === '' || 
    model.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const isLoading = brandsLoading || modelsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phương tiện</h1>
          <p className="text-gray-600">Danh sách thương hiệu và mẫu xe</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/vehicles/brands/create">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Thêm thương hiệu
            </Button>
          </Link>
          <Link to="/vehicles/models/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm mẫu xe
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('brands')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'brands'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thương hiệu ({filteredBrands.length})
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'models'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mẫu xe ({filteredModels.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`Tìm kiếm ${activeTab === 'brands' ? 'thương hiệu' : 'mẫu xe'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Content */}
      {activeTab === 'brands' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.brandID} className="p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{brand.brandName}</h3>
                    <p className="text-sm text-gray-500">ID: {brand.brandID}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  Hoạt động
                </Badge>
              </div>

              {/* Description */}
              {brand.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{brand.description}</p>
                </div>
              )}

              {/* Statistics */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Số mẫu xe:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {models?.filter(model => model.brandID === brand.brandID).length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className="ml-2 font-semibold text-green-600">Hoạt động</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Link to={`/vehicles/brands/${brand.brandID}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                  </Link>
                  <Link to={`/vehicles/brands/${brand.brandID}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                  </Link>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <Card key={model.modelID} className="p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Car className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{model.modelName}</h3>
                    <p className="text-sm text-gray-500">{model.brandName}</p>
                  </div>
                </div>
                <Badge variant="success" size="sm">
                  Hoạt động
                </Badge>
              </div>

              {/* Description */}
              {model.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{model.description}</p>
                </div>
              )}

              {/* Model Details */}
              <div className="mb-4 space-y-2">
                {model.year && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Năm sản xuất:</span>
                    <span className="font-medium">{model.year}</span>
                  </div>
                )}
                {model.engineType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Loại động cơ:</span>
                    <span className="font-medium">{model.engineType}</span>
                  </div>
                )}
                {model.fuelType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Loại nhiên liệu:</span>
                    <span className="font-medium">{model.fuelType}</span>
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Decal types:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {model.decalTypeCount || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Templates:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {model.templateCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Link to={`/vehicles/models/${model.modelID}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Button>
                  </Link>
                  <Link to={`/vehicles/models/${model.modelID}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                  </Link>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {activeTab === 'brands' && filteredBrands.length === 0 && (
        <Card className="p-12 text-center">
          <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thương hiệu nào</h3>
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm thương hiệu xe đầu tiên</p>
          <Link to="/vehicles/brands/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm thương hiệu
            </Button>
          </Link>
        </Card>
      )}

      {activeTab === 'models' && filteredModels.length === 0 && (
        <Card className="p-12 text-center">
          <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có mẫu xe nào</h3>
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách thêm mẫu xe đầu tiên</p>
          <Link to="/vehicles/models/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm mẫu xe
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default VehicleListPage;