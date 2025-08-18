import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign,
  Package,
  Settings,
  TrendingUp,
  Clock,
  Users,
  Tag,
  BarChart3,
  Download,
  Upload,
  Copy,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, LoadingSpinner, Badge } from '../../components/common';
import { serviceService } from '../../services/serviceService';

const ServiceListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedServices, setSelectedServices] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get services data
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['services', searchTerm, filterCategory, filterStatus],
    queryFn: () => serviceService.getServices({
      search: searchTerm,
      category: filterCategory !== 'all' ? filterCategory : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined
    }),
  });

  // Get decal types for categories
  const { data: decalTypes = [] } = useQuery({
    queryKey: ['decal-types'],
    queryFn: serviceService.getDecalTypes,
  });

  // Get service statistics
  const { data: stats } = useQuery({
    queryKey: ['service-stats'],
    queryFn: serviceService.getServiceStats,
  });

  // Create service mutation
  const createMutation = useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      toast.success('Dịch vụ đã được tạo thành công!');
      setShowCreateModal(false);
      queryClient.invalidateQueries(['services']);
    },
    onError: (error) => {
      toast.error('Lỗi khi tạo dịch vụ: ' + error.message);
    },
  });

  // Delete service mutation
  const deleteMutation = useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      toast.success('Dịch vụ đã được xóa thành công!');
      queryClient.invalidateQueries(['services']);
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa dịch vụ: ' + error.message);
    },
  });

  // Duplicate service mutation
  const duplicateMutation = useMutation({
    mutationFn: serviceService.duplicateService,
    onSuccess: () => {
      toast.success('Dịch vụ đã được sao chép thành công!');
      queryClient.invalidateQueries(['services']);
    },
    onError: (error) => {
      toast.error('Lỗi khi sao chép dịch vụ: ' + error.message);
    },
  });

  const handleDelete = (serviceId, serviceName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${serviceName}"? Hành động này không thể hoàn tác.`)) {
      deleteMutation.mutate(serviceId);
    }
  };

  const handleDuplicate = (serviceId) => {
    duplicateMutation.mutate(serviceId);
  };

  const handleCreateService = (formData) => {
    const serviceData = {
      serviceName: formData.get('serviceName'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')) || 0,
      standardWorkUnits: parseInt(formData.get('standardWorkUnits')) || 1,
      decalTypeID: formData.get('decalTypeID'),
    };

    createMutation.mutate(serviceData);
  };

  const handleBulkAction = (action) => {
    if (selectedServices.length === 0) {
      toast.error('Vui lòng chọn ít nhất một dịch vụ!');
      return;
    }

    const confirmMessage = action === 'delete' 
      ? `Xóa ${selectedServices.length} dịch vụ đã chọn?`
      : `Thực hiện hành động với ${selectedServices.length} dịch vụ đã chọn?`;

    if (window.confirm(confirmMessage)) {
      if (action === 'delete') {
        selectedServices.forEach(serviceId => {
          deleteMutation.mutate(serviceId);
        });
      }
      setSelectedServices([]);
    }
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Decal thể thao': 'bg-blue-100 text-blue-800',
      'Decal cảnh báo': 'bg-red-100 text-red-800',
      'Decal trang trí': 'bg-purple-100 text-purple-800',
      'Decal quảng cáo': 'bg-green-100 text-green-800',
      'Decal bảo vệ': 'bg-orange-100 text-orange-800',
    };
    return colors[categoryName] || 'bg-gray-100 text-gray-800';
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.decalType?.typeName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || 
      service.decalType?.typeName === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ</h1>
          <p className="text-gray-600">Quản lý danh mục dịch vụ và giá cả</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/services/analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Thống kê
          </Button>
          <Button
            variant="outline"
            onClick={() => serviceService.exportServices()}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm dịch vụ
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng dịch vụ</p>
              <p className="text-xl font-semibold">{services.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Giá trung bình</p>
              <p className="text-xl font-semibold">
                {stats?.averagePrice ? `${stats.averagePrice.toLocaleString()} VNĐ` : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Loại decal</p>
              <p className="text-xl font-semibold">{decalTypes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phổ biến nhất</p>
              <p className="text-xl font-semibold">
                {stats?.mostPopular?.serviceName?.slice(0, 10) || 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm dịch vụ, mô tả, loại decal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả loại</option>
              {decalTypes.map(type => (
                <option key={type.decalTypeID} value={type.typeName}>
                  {type.typeName}
                </option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              >
                <Package className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedServices.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              Đã chọn {selectedServices.length} dịch vụ
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('export')}
              >
                Xuất Excel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('delete')}
                className="text-red-600 hover:text-red-700"
              >
                Xóa
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Services Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.serviceID} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {service.serviceName}
                    </h3>
                    <Badge className={getCategoryColor(service.decalType?.typeName)}>
                      {service.decalType?.typeName || 'Chưa phân loại'}
                    </Badge>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.serviceID)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedServices([...selectedServices, service.serviceID]);
                      } else {
                        setSelectedServices(selectedServices.filter(id => id !== service.serviceID));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {service.description || 'Không có mô tả'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-semibold text-green-600">
                      {service.price.toLocaleString()} VNĐ
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Công sức:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.standardWorkUnits} đơn vị
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/services/${service.serviceID}`)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Xem
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/services/${service.serviceID}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicate(service.serviceID)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(service.serviceID, service.serviceName)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedServices.length === filteredServices.length && filteredServices.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedServices(filteredServices.map(s => s.serviceID));
                        } else {
                          setSelectedServices([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left p-4">Tên dịch vụ</th>
                  <th className="text-left p-4">Loại decal</th>
                  <th className="text-left p-4">Giá</th>
                  <th className="text-left p-4">Công sức</th>
                  <th className="text-left p-4">Mô tả</th>
                  <th className="text-left p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.serviceID} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.serviceID)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service.serviceID]);
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== service.serviceID));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {service.serviceName}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getCategoryColor(service.decalType?.typeName)}>
                        {service.decalType?.typeName || 'Chưa phân loại'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-green-600">
                        {service.price.toLocaleString()} VNĐ
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.standardWorkUnits} đơn vị
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="text-sm text-gray-600 truncate">
                        {service.description || 'Không có mô tả'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/services/${service.serviceID}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/services/${service.serviceID}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(service.serviceID)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(service.serviceID, service.serviceName)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredServices.length === 0 && (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Không tìm thấy dịch vụ nào phù hợp với bộ lọc</p>
            </div>
          )}
        </Card>
      )}

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Thêm dịch vụ mới</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateService(new FormData(e.target));
            }}>
              <div className="space-y-4">
                <Input
                  name="serviceName"
                  placeholder="Tên dịch vụ"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Mô tả dịch vụ"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Input
                  name="price"
                  type="number"
                  placeholder="Giá dịch vụ (VNĐ)"
                  min="0"
                  step="1000"
                  required
                />
                <Input
                  name="standardWorkUnits"
                  type="number"
                  placeholder="Đơn vị công sức tiêu chuẩn"
                  min="1"
                  defaultValue="1"
                  required
                />
                <select
                  name="decalTypeID"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn loại decal</option>
                  {decalTypes.map(type => (
                    <option key={type.decalTypeID} value={type.decalTypeID}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" disabled={createMutation.isPending} className="flex-1">
                  {createMutation.isPending ? 'Đang tạo...' : 'Tạo dịch vụ'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceListPage;