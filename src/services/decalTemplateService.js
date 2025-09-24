import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const decalTemplateService = {
    // Get all decal templates
    getDecalTemplates: async () => {
        const response = await apiClient.get(API_ENDPOINTS.DECAL_TEMPLATES.BASE);
        return response.data;
    },

    // Get decal template by ID
    getDecalTemplateById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.DECAL_TEMPLATES.BY_ID(id));
        return response.data;
    },

    // Create new decal template
    createDecalTemplate: async (templateData) => {
        const response = await apiClient.post(API_ENDPOINTS.DECAL_TEMPLATES.CREATE, templateData);
        return response.data;
    },

    // Update decal template
    updateDecalTemplate: async (id, templateData) => {
        const response = await apiClient.put(API_ENDPOINTS.DECAL_TEMPLATES.UPDATE(id), templateData);
        return response.data;
    },

    // Delete decal template
    deleteDecalTemplate: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.DECAL_TEMPLATES.DELETE(id));
        return response.data;
    },

    // Assign template to vehicle
    assignTemplateToVehicle: async (templateId, modelId) => {
        const response = await apiClient.post(API_ENDPOINTS.DECAL_TEMPLATES.ASSIGN_VEHICLE(templateId, modelId));
        return response.data;
    },

    // Unassign template from vehicle
    unassignTemplateFromVehicle: async (templateId, modelId) => {
        const response = await apiClient.delete(API_ENDPOINTS.DECAL_TEMPLATES.UNASSIGN_VEHICLE(templateId, modelId));
        return response.data;
    },
};
