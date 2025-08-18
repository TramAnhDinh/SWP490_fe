import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Edit3,
  Plus,
  BarChart3,
  Activity,
  Truck,
  DollarSign,
  Eye
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { serviceService } from '../../services/serviceService';
import { formatUtils } from '../../utils/formatUtils';

const InventoryTrackingPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDecalType, setSelectedDecalType] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);

  // Get data
  const { data: services = [], isLoading: servicesLoading, refetch: refetchServices } = useQuery({
    queryKey: ['inventoryServices', searchTerm, selectedDecalType, showLowStockOnly],
    queryFn: () => inventoryService.getInventoryServices({
      search: searchTerm,
      decalTypeId: selectedDecalType,
      lowStock: showLowStockOnly ? 10 : undefined
    }),
  });

  const { data: decalTypes = [], isLoading: typesLoading } = useQuery({
    queryKey: ['decalTypes'],
    queryFn: inventoryService.getDecalTypes,
  });

  const { data: statistics = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['inventoryStatistics', selectedPeriod],
    queryFn: () => inventoryService.getInventoryStatistics({ period: selectedPeriod }),
  });

  // Mock stock data since backend doesn't have stock field yet
  const servicesWithStock = useMemo(() => {
    return services.map(service => ({
      ...service,
      stockQuantity: Math.floor(Math.random() * 100) + 10,
      minStockLevel: Math.floor(Math.random() * 20) + 5,
      lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      stockValue: service.price * (Math.floor(Math.random() * 100) + 10),
      monthlyUsage: Math.floor(Math.random() * 50) + 5,
      averageMonthlyUsage: Math.floor(Math.random() * 40) + 10,
      stockStatus: function() {
        if (this.stockQuantity <= this.minStockLevel) return 'low';
        if (this.stockQuantity <= this.minStockLevel * 2) return 'medium';
        return 'good';
      }()
    }));
  }, [services]);

  // Filter services
  const filteredServices = useMemo(() => {
    return servicesWithStock.filter(service => {
      const matchesSearch = searchTerm === '' || 
        service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDecalType = selectedDecalType === '' || service.decalTypeID === selectedDecalType;
      const matchesStock = !showLowStockOnly || service.stockStatus === 'low';
      
      return matchesSearch && matchesDecalType && matchesStock;
    });
  }, [servicesWithStock, searchTerm, selectedDecalType, showLowStockOnly]);

  // Calculate inventory metrics
  const inventoryMetrics = useMemo(() => {
    const totalServices = servicesWithStock.length;
    const lowStockServices = servicesWithStock.filter(s => s.stockStatus === 'low').length;
    const totalStockValue = servicesWithStock.reduce((sum, s) => sum + s.stockValue, 0);
    const averageStockLevel = servicesWithStock.reduce((sum, s) => sum + s.stockQuantity, 0) / totalServices || 0;
    
    return {
      totalServices,
      lowStockServices,
      totalStockValue,
      averageStockLevel: Math.round(averageStockLevel),
      stockTurnover: 2.3, // Mock data
      monthlyConsumption: servicesWithStock.reduce((sum, s) => sum + s.monthlyUsage, 0)
    };
  }, [servicesWithStock]);

  // Update stock mutation (mock)
  const updateStockMutation = useMutation({
    mutationFn: async ({ serviceId, newStock }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { serviceId, newStock };
    },
    onSuccess: () => {
      toast.success('Cập nhật tồn kho thành công!');
      queryClient.invalidateQueries(['inventoryServices']);
      setShowStockModal(false);
      setSelectedService(null);
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật tồn kho: ' + error.message);
    },
  });

  const handleUpdateStock = (service) => {
    setSelectedService(service);
    setShowStockModal(true);
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStock = parseInt(formData.get('newStock'));
    
    if (isNaN(newStock) || newStock < 0) {
      toast.error('Vui lòng nhập số lượng hợp lệ!');
      return;
    }

    updateStockMutation.mutate({
      serviceId: selectedService.serviceID,
      newStock
    });
  };

  const handleExportInventory = async () => {
    try {
      const csvContent = [
        ['Mã dịch vụ', 'Tên dịch vụ', 'Loại decal', 'Tồn kho', 'Mức tối thiểu', 'Trạng thái', 'Giá trị tồn kho', 'Sử dụng/tháng'].join(','),
        ...filteredServices.map(service => [
          service.serviceID,
          service.serviceName,
          service.decalType?.decalTypeName || 'N/A',
          service.stockQuantity,
          service.minStockLevel,
          service.stockStatus === 'low' ? 'Thấp' : service.stockStatus === 'medium' ? 'Trung bình' : 'Tốt',
          formatUtils.formatCurrency(service.stockValue),
          service.monthlyUsage
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Xuất báo cáo thành công!');
    } catch (error) {
      toast.error('Lỗi khi xuất báo cáo: ' + error.message);
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'low': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'good': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatusIcon = (status) => {
    switch (status) {
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Activity className="w-4 h-4" />;
      case 'good': return <TrendingUp className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi Kho</h1>
          <p className="text-gray-600 mt-1">Quản lý tồn kho và theo dõi mức inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => refetchServices()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Làm mới
          </button>
          <button
            onClick={handleExportInventory}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryMetrics.totalServices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Đang theo dõi</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cảnh báo tồn kho</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryMetrics.lowStockServices}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600">Cần bổ sung</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá trị tồn kho</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatUtils.formatCurrency(inventoryMetrics.totalStockValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12.5%</span>
            <span className="text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mức tồn kho TB</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryMetrics.averageStockLevel}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Đơn vị/sản phẩm</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="min-w-48">
            <select
              value={selectedDecalType}
              onChange={(e) => setSelectedDecalType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={typesLoading}
            >
              <option value="">Tất cả loại decal</option>
              {decalTypes.map(type => (
                <option key={type.decalTypeID} value={type.decalTypeID}>
                  {type.decalTypeName}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-32">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm này</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Chỉ tồn kho thấp</span>
            </label>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách tồn kho</h3>
            <div className="text-sm text-gray-500">
              Hiển thị {filteredServices.length} / {servicesWithStock.length} sản phẩm
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại decal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sử dụng/tháng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cập nhật cuối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicesLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Đang tải dữ liệu kho...</p>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    Không có sản phẩm nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.serviceID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {service.serviceName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatUtils.truncateText(service.description, 40)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {service.decalType?.decalTypeName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{service.stockQuantity}</span>
                        <span className="text-gray-500 ml-1">/ {service.minStockLevel} tối thiểu</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            service.stockStatus === 'low' ? 'bg-red-500' :
                            service.stockStatus === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min((service.stockQuantity / (service.minStockLevel * 3)) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(service.stockStatus)}`}>
                        {getStockStatusIcon(service.stockStatus)}
                        {service.stockStatus === 'low' ? 'Thấp' : 
                         service.stockStatus === 'medium' ? 'Trung bình' : 'Tốt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatUtils.formatCurrency(service.stockValue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.monthlyUsage}
                      </div>
                      <div className="text-xs text-gray-500">
                        TB: {service.averageMonthlyUsage}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatUtils.formatDate(service.lastRestocked)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUpdateStock(service)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {inventoryMetrics.lowStockServices > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Cảnh báo tồn kho thấp
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Có {inventoryMetrics.lowStockServices} sản phẩm đang có mức tồn kho thấp cần được bổ sung.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showStockModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cập nhật tồn kho
            </h3>
            
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700">{selectedService.serviceName}</div>
              <div className="text-sm text-gray-500">Tồn kho hiện tại: {selectedService.stockQuantity}</div>
            </div>

            <form onSubmit={handleStockSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng mới
                </label>
                <input
                  type="number"
                  name="newStock"
                  min="0"
                  defaultValue={selectedService.stockQuantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowStockModal(false);
                    setSelectedService(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={updateStockMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateStockMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTrackingPage;