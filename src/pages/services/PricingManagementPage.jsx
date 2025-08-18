import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  DollarSign, 
  Edit3, 
  Save, 
  X,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Truck,
  Settings,
  History,
  FileText
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { serviceService } from '../../services/serviceService';
import { formatUtils } from '../../utils/formatUtils';

const PricingManagementPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedVehicleBrand, setSelectedVehicleBrand] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceUpdates, setPriceUpdates] = useState({}); // Track price changes

  // Get data
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices(),
  });

  const { data: vehicleModels = [], isLoading: modelsLoading } = useQuery({
    queryKey: ['vehicleModels'],
    queryFn: inventoryService.getVehicleModels,
  });

  const { data: vehicleBrands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ['vehicleBrands'],
    queryFn: inventoryService.getVehicleBrands,
  });

  const { data: techLaborPrices = [], isLoading: pricesLoading, refetch: refetchPrices } = useQuery({
    queryKey: ['techLaborPrices'],
    queryFn: inventoryService.getTechLaborPrices,
  });

  // Filter data
  const filteredServices = useMemo(() => {
    return services.filter(service => 
      searchTerm === '' || 
      service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(service =>
      selectedService === '' || service.serviceID === selectedService
    );
  }, [services, searchTerm, selectedService]);

  const filteredVehicleModels = useMemo(() => {
    return vehicleModels.filter(model =>
      selectedVehicleBrand === '' || model.vehicleBrandID === selectedVehicleBrand
    );
  }, [vehicleModels, selectedVehicleBrand]);

  // Create pricing matrix
  const pricingMatrix = useMemo(() => {
    const matrix = {};
    
    // Initialize matrix with all combinations
    filteredServices.forEach(service => {
      matrix[service.serviceID] = {};
      filteredVehicleModels.forEach(model => {
        matrix[service.serviceID][model.vehicleModelID] = {
          service,
          vehicleModel: model,
          price: null,
          exists: false
        };
      });
    });

    // Fill in existing prices
    techLaborPrices.forEach(price => {
      if (matrix[price.serviceID] && matrix[price.serviceID][price.vehicleModelID]) {
        matrix[price.serviceID][price.vehicleModelID] = {
          ...matrix[price.serviceID][price.vehicleModelID],
          price: price.laborPrice,
          exists: true,
          priceData: price
        };
      }
    });

    return matrix;
  }, [filteredServices, filteredVehicleModels, techLaborPrices]);

  // Mutations
  const createPriceMutation = useMutation({
    mutationFn: inventoryService.createTechLaborPrice,
    onSuccess: () => {
      toast.success('Giá đã được tạo thành công!');
      queryClient.invalidateQueries(['techLaborPrices']);
      setShowCreateModal(false);
    },
    onError: (error) => {
      toast.error('Lỗi khi tạo giá: ' + (error.response?.data?.message || error.message));
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ serviceId, vehicleModelId, priceData }) => 
      inventoryService.updateTechLaborPrice(serviceId, vehicleModelId, priceData),
    onSuccess: () => {
      toast.success('Giá đã được cập nhật thành công!');
      queryClient.invalidateQueries(['techLaborPrices']);
      setEditingPrice(null);
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật giá: ' + (error.response?.data?.message || error.message));
    },
  });

  const deletePriceMutation = useMutation({
    mutationFn: ({ serviceId, vehicleModelId }) => 
      inventoryService.deleteTechLaborPrice(serviceId, vehicleModelId),
    onSuccess: () => {
      toast.success('Giá đã được xóa thành công!');
      queryClient.invalidateQueries(['techLaborPrices']);
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa giá: ' + (error.response?.data?.message || error.message));
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: inventoryService.bulkUpdatePrices,
    onSuccess: () => {
      toast.success('Cập nhật hàng loạt thành công!');
      queryClient.invalidateQueries(['techLaborPrices']);
      setShowBulkModal(false);
      setPriceUpdates({});
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật hàng loạt: ' + (error.response?.data?.message || error.message));
    },
  });

  // Handle price edit
  const handlePriceEdit = (serviceId, vehicleModelId, currentPrice) => {
    setEditingPrice({ serviceId, vehicleModelId, price: currentPrice || 0 });
  };

  const handlePriceSave = () => {
    if (!editingPrice) return;
    
    const { serviceId, vehicleModelId, price } = editingPrice;
    const matrixItem = pricingMatrix[serviceId][vehicleModelId];
    
    if (matrixItem.exists) {
      // Update existing price
      updatePriceMutation.mutate({
        serviceId,
        vehicleModelId,
        priceData: { laborPrice: price }
      });
    } else {
      // Create new price
      createPriceMutation.mutate({
        serviceID: serviceId,
        vehicleModelID: vehicleModelId,
        laborPrice: price
      });
    }
  };

  const handlePriceDelete = (serviceId, vehicleModelId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giá này?')) {
      deletePriceMutation.mutate({ serviceId, vehicleModelId });
    }
  };

  // Handle bulk operations
  const handleBulkPriceChange = (serviceId, vehicleModelId, newPrice) => {
    setPriceUpdates(prev => ({
      ...prev,
      [`${serviceId}-${vehicleModelId}`]: {
        serviceID: serviceId,
        vehicleModelID: vehicleModelId,
        laborPrice: parseFloat(newPrice) || 0
      }
    }));
  };

  const handleBulkSubmit = () => {
    const updates = Object.values(priceUpdates);
    if (updates.length === 0) {
      toast.error('Không có thay đổi nào để cập nhật!');
      return;
    }
    bulkUpdateMutation.mutate(updates);
  };

  // Export pricing data
  const handleExportPricing = () => {
    try {
      const csvContent = [
        ['Dịch vụ', 'Model xe', 'Hãng xe', 'Giá công', 'Trạng thái'].join(','),
        ...Object.entries(pricingMatrix).flatMap(([serviceId, models]) =>
          Object.entries(models).map(([modelId, item]) => [
            item.service.serviceName,
            item.vehicleModel.modelName,
            vehicleBrands.find(b => b.vehicleBrandID === item.vehicleModel.vehicleBrandID)?.brandName || 'N/A',
            item.price ? formatUtils.formatCurrency(item.price) : 'Chưa set',
            item.exists ? 'Có giá' : 'Chưa có giá'
          ].join(','))
        )
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pricing_matrix_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Xuất bảng giá thành công!');
    } catch (error) {
      toast.error('Lỗi khi xuất bảng giá: ' + error.message);
    }
  };

  // Calculate statistics
  const pricingStats = useMemo(() => {
    const totalCells = filteredServices.length * filteredVehicleModels.length;
    const filledCells = techLaborPrices.filter(price => 
      filteredServices.some(s => s.serviceID === price.serviceID) &&
      filteredVehicleModels.some(m => m.vehicleModelID === price.vehicleModelID)
    ).length;
    const completionRate = totalCells > 0 ? (filledCells / totalCells) * 100 : 0;
    const avgPrice = techLaborPrices.reduce((sum, p) => sum + (p.laborPrice || 0), 0) / (techLaborPrices.length || 1);

    return {
      totalCells,
      filledCells,
      completionRate,
      avgPrice,
      missingPrices: totalCells - filledCells
    };
  }, [filteredServices, filteredVehicleModels, techLaborPrices]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Giá</h1>
          <p className="text-gray-600 mt-1">Quản lý bảng giá dịch vụ theo model xe</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Cập nhật hàng loạt
          </button>
          <button
            onClick={handleExportPricing}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Xuất bảng giá
          </button>
        </div>
      </div>

      {/* Pricing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng ô giá</p>
              <p className="text-2xl font-bold text-gray-900">{pricingStats.totalCells}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Tổng combinations</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã có giá</p>
              <p className="text-2xl font-bold text-gray-900">{pricingStats.filledCells}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">{pricingStats.completionRate.toFixed(1)}%</span>
            <span className="text-gray-500 ml-1">hoàn thành</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chưa có giá</p>
              <p className="text-2xl font-bold text-gray-900">{pricingStats.missingPrices}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600">Cần cập nhật</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatUtils.formatCurrency(pricingStats.avgPrice)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Trung bình</span>
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
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="min-w-48">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={servicesLoading}
            >
              <option value="">Tất cả dịch vụ</option>
              {services.map(service => (
                <option key={service.serviceID} value={service.serviceID}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-48">
            <select
              value={selectedVehicleBrand}
              onChange={(e) => setSelectedVehicleBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={brandsLoading}
            >
              <option value="">Tất cả hãng xe</option>
              {vehicleBrands.map(brand => (
                <option key={brand.vehicleBrandID} value={brand.vehicleBrandID}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Ma trận giá dịch vụ</h3>
          <p className="text-sm text-gray-500 mt-1">
            Hiển thị {filteredServices.length} dịch vụ × {filteredVehicleModels.length} model xe
          </p>
        </div>
        
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                  Dịch vụ
                </th>
                {filteredVehicleModels.map(model => (
                  <th key={model.vehicleModelID} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                    <div className="flex flex-col">
                      <span>{model.modelName}</span>
                      <span className="font-normal text-gray-400">
                        {vehicleBrands.find(b => b.vehicleBrandID === model.vehicleBrandID)?.brandName}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pricesLoading ? (
                <tr>
                  <td colSpan={filteredVehicleModels.length + 1} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Đang tải bảng giá...</p>
                  </td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.serviceID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-gray-50 sticky left-0 z-10">
                      <div className="max-w-48">
                        <div className="truncate">{service.serviceName}</div>
                        <div className="text-xs text-gray-500 truncate">{service.description}</div>
                      </div>
                    </td>
                    {filteredVehicleModels.map(model => {
                      const cellData = pricingMatrix[service.serviceID]?.[model.vehicleModelID];
                      const isEditing = editingPrice?.serviceId === service.serviceID && 
                                      editingPrice?.vehicleModelId === model.vehicleModelID;
                      
                      return (
                        <td key={model.vehicleModelID} className="px-2 py-2 text-center">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editingPrice.price}
                                onChange={(e) => setEditingPrice(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handlePriceSave();
                                  if (e.key === 'Escape') setEditingPrice(null);
                                }}
                                autoFocus
                              />
                              <button
                                onClick={handlePriceSave}
                                className="p-1 text-green-600 hover:text-green-700"
                              >
                                <Save className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEditingPrice(null)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : cellData?.exists ? (
                            <div className="group">
                              <div 
                                className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                                onClick={() => handlePriceEdit(service.serviceID, model.vehicleModelID, cellData.price)}
                              >
                                {formatUtils.formatCurrency(cellData.price)}
                              </div>
                              <div className="hidden group-hover:flex items-center justify-center gap-1 mt-1">
                                <button
                                  onClick={() => handlePriceEdit(service.serviceID, model.vehicleModelID, cellData.price)}
                                  className="p-1 text-blue-600 hover:text-blue-700 text-xs"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handlePriceDelete(service.serviceID, model.vehicleModelID)}
                                  className="p-1 text-red-600 hover:text-red-700 text-xs"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePriceEdit(service.serviceID, model.vehicleModelID, 0)}
                              className="w-full px-2 py-1 text-xs text-gray-400 border border-dashed border-gray-300 rounded hover:border-blue-400 hover:text-blue-600 transition-colors"
                            >
                              + Thêm giá
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Update Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Cập nhật giá hàng loạt</h2>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setPriceUpdates({});
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Thay đổi giá cho nhiều combination cùng lúc. Chỉ những ô được thay đổi sẽ được cập nhật.
              </p>
            </div>

            <div className="overflow-x-auto max-h-64 mb-6">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Dịch vụ
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Model xe
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Giá hiện tại
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Giá mới
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredServices.slice(0, 5).map(service => 
                    filteredVehicleModels.slice(0, 5).map(model => {
                      const cellData = pricingMatrix[service.serviceID]?.[model.vehicleModelID];
                      const updateKey = `${service.serviceID}-${model.vehicleModelID}`;
                      
                      return (
                        <tr key={updateKey}>
                          <td className="px-4 py-2 text-sm text-gray-900">{service.serviceName}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{model.modelName}</td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {cellData?.price ? formatUtils.formatCurrency(cellData.price) : 'Chưa có'}
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              placeholder="Nhập giá mới"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              onChange={(e) => handleBulkPriceChange(service.serviceID, model.vehicleModelID, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {Object.keys(priceUpdates).length} thay đổi được chuẩn bị
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setShowBulkModal(false);
                    setPriceUpdates({});
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleBulkSubmit}
                  disabled={bulkUpdateMutation.isPending || Object.keys(priceUpdates).length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {bulkUpdateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật hàng loạt'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingManagementPage;