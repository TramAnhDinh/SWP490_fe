import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  Eye
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { serviceService } from '../../services/serviceService';
import { formatUtils } from '../../utils/formatUtils';

const DecalTypesPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

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

  // Only use real data from API - no mock statistics
  const decalTypesWithStats = filteredDecalTypes;

  // Mutations
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

  // Handle operations
  const handleDelete = (decalType) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa loại decal "${decalType.decalTypeName}"? Hành động này không thể hoàn tác.`)) {
      deleteMutation.mutate(decalType.decalTypeID);
    }
  };

  const handleExportTypes = () => {
    try {
      const csvContent = [
        ['Tên loại decal', 'ID', 'Vật liệu'].join(','),
        ...decalTypesWithStats.map(type => [
          type.decalTypeName,
          type.decalTypeID,
          type.material || ''
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

  // Calculate overall statistics - only real data
  const overallStats = {
    totalTypes: decalTypesWithStats.length,
    withMaterial: decalTypesWithStats.filter(type => type.material).length,
    withDimensions: decalTypesWithStats.filter(type => type.width && type.height).length,
    searchResults: filteredDecalTypes.length
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
            onClick={() => navigate('/decal-types/add')}
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
              <p className="text-sm font-medium text-gray-600">Có vật liệu</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.withMaterial}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Đang quản lý</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Có kích thước</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.withDimensions}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Đang quản lý</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kết quả tìm kiếm</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.searchResults}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Đang quản lý</span>
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
                      onClick={() => navigate(`/decal-types/edit/${type.decalTypeID}`)}
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
                    <span className="text-sm text-gray-600">ID:</span>
                    <span className="text-sm font-mono text-gray-900">{type.decalTypeID}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vật liệu:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {type.material || 'Chưa xác định'}
                    </span>
                  </div>

                </div>

              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
};

export default DecalTypesPage;