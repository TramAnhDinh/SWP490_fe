import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const vehicleModelService = {
  // Get all vehicle models
  getVehicleModels: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.BASE, { params });
    return response.data;
  },

  // Get vehicle model by ID
  getVehicleModelById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id));
    return response.data;
  },

  // Create new vehicle model
  createVehicleModel: async (modelData) => {
    const response = await apiClient.post(API_ENDPOINTS.VEHICLE_MODELS.BASE, modelData);
    return response.data;
  },

  // Update vehicle model
  updateVehicleModel: async (id, modelData) => {
    const response = await apiClient.put(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id), modelData);
    return response.data;
  },

  // Delete vehicle model
  deleteVehicleModel: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id));
    return response.data;
  },

  // Get decal types for a vehicle model
  getDecalTypes: async (modelId) => {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPES(modelId));
    return response.data;
  },

  // Add decal type to vehicle model
  addDecalType: async (modelId, decalTypeId) => {
    const response = await apiClient.post(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPE(modelId, decalTypeId));
    return response.data;
  },

  // Update decal type for vehicle model
  updateDecalType: async (modelId, decalTypeId, decalTypeData) => {
    const response = await apiClient.put(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPE(modelId, decalTypeId), decalTypeData);
    return response.data;
  },

  // Remove decal type from vehicle model
  removeDecalType: async (modelId, decalTypeId) => {
    const response = await apiClient.delete(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPE(modelId, decalTypeId));
    return response.data;
  },

  // Get templates for a vehicle model
  getTemplates: async (modelId) => {
    const response = await apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.TEMPLATES(modelId));
    return response.data;
  },
};