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

        const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.BASE}?${queryParams}`);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id));
        return response.data;
    },

    createOrder: async (orderData) => {
        const response = await apiClient.post(API_ENDPOINTS.ORDERS.BASE, orderData);
        return response.data;
    },

    updateOrder: async (id, orderData) => {
        const response = await apiClient.put(API_ENDPOINTS.ORDERS.BY_ID(id), orderData);
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.ORDERS.BY_ID(id));
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), status);
        return response.data;
    },

    assignOrder: async (orderId, employeeId) => {
        const response = await apiClient.put(API_ENDPOINTS.ORDERS.ASSIGN_EMPLOYEE(orderId, employeeId));
        return response.data;
    },

    unassignOrder: async (orderId) => {
        const response = await apiClient.delete(API_ENDPOINTS.ORDERS.UNASSIGN_EMPLOYEE(orderId));
        return response.data;
    },

    getAssignedEmployee: async (orderId) => {
        const response = await apiClient.get(API_ENDPOINTS.ORDERS.ASSIGNED_EMPLOYEE(orderId));
        return response.data;
    },

    getOrderStats: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.storeId) queryParams.append('storeId', params.storeId);

        const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.STATS}?${queryParams}`);
        return response.data;
    },

    getSalesStatistics: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);

        const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.SALES_STATISTICS}?${queryParams}`);
        return response.data;
    },

    getOrderCreateFormData: async () => {
        const response = await apiClient.get(API_ENDPOINTS.ORDERS.CREATE_FORM_DATA);
        return response.data;
    },

    trackOrder: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.orderId) queryParams.append('orderId', params.orderId);
        if (params.customerPhone) queryParams.append('customerPhone', params.customerPhone);
        if (params.licensePlate) queryParams.append('licensePlate', params.licensePlate);

        const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.TRACKING}?${queryParams}`);
        return response.data;
    },

    searchCustomers: async (searchTerm) => {
        const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.SEARCH_CUSTOMERS}?searchTerm=${searchTerm}`);
        return response.data;
    },

    createOrderWithCustomer: async (orderData) => {
        const response = await apiClient.post(API_ENDPOINTS.ORDERS.WITH_CUSTOMER, orderData);
        return response.data;
    },

    createCustomerWithAccount: async (customerData) => {
        const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE_CUSTOMER, customerData);
        return response.data;
    },

    exportOrders: async (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.status) queryParams.append('status', params.status);
        if (params.format) queryParams.append('format', params.format);

        const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.EXPORT}?${queryParams}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    getOrderTimeline: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.ORDERS.TIMELINE(id));
        return response.data;
    },

    addOrderNote: async (id, note) => {
        const response = await apiClient.post(API_ENDPOINTS.ORDERS.NOTES(id), { note });
        return response.data;
    },

    getOrderNotes: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.ORDERS.NOTES(id));
        return response.data;
    },

    uploadOrderFiles: async (id, files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await apiClient.post(API_ENDPOINTS.ORDERS.FILES(id), formData, {
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
