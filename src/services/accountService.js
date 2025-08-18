import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const accountService = {
    // Get all accounts
    getAccounts: async () => {
        const response = await apiClient.get(API_ENDPOINTS.ACCOUNTS.BASE);
        return response.data;
    },

    // Get account by ID
    getAccountById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.ACCOUNTS.BY_ID(id));
        return response.data;
    },

    // Create new account
    createAccount: async (accountData) => {
        const response = await apiClient.post(API_ENDPOINTS.ACCOUNTS.BASE, accountData);
        return response.data;
    },

    // Update account
    updateAccount: async (id, accountData) => {
        const response = await apiClient.put(API_ENDPOINTS.ACCOUNTS.BY_ID(id), accountData);
        return response.data;
    },

    // Delete account
    deleteAccount: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.ACCOUNTS.BY_ID(id));
        return response.data;
    },

    // Update account status
    updateAccountStatus: async ({ id, isActive }) => {
        const response = await apiClient.patch(`${API_ENDPOINTS.ACCOUNTS.BY_ID(id)}/status`, { isActive });
        return response.data;
    },

    // Get all roles
    getRoles: async () => {
        try {
            const response = await apiClient.get('/roles');
            return response.data;
        } catch (error) {
            console.warn('Roles API not available, returning default roles');
            return [
                { roleID: 1, roleName: 'Admin' },
                { roleID: 2, roleName: 'Manager' },
                { roleID: 3, roleName: 'Employee' },
                { roleID: 4, roleName: 'Technician' },
                { roleID: 5, roleName: 'Customer' }
            ];
        }
    },

    // Get all stores
    getStores: async () => {
        try {
            const response = await apiClient.get('/stores');
            return response.data;
        } catch (error) {
            console.warn('Stores API not available, returning default stores');
            return [
                { storeID: 1, storeName: 'Chi nhánh Hà Nội' },
                { storeID: 2, storeName: 'Chi nhánh TP.HCM' },
                { storeID: 3, storeName: 'Chi nhánh Đà Nẵng' },
                { storeID: 4, storeName: 'Chi nhánh Cần Thơ' }
            ];
        }
    }
};
