import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Package2, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Download,
  BarChart3,
  Activity,
  TrendingUp,
  Eye,
  X,
  Save
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { serviceService } from '../../services/serviceService';
import { formatUtils } from '../../utils/formatUtils';

const DecalTypesPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDecalType, setSelectedDecalType] = useState(null);
  const [formData, setFormData] = useState({
    decalTypeName: '',
    description: ''
  });

  // Get data
  const { data: decalTypes = [], isLoading: typesLoading, refetch: refetchTypes } = useQuery({
    queryKey: ['decalTypes', searchTerm],
    queryFn: () => inventoryService.getDecalTypes({ search: searchTerm }),
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices(),
  });

  // Filter decal types
  const filteredDecalTypes = decalTypes.filter(type => 
    searchTerm === '' || 
    type.decalTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics for each decal type
  const decalTypesWithStats = filteredDecalTypes.map(type => {
    const relatedServices = services.filter(service => service.decalTypeID === type.decalTypeID);
    const totalRevenue = relatedServices.reduce((sum, service) => sum + (service.price || 0), 0);
    const averagePrice = relatedServices.length > 0 ? totalRevenue / relatedServices.length : 0;
    
    return {
      ...type,
      servicesCount: relatedServices.length,
      totalRevenue,
      averagePrice,
      popularityScore: Math.floor(Math.random() * 100) + 1, // Mock data
      lastUsed: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Mock data
    };
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: inventoryService.createDecalType,
    onSuccess: () => {
      toast.success('Loại decal đã được tạo thành công!');
      queryClient.invalidateQueries(['decalTypes']);
      setShowCreateModal(false);
      setFormData({ decalTypeName: '', description: '' });
    },
    onError: (error) => {
      toast.error('Lỗi khi tạo loại decal: ' + (error.response?.data?.message || error.message));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => inventoryService.updateDecalType(id, data),
    onSuccess: () => {
      toast.success('Loại decal đã được cập nhật thành công!');
      queryClient.invalidateQueries(['decalTypes']);
      setShowEditModal(false);
      setSelectedDecalType(null);
      setFormData({ decalTypeName: '', description: '' });
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật loại decal: ' + (error.response?.data?.message || error.message));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryService.deleteDecalType,
    onSuccess: () => {
      toast.success('Loại decal đã được xóa thành công!');
      queryClient.invalidateQueries(['decalTypes']);
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa loại decal: ' + (error.response?.data?.message || error.message));
    },
  });

  // Handle form operations
  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.decalTypeName.trim()) {
      toast.error('Vui lòng nhập tên loại decal!');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (decalType) => {
    setSelectedDecalType(decalType);
    setFormData({
      decalTypeName: decalType.decalTypeName,
      description: decalType.description || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!formData.decalTypeName.trim()) {
      toast.error('Vui lòng nhập tên loại decal!');
      return;
    }
    updateMutation.mutate({
      id: selectedDecalType.decalTypeID,
      data: formData
    });
  };

  const handleDelete = (decalType) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa loại decal "${decalType.decalTypeName}"? Hành động này không thể hoàn tác.`)) {
      deleteMutation.mutate(decalType.decalTypeID);
    }
  };

  const handleExportTypes = () => {
    try {
      const csvContent = [
        ['Tên loại decal', 'Mô tả', 'Số dịch vụ', 'Doanh thu', 'Giá TB', 'Điểm phổ biến', 'Sử dụng cuối'].join(','),
        ...decalTypesWithStats.map(type => [
          type.decalTypeName,
          type.description || '',
          type.servicesCount,
          formatUtils.formatCurrency(type.totalRevenue),
          formatUtils.formatCurrency(type.averagePrice),
          type.popularityScore,
          formatUtils.formatDate(type.lastUsed)
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decal_types_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Xuất danh sách thành công!');
    } catch (error) {
      toast.error('Lỗi khi xuất danh sách: ' + error.message);
    }
  };

  // Calculate overall statistics
  const overallStats = {
    totalTypes: decalTypesWithStats.length,
    totalServices: decalTypesWithStats.reduce((sum, type) => sum + type.servicesCount, 0),
    totalRevenue: decalTypesWithStats.reduce((sum, type) => sum + type.totalRevenue, 0),
    averageServicesPerType: decalTypesWithStats.length > 0 ? 
      decalTypesWithStats.reduce((sum, type) => sum + type.servicesCount, 0) / decalTypesWithStats.length : 0,
    mostPopularType: decalTypesWithStats.reduce((max, type) => 
      type.popularityScore > (max?.popularityScore || 0) ? type : max, null
    )
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Loại Decal</h1>
          <p className="text-gray-600 mt-1">Quản lý các loại decal và phân loại dịch vụ</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportTypes}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            Xuất danh sách
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm loại decal
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng loại decal</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalTypes}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Đang quản lý</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng dịch vụ</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalServices}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              TB: {overallStats.averageServicesPerType.toFixed(1)} dịch vụ/loại
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatUtils.formatCurrency(overallStats.totalRevenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+15.3%</span>
            <span className="text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Phổ biến nhất</p>
              <p className="text-2xl font-bold text-gray-900 truncate">
                {overallStats.mostPopularType?.decalTypeName || 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">
              {overallStats.mostPopularType?.popularityScore || 0} điểm
            </span>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm loại decal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Decal Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {typesLoading ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Đang tải loại decal...</p>
          </div>
        ) : decalTypesWithStats.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có loại decal nào phù hợp</p>
          </div>
        ) : (
          decalTypesWithStats.map(type => (
            <div key={type.decalTypeID} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {type.decalTypeName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {type.description || 'Không có mô tả'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(type)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(type)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dịch vụ:</span>
                    <span className="text-sm font-medium text-gray-900">{type.servicesCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Doanh thu:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatUtils.formatCurrency(type.totalRevenue)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giá TB:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatUtils.formatCurrency(type.averagePrice)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Độ phổ biến:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${type.popularityScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{type.popularityScore}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sử dụng cuối:</span>
                    <span className="text-sm text-gray-500">
                      {formatUtils.formatDate(type.lastUsed)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => {
                      // Navigate to services with this decal type filter
                      toast.info('Chức năng xem chi tiết sẽ được phát triển!');
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Xem dịch vụ liên quan
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Tạo loại decal mới</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ decalTypeName: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên loại decal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.decalTypeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, decalTypeName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên loại decal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả loại decal"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ decalTypeName: '', description: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Đang tạo...' : 'Tạo loại decal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedDecalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa loại decal</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDecalType(null);
                  setFormData({ decalTypeName: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên loại decal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.decalTypeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, decalTypeName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên loại decal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả loại decal"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedDecalType(null);
                    setFormData({ decalTypeName: '', description: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecalTypesPage;