import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const decalService = {
    // Get all decal services
    getDecalServices: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.format) queryParams.append('format', params.format);

        const response = await apiClient.get(`${API_ENDPOINTS.DECAL_SERVICES.BASE}?${queryParams}`);
        return response.data;
    },

    // Get decal service by ID
    getDecalServiceById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.DECAL_SERVICES.BY_ID(id));
        return response.data;
    },

    // Create new decal service
    createDecalService: async (serviceData) => {
        const response = await apiClient.post(API_ENDPOINTS.DECAL_SERVICES.CREATE, serviceData);
        return response.data;
    },

    // Update decal service
    updateDecalService: async (id, serviceData) => {
        const response = await apiClient.put(API_ENDPOINTS.DECAL_SERVICES.UPDATE(id), serviceData);
        return response.data;
    },

    // Delete decal service
    deleteDecalService: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.DECAL_SERVICES.DELETE(id));
        return response.data;
    },

    // Get service statistics
    getServiceStatistics: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.period) queryParams.append('period', params.period);

        const response = await apiClient.get(`${API_ENDPOINTS.DECAL_SERVICES.STATISTICS}?${queryParams}`);
        return response.data;
    },

    // Duplicate decal service
    duplicateDecalService: async (id) => {
        const response = await apiClient.post(API_ENDPOINTS.DECAL_SERVICES.DUPLICATE(id));
        return response.data;
    },

    // Export decal services
    exportDecalServices: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.format) queryParams.append('format', params.format);
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);

        const response = await apiClient.get(`${API_ENDPOINTS.DECAL_SERVICES.EXPORT}?${queryParams}`, {
            responseType: 'blob'
        });
        return response.data;
    },
};