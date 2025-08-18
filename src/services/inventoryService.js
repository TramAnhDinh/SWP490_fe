import apiClient from './apiClient';

export const inventoryService = {
  // ===== DECAL TYPES MANAGEMENT =====
  
  // Get all decal types
  getDecalTypes: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await apiClient.get(`/DecalTypes?${queryParams}`);
    return response.data;
  },

  // Get decal type by ID
  getDecalTypeById: async (id) => {
    const response = await apiClient.get(`/DecalTypes/${id}`);
    return response.data;
  },

  // Create new decal type
  createDecalType: async (decalTypeData) => {
    const response = await apiClient.post('/DecalTypes', decalTypeData);
    return response.data;
  },

  // Update decal type
  updateDecalType: async (id, decalTypeData) => {
    const response = await apiClient.put(`/DecalTypes/${id}`, decalTypeData);
    return response.data;
  },

  // Delete decal type
  deleteDecalType: async (id) => {
    const response = await apiClient.delete(`/DecalTypes/${id}`);
    return response.data;
  },

  // ===== PRICING MANAGEMENT =====
  
  // Get all tech labor prices
  getTechLaborPrices: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.serviceId) queryParams.append('serviceId', params.serviceId);
    if (params.vehicleModelId) queryParams.append('vehicleModelId', params.vehicleModelId);
    
    const response = await apiClient.get(`/TechLaborPrices?${queryParams}`);
    return response.data;
  },

  // Get tech labor price by service and vehicle model
  getTechLaborPrice: async (serviceId, vehicleModelId) => {
    const response = await apiClient.get(`/TechLaborPrices/${serviceId}/${vehicleModelId}`);
    return response.data;
  },

  // Create new tech labor price
  createTechLaborPrice: async (priceData) => {
    const response = await apiClient.post('/TechLaborPrices', priceData);
    return response.data;
  },

  // Update tech labor price
  updateTechLaborPrice: async (serviceId, vehicleModelId, priceData) => {
    const response = await apiClient.put(`/TechLaborPrices/${serviceId}/${vehicleModelId}`, priceData);
    return response.data;
  },

  // Delete tech labor price
  deleteTechLaborPrice: async (serviceId, vehicleModelId) => {
    const response = await apiClient.delete(`/TechLaborPrices/${serviceId}/${vehicleModelId}`);
    return response.data;
  },

  // ===== INVENTORY TRACKING =====
  
  // Get all services with stock information
  getInventoryServices: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.decalTypeId) queryParams.append('decalTypeId', params.decalTypeId);
    if (params.lowStock) queryParams.append('lowStock', params.lowStock);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await apiClient.get(`/DecalServices?${queryParams}`);
    return response.data;
  },

  // Get inventory statistics
  getInventoryStatistics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.decalTypeId) queryParams.append('decalTypeId', params.decalTypeId);
    
    const response = await apiClient.get(`/DecalServices/statistics?${queryParams}`);
    return response.data;
  },

  // Update service stock quantity (if backend supports)
  updateServiceStock: async (serviceId, stockData) => {
    // This would need to be implemented in backend
    const response = await apiClient.patch(`/DecalServices/${serviceId}/stock`, stockData);
    return response.data;
  },

  // Get low stock alerts
  getLowStockServices: async (threshold = 10) => {
    const response = await apiClient.get(`/DecalServices?lowStock=${threshold}`);
    return response.data;
  },

  // ===== BULK OPERATIONS =====
  
  // Bulk update prices
  bulkUpdatePrices: async (priceUpdates) => {
    const response = await apiClient.patch('/TechLaborPrices/bulk-update', { priceUpdates });
    return response.data;
  },

  // Bulk update stock
  bulkUpdateStock: async (stockUpdates) => {
    const response = await apiClient.patch('/DecalServices/bulk-stock-update', { stockUpdates });
    return response.data;
  },

  // Export inventory data
  exportInventory: async (format = 'excel', params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.decalTypeId) queryParams.append('decalTypeId', params.decalTypeId);
    queryParams.append('format', format);

    const response = await apiClient.get(`/DecalServices/export?${queryParams}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ===== HELPER FUNCTIONS =====
  
  // Get all vehicle models (for pricing matrix)
  getVehicleModels: async () => {
    const response = await apiClient.get('/VehicleModels');
    return response.data;
  },

  // Get vehicle brands
  getVehicleBrands: async () => {
    const response = await apiClient.get('/VehicleBrands');
    return response.data;
  },

  // Calculate pricing matrix
  calculatePricingMatrix: async (serviceIds, vehicleModelIds) => {
    const response = await apiClient.post('/TechLaborPrices/calculate-matrix', {
      serviceIds,
      vehicleModelIds
    });
    return response.data;
  },

  // Validate price data
  validatePriceData: async (priceData) => {
    const response = await apiClient.post('/TechLaborPrices/validate', priceData);
    return response.data;
  },

  // Get pricing history (if backend supports)
  getPricingHistory: async (serviceId, vehicleModelId, params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await apiClient.get(`/TechLaborPrices/${serviceId}/${vehicleModelId}/history?${queryParams}`);
    return response.data;
  },

  // ===== ANALYTICS =====
  
  // Get inventory analytics
  getInventoryAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.groupBy) queryParams.append('groupBy', params.groupBy);
    
    const response = await apiClient.get(`/DecalServices/analytics?${queryParams}`);
    return response.data;
  },

  // Get pricing analytics
  getPricingAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.serviceId) queryParams.append('serviceId', params.serviceId);
    
    const response = await apiClient.get(`/TechLaborPrices/analytics?${queryParams}`);
    return response.data;
  },

  // Get popular services
  getPopularServices: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const response = await apiClient.get(`/DecalServices/popular?${queryParams}`);
    return response.data;
  }
};