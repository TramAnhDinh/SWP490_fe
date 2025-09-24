import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const decalTypeService = {
    // Get all decal types
    getDecalTypes: async () => {
        const response = await apiClient.get(API_ENDPOINTS.DECAL_TYPES.BASE);
        return response.data;
    },

    // Get decal type by ID
    getDecalTypeById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.DECAL_TYPES.BY_ID(id));
        return response.data;
    },

    // Create new decal type
    createDecalType: async (decalTypeData) => {
        const response = await apiClient.post(API_ENDPOINTS.DECAL_TYPES.CREATE, decalTypeData);
        return response.data;
    },

    // Update decal type
    updateDecalType: async (id, decalTypeData) => {
        const response = await apiClient.put(API_ENDPOINTS.DECAL_TYPES.UPDATE(id), decalTypeData);
        return response.data;
    },

    // Delete decal type
    deleteDecalType: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.DECAL_TYPES.DELETE(id));
        return response.data;
    },
};
