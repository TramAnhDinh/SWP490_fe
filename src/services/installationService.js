import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const installationService = {
    // Get all installations with optional filters
    getInstallations: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.technicianId) queryParams.append('technicianId', params.technicianId);
        if (params.storeId) queryParams.append('storeId', params.storeId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const response = await apiClient.get(`/Installations?${queryParams}`);
        return response.data;
    },

    // Get installation by ID
    getInstallationById: async (id) => {
        const response = await apiClient.get(`/Installations/${id}`);
        return response.data;
    },

    // Create new installation
    createInstallation: async (installationData) => {
        const response = await apiClient.post('/Installations', installationData);
        return response.data;
    },

    // Update installation
    updateInstallation: async (id, installationData) => {
        const response = await apiClient.put(`/Installations/${id}`, installationData);
        return response.data;
    },

    // Delete installation
    deleteInstallation: async (id) => {
        const response = await apiClient.delete(`/Installations/${id}`);
        return response.data;
    },

    // Get installation queue (pending installations)
    getInstallationQueue: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.technicianId) queryParams.append('technicianId', params.technicianId);
        if (params.storeId) queryParams.append('storeId', params.storeId);
        if (params.priority) queryParams.append('priority', params.priority);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);

        const response = await apiClient.get(`/Installations/queue?${queryParams}`);
        return response.data;
    },

    // Update installation status
    updateInstallationStatus: async (id, status, notes = '') => {
        const response = await apiClient.patch(`/Installations/${id}/status`, {
            status,
            notes
        });
        return response.data;
    },

    // Assign installation to technician
    assignInstallation: async (id, technicianId) => {
        const response = await apiClient.patch(`/Installations/${id}/assign`, {
            technicianId
        });
        return response.data;
    },

    // Upload quality photos
    uploadQualityPhotos: async (id, photos) => {
        const formData = new FormData();
        photos.forEach((photo, index) => {
            formData.append(`photos`, photo);
        });

        const response = await apiClient.post(`/Installations/${id}/photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get installation statistics
    getInstallationStats: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.period) queryParams.append('period', params.period);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.technicianId) queryParams.append('technicianId', params.technicianId);
        if (params.storeId) queryParams.append('storeId', params.storeId);

        const response = await apiClient.get(`/Installations/statistics?${queryParams}`);
        return response.data;
    },

    // Get quality control reports
    getQualityControlReports: async (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.technicianId) queryParams.append('technicianId', params.technicianId);
        if (params.storeId) queryParams.append('storeId', params.storeId);
        if (params.qualityScore) queryParams.append('qualityScore', params.qualityScore);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);

        const response = await apiClient.get(`/Installations/quality-reports?${queryParams}`);
        return response.data;
    },

    // Submit quality control report
    submitQualityReport: async (id, qualityData) => {
        const response = await apiClient.post(`/Installations/${id}/quality-report`, qualityData);
        return response.data;
    },

    // Get installation timeline
    getInstallationTimeline: async (id) => {
        const response = await apiClient.get(`/Installations/${id}/timeline`);
        return response.data;
    },

    // Export installations
    exportInstallations: async (format = 'excel', params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.technicianId) queryParams.append('technicianId', params.technicianId);
        if (params.storeId) queryParams.append('storeId', params.storeId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);

        queryParams.append('format', format);

        const response = await apiClient.get(`/Installations/export?${queryParams}`, {
            responseType: 'blob',
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `installations.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        return response.data;
    },
};
