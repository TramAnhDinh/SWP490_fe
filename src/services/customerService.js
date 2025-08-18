import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const customerService = {
  getCustomers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.storeId) queryParams.append('storeId', params.storeId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get(`/Customers?${queryParams}`);
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await apiClient.get(`/Customers/${id}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await apiClient.post('/Customers', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`/Customers/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await apiClient.delete(`/Customers/${id}`);
    return response.data;
  },

  updateCustomerStatus: async (id, status) => {
    const response = await apiClient.patch(`/Customers/${id}/status`, { status });
    return response.data;
  },

  getCustomerOrders: async (id, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await apiClient.get(`/Customers/${id}/orders?${queryParams}`);
    return response.data;
  },

  getCustomerInstallations: async (id, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await apiClient.get(`/Customers/${id}/installations?${queryParams}`);
    return response.data;
  },

  getCustomerStats: async (id) => {
    const response = await apiClient.get(`/Customers/${id}/stats`);
    return response.data;
  },

  getCustomerHistory: async (id, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.type) queryParams.append('type', params.type);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await apiClient.get(`/Customers/${id}/history?${queryParams}`);
    return response.data;
  },

  addCustomerNote: async (id, note) => {
    const response = await apiClient.post(`/Customers/${id}/notes`, { note });
    return response.data;
  },

  getCustomerNotes: async (id) => {
    const response = await apiClient.get(`/Customers/${id}/notes`);
    return response.data;
  },

  updateCustomerNote: async (customerId, noteId, note) => {
    const response = await apiClient.put(`/Customers/${customerId}/notes/${noteId}`, { note });
    return response.data;
  },

  deleteCustomerNote: async (customerId, noteId) => {
    const response = await apiClient.delete(`/Customers/${customerId}/notes/${noteId}`);
    return response.data;
  },

  uploadCustomerFiles: async (id, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await apiClient.post(`/Customers/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getCustomerFiles: async (id) => {
    const response = await apiClient.get(`/Customers/${id}/files`);
    return response.data;
  },

  deleteCustomerFile: async (customerId, fileId) => {
    const response = await apiClient.delete(`/Customers/${customerId}/files/${fileId}`);
    return response.data;
  },

  getCustomerPreferences: async (id) => {
    const response = await apiClient.get(`/Customers/${id}/preferences`);
    return response.data;
  },

  updateCustomerPreferences: async (id, preferences) => {
    const response = await apiClient.put(`/Customers/${id}/preferences`, preferences);
    return response.data;
  },

  getCustomerCommunications: async (id, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.type) queryParams.append('type', params.type);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await apiClient.get(`/Customers/${id}/communications?${queryParams}`);
    return response.data;
  },

  sendCustomerMessage: async (id, messageData) => {
    const response = await apiClient.post(`/Customers/${id}/messages`, messageData);
    return response.data;
  },

  getCustomerMessages: async (id, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const response = await apiClient.get(`/Customers/${id}/messages?${queryParams}`);
    return response.data;
  },

  markCustomerMessageAsRead: async (customerId, messageId) => {
    const response = await apiClient.patch(`/Customers/${customerId}/messages/${messageId}/read`);
    return response.data;
  },

  deleteCustomerMessage: async (customerId, messageId) => {
    const response = await apiClient.delete(`/Customers/${customerId}/messages/${messageId}`);
    return response.data;
  },

  exportCustomers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.status) queryParams.append('status', params.status);
    if (params.storeId) queryParams.append('storeId', params.storeId);
    if (params.format) queryParams.append('format', params.format);

    const response = await apiClient.get(`/Customers/export?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  getCustomerStats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.storeId) queryParams.append('storeId', params.storeId);

    const response = await apiClient.get(`/Customers/stats?${queryParams}`);
    return response.data;
  }
};