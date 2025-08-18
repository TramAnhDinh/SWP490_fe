import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const vehicleBrandService = {
  // Get all vehicle brands
  getVehicleBrands: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_BRANDS.BASE, { params });
    return response.data;
  },

  // Get vehicle brand by ID
  getVehicleBrandById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id));
    return response.data;
  },

  // Create new vehicle brand
  createVehicleBrand: async (brandData) => {
    const response = await apiClient.post(API_ENDPOINTS.VEHICLE_BRANDS.BASE, brandData);
    return response.data;
  },

  // Update vehicle brand
  updateVehicleBrand: async (id, brandData) => {
    const response = await apiClient.put(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id), brandData);
    return response.data;
  },

  // Delete vehicle brand
  deleteVehicleBrand: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id));
    return response.data;
  },
};