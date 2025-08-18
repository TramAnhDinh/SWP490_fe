import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const storeService = {
    // Lấy danh sách tất cả stores
    getStores: async () => {
        const response = await apiClient.get(API_ENDPOINTS.STORES.BASE);
        return response.data;
    },

    // Lấy chi tiết store theo ID
    getStoreById: async (storeId) => {
        const response = await apiClient.get(API_ENDPOINTS.STORES.BY_ID(storeId));
        return response.data;
    },

    // Tạo store mới
    createStore: async (storeData) => {
        const response = await apiClient.post(API_ENDPOINTS.STORES.BASE, storeData);
        return response.data;
    },

    // Cập nhật store
    updateStore: async (storeId, storeData) => {
        const response = await apiClient.put(API_ENDPOINTS.STORES.BY_ID(storeId), storeData);
        return response.data;
    },

    // Xóa store
    deleteStore: async (storeId) => {
        const response = await apiClient.delete(API_ENDPOINTS.STORES.BY_ID(storeId));
        return response.data;
    },

    // Cập nhật trạng thái store
    updateStoreStatus: async (storeId, isActive) => {
        const response = await apiClient.patch(`${API_ENDPOINTS.STORES.BY_ID(storeId)}/status`, { isActive });
        return response.data;
    },

    // Lấy danh sách nhân viên của store
    getStoreEmployees: async (storeId) => {
        const response = await apiClient.get(`${API_ENDPOINTS.STORES.BY_ID(storeId)}/employees`);
        return response.data;
    },

    // Lấy thống kê store
    getStoreStats: async (storeId) => {
        const response = await apiClient.get(`${API_ENDPOINTS.STORES.BY_ID(storeId)}/stats`);
        return response.data;
    }
};
