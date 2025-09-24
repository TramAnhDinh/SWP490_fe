import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const storeService = {
  // Get all stores
  getStores: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.STORES.GET_ALL, { params });
    return response.data;
  },

  // Get store by ID
  getStoreById: async (id) => {
    // Check if id is valid
    if (!id || id === 'undefined') {
      console.warn('Store ID is undefined or invalid');
      return null;
    }

    const response = await apiClient.get(API_ENDPOINTS.STORES.GET_BY_ID(id));
    return response.data;
  },

  // Create new store
  createStore: async (storeData) => {
    const response = await apiClient.post(API_ENDPOINTS.STORES.CREATE, storeData);
    return response.data;
  },

  // Update store
  updateStore: async (id, storeData) => {
    const response = await apiClient.put(API_ENDPOINTS.STORES.UPDATE(id), storeData);
    return response.data;
  },

  // Delete store
  deleteStore: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.STORES.DELETE(id));
    return response.data;
  },

};
