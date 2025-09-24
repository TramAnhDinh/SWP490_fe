import apiClient from './apiClient';

export const serviceService = {
  // Get all services with optional filters
  getServices: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);
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
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.period) queryParams.append('period', params.period);

    const response = await apiClient.get(`/DecalServices/statistics?${queryParams}`);
    return response.data;
  },

  // Export services
  exportServices: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.format) queryParams.append('format', params.format);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);

    const response = await apiClient.get(`/DecalServices/export?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get decal types
  getDecalTypes: async () => {
    const response = await apiClient.get('/DecalTypes');
    return response.data;
  },

  // Get decal templates
  getDecalTemplates: async () => {
    const response = await apiClient.get('/DecalTemplates');
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
    if (params.lowStock) queryParams.append('lowStock', params.lowStock);

    const response = await apiClient.get(`/inventory/items?${queryParams}`);
    return response.data;
  },

  // Get inventory statistics
  getInventoryStats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.period) queryParams.append('period', params.period);
    if (params.category) queryParams.append('category', params.category);

    const response = await apiClient.get(`/inventory/statistics?${queryParams}`);
    return response.data;
  },

  // Update inventory levels
  updateInventoryLevel: async (itemId, quantity) => {
    const response = await apiClient.put(`/inventory/items/${itemId}/stock`, { quantity });
    return response.data;
  },

  // Get service categories
  getServiceCategories: async () => {
    const response = await apiClient.get('/service-categories');
    return response.data;
  },

  // Get service statuses
  getServiceStatuses: async () => {
    const response = await apiClient.get('/service-statuses');
    return response.data;
  }
};