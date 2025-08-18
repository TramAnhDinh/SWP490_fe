import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const orderService = {
    getOrders: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.status) queryParams.append('status', params.status);
        if (params.customerId) queryParams.append('customerId', params.customerId);
        if (params.employeeId) queryParams.append('employeeId', params.employeeId);
        if (params.serviceId) queryParams.append('serviceId', params.serviceId);
        if (params.storeId) queryParams.append('storeId', params.storeId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.page) queryParams.append('page', params.page);
        if (params.pageSize) queryParams.append('pageSize', params.pageSize);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        const response = await apiClient.get(`/Orders?${queryParams}`);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await apiClient.get(`/Orders/${id}`);
        return response.data;
    },

    createOrder: async (orderData) => {
        const response = await apiClient.post('/Orders', orderData);
        return response.data;
    },

    updateOrder: async (id, orderData) => {
        const response = await apiClient.put(`/Orders/${id}`, orderData);
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await apiClient.delete(`/Orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await apiClient.patch(`/Orders/${id}/status`, { status });
        return response.data;
    },

    assignOrder: async (id, employeeId) => {
        const response = await apiClient.patch(`/Orders/${id}/assign`, { employeeId });
        return response.data;
    },

    getOrderStats: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.storeId) queryParams.append('storeId', params.storeId);

        const response = await apiClient.get(`/Orders/stats?${queryParams}`);
        return response.data;
    },

    exportOrders: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.status) queryParams.append('status', params.status);
        if (params.format) queryParams.append('format', params.format);

        const response = await apiClient.get(`/Orders/export?${queryParams}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    getOrderTimeline: async (id) => {
        const response = await apiClient.get(`/Orders/${id}/timeline`);
        return response.data;
    },

    addOrderNote: async (id, note) => {
        const response = await apiClient.post(`/Orders/${id}/notes`, { note });
        return response.data;
    },

    getOrderNotes: async (id) => {
        const response = await apiClient.get(`/Orders/${id}/notes`);
        return response.data;
    },

    uploadOrderFiles: async (id, files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await apiClient.post(`/Orders/${id}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    getOrderFiles: async (id) => {
        const response = await apiClient.get(`/Orders/${id}/files`);
        return response.data;
    },

    deleteOrderFile: async (orderId, fileId) => {
        const response = await apiClient.delete(`/Orders/${orderId}/files/${fileId}`);
        return response.data;
    }
};
