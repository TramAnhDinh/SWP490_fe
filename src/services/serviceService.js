import apiClient from './apiClient';

export const serviceService = {
  // Get all services with optional filters
  getServices: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await apiClient.get(`/DecalServices?${queryParams}`);
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await apiClient.get(`/DecalServices/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData) => {
    const response = await apiClient.post('/DecalServices', serviceData);
    return response.data;
  },

  // Update service
  updateService: async (id, serviceData) => {
    const response = await apiClient.put(`/DecalServices/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await apiClient.delete(`/DecalServices/${id}`);
    return response.data;
  },

  // Duplicate service
  duplicateService: async (id) => {
    const response = await apiClient.post(`/DecalServices/${id}/duplicate`);
    return response.data;
  },

  // Get service statistics
  getServiceStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.period) queryParams.append('period', params.period);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const response = await apiClient.get(`/DecalServices/statistics?${queryParams}`);
      return response.data;
    } catch (error) {
      // Return default stats if API not available
      console.warn('Statistics API not available, returning default stats');
      return {
        totalServices: 0,
        averagePrice: 0,
        totalDecalTypes: 0,
        mostPopular: null,
        totalRevenue: 0,
        categoryStats: [],
        priceRanges: []
      };
    }
  },

  // Export services
  exportServices: async (format = 'excel', params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
    
    queryParams.append('format', format);

    const response = await apiClient.get(`/DecalServices/export?${queryParams}`, {
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `services.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },

  // Get all decal types
  getDecalTypes: async () => {
    const response = await apiClient.get('/DecalTypes');
    return response.data;
  },

  // Get decal type by ID
  getDecalTypeById: async (id) => {
    const response = await apiClient.get(`/DecalTypes/${id}`);
    return response.data;
  },

  // Create new decal type
  createDecalType: async (typeData) => {
    const response = await apiClient.post('/DecalTypes', typeData);
    return response.data;
  },

  // Update decal type
  updateDecalType: async (id, typeData) => {
    const response = await apiClient.put(`/DecalTypes/${id}`, typeData);
    return response.data;
  },

  // Delete decal type
  deleteDecalType: async (id) => {
    const response = await apiClient.delete(`/DecalTypes/${id}`);
    return response.data;
  },

  // Get pricing rules
  getPricingRules: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.serviceId) queryParams.append('serviceId', params.serviceId);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);

    const response = await apiClient.get(`/pricing-rules?${queryParams}`);
    return response.data;
  },

  // Create pricing rule
  createPricingRule: async (ruleData) => {
    const response = await apiClient.post('/pricing-rules', ruleData);
    return response.data;
  },

  // Update pricing rule
  updatePricingRule: async (id, ruleData) => {
    const response = await apiClient.put(`/pricing-rules/${id}`, ruleData);
    return response.data;
  },

  // Delete pricing rule
  deletePricingRule: async (id) => {
    const response = await apiClient.delete(`/pricing-rules/${id}`);
    return response.data;
  },

  // Calculate dynamic price
  calculatePrice: async (params) => {
    const response = await apiClient.post('/pricing/calculate', params);
    return response.data;
  },

  // Get inventory items
  getInventoryItems: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.lowStock !== undefined) queryParams.append('lowStock', params.lowStock);
    if (params.storeId) queryParams.append('storeId', params.storeId);

    const response = await apiClient.get(`/inventory?${queryParams}`);
    return response.data;
  },

  // Get inventory item by ID
  getInventoryItemById: async (id) => {
    const response = await apiClient.get(`/inventory/${id}`);
    return response.data;
  },

  // Update inventory quantity
  updateInventoryQuantity: async (id, quantity, reason) => {
    const response = await apiClient.patch(`/inventory/${id}/quantity`, {
      quantity,
      reason
    });
    return response.data;
  },

  // Add inventory item
  addInventoryItem: async (itemData) => {
    const response = await apiClient.post('/inventory', itemData);
    return response.data;
  },

  // Update inventory item
  updateInventoryItem: async (id, itemData) => {
    const response = await apiClient.put(`/inventory/${id}`, itemData);
    return response.data;
  },

  // Delete inventory item
  deleteInventoryItem: async (id) => {
    const response = await apiClient.delete(`/inventory/${id}`);
    return response.data;
  },

  // Get inventory alerts
  getInventoryAlerts: async () => {
    const response = await apiClient.get('/inventory/alerts');
    return response.data;
  },

  // Get inventory movements
  getInventoryMovements: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.itemId) queryParams.append('itemId', params.itemId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.movementType) queryParams.append('movementType', params.movementType);

    const response = await apiClient.get(`/inventory/movements?${queryParams}`);
    return response.data;
  },

  // Record inventory movement
  recordInventoryMovement: async (movementData) => {
    const response = await apiClient.post('/inventory/movements', movementData);
    return response.data;
  },

  // Get inventory statistics
  getInventoryStats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.storeId) queryParams.append('storeId', params.storeId);
    if (params.period) queryParams.append('period', params.period);

    const response = await apiClient.get(`/inventory/statistics?${queryParams}`);
    return response.data;
  },

  // Generate inventory report
  generateInventoryReport: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.reportType) queryParams.append('reportType', params.reportType);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.storeId) queryParams.append('storeId', params.storeId);

    const response = await apiClient.get(`/inventory/reports?${queryParams}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get vehicle model templates
  getVehicleModelTemplates: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.vehicleModelId) queryParams.append('vehicleModelId', params.vehicleModelId);
    if (params.decalTypeId) queryParams.append('decalTypeId', params.decalTypeId);

    const response = await apiClient.get(`/vehicle-model-decal-templates?${queryParams}`);
    return response.data;
  },

  // Create vehicle model template
  createVehicleModelTemplate: async (templateData) => {
    const response = await apiClient.post('/vehicle-model-decal-templates', templateData);
    return response.data;
  },

  // Update vehicle model template
  updateVehicleModelTemplate: async (id, templateData) => {
    const response = await apiClient.put(`/vehicle-model-decal-templates/${id}`, templateData);
    return response.data;
  },

  // Delete vehicle model template
  deleteVehicleModelTemplate: async (id) => {
    const response = await apiClient.delete(`/vehicle-model-decal-templates/${id}`);
    return response.data;
  },

  // Get service analytics
  getServiceAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.serviceId) queryParams.append('serviceId', params.serviceId);
    if (params.groupBy) queryParams.append('groupBy', params.groupBy);

    const response = await apiClient.get(`/DecalServices/analytics?${queryParams}`);
    return response.data;
  },

  // Get service usage trends
  getServiceTrends: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.serviceIds) queryParams.append('serviceIds', params.serviceIds.join(','));

    const response = await apiClient.get(`/DecalServices/trends?${queryParams}`);
    return response.data;
  },

  // Bulk update services
  bulkUpdateServices: async (serviceIds, updateData) => {
    const response = await apiClient.patch('/DecalServices/bulk-update', {
      serviceIds,
      updateData
    });
    return response.data;
  },

  // Import services from file
  importServices: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/DecalServices/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};