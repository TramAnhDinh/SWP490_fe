import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Mock data for development
const mockAccounts = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@decalxe.com',
        fullName: 'System Administrator',
        role: 'Admin',
        status: 'Active',
        lastLogin: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        username: 'manager1',
        email: 'manager1@decalxe.com',
        fullName: 'Nguyễn Văn A',
        role: 'Store Manager',
        status: 'Active',
        lastLogin: '2024-01-15T09:15:00Z',
        createdAt: '2024-01-02T00:00:00Z'
    },
    {
        id: 3,
        username: 'designer1',
        email: 'designer1@decalxe.com',
        fullName: 'Trần Thị B',
        role: 'Designer',
        status: 'Active',
        lastLogin: '2024-01-15T08:45:00Z',
        createdAt: '2024-01-03T00:00:00Z'
    }
];

export const accountService = {
    // Get all accounts
    getAccounts: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ACCOUNTS.GET_ALL, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            // Return mock data for development
            return mockAccounts;
        }
    },

    // Get account by ID
    getAccountById: async (id) => {
        try {
            const response = await apiClient.get(`${API_ENDPOINTS.ACCOUNTS.GET_BY_ID}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching account:', error);
            // Return mock data for development
            return mockAccounts.find(acc => acc.id === id);
        }
    },

    // Create new account
    createAccount: async (accountData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.ACCOUNTS.CREATE, accountData);
            return response.data;
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    },

    // Update account
    updateAccount: async (id, accountData) => {
        try {
            const response = await apiClient.put(`${API_ENDPOINTS.ACCOUNTS.UPDATE}/${id}`, accountData);
            return response.data;
        } catch (error) {
            console.error('Error updating account:', error);
            throw error;
        }
    },

    // Delete account
    deleteAccount: async (id) => {
        try {
            const response = await apiClient.delete(`${API_ENDPOINTS.ACCOUNTS.DELETE}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting account:', error);
            throw error;
        }
    },

    // Get accounts by role (filter from all accounts)
    getAccountsByRole: async (role) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ACCOUNTS.GET_ALL);
            const accounts = response.data;
            return accounts.filter(acc => acc.role === role);
        } catch (error) {
            console.error('Error fetching accounts by role:', error);
            // Return mock data for development
            return mockAccounts.filter(acc => acc.role === role);
        }
    },

    // Change account status (update account with new status)
    changeAccountStatus: async (id, status) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.ACCOUNTS.UPDATE(id), {
                isActive: status === 'Active'
            });
            return response.data;
        } catch (error) {
            console.error('Error changing account status:', error);
            throw error;
        }
    },

    // Reset password (not implemented in backend yet)
    resetPassword: async (id) => {
        try {
            // This endpoint doesn't exist in backend yet
            throw new Error('Reset password feature not implemented yet');
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    },

    // Get account permissions (not implemented in backend yet)
    getAccountPermissions: async (id) => {
        try {
            // This endpoint doesn't exist in backend yet
            // Return mock data for development
            return {
                canManageUsers: true,
                canManageStores: true,
                canViewReports: true,
                canManageDesigns: true,
                canManageOrders: true
            };
        } catch (error) {
            console.error('Error fetching account permissions:', error);
            // Return mock data for development
            return {
                canManageUsers: true,
                canManageStores: true,
                canViewReports: true,
                canManageDesigns: true,
                canManageOrders: true
            };
        }
    }
};
