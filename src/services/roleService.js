import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Mock roles data for development
const mockRoles = [
    {
        id: 1,
        name: 'Admin',
        description: 'Quản trị viên hệ thống - Toàn quyền truy cập',
        permissions: [
            'manage_users', 'manage_roles', 'manage_stores', 'manage_employees',
            'view_reports', 'manage_system', 'manage_orders', 'manage_designs'
        ],
        isSystem: true,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 2,
        name: 'Store Manager',
        description: 'Quản lý cửa hàng - Quản lý nhân viên và hoạt động cửa hàng',
        permissions: [
            'manage_employees', 'view_reports', 'manage_orders', 'manage_designs',
            'view_customers', 'manage_inventory'
        ],
        isSystem: false,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 3,
        name: 'Designer',
        description: 'Thiết kế viên - Tạo và quản lý thiết kế decal',
        permissions: [
            'manage_designs', 'view_orders', 'view_customers', 'upload_templates'
        ],
        isSystem: false,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 4,
        name: 'Sales Staff',
        description: 'Nhân viên bán hàng - Tạo đơn hàng và chăm sóc khách hàng',
        permissions: [
            'create_orders', 'view_orders', 'manage_customers', 'view_products'
        ],
        isSystem: false,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 5,
        name: 'Installation Tech',
        description: 'Kỹ thuật viên lắp đặt - Thực hiện lắp đặt decal',
        permissions: [
            'view_orders', 'update_order_status', 'view_installations', 'upload_photos'
        ],
        isSystem: false,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: 6,
        name: 'Customer',
        description: 'Khách hàng - Xem và quản lý đơn hàng của mình',
        permissions: [
            'view_own_orders', 'create_orders', 'view_products', 'manage_profile'
        ],
        isSystem: false,
        createdAt: '2024-01-01T00:00:00Z'
    }
];

export const roleService = {
    // Get all roles
    getRoles: async (params = {}) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ROLES.BASE, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            // Return mock data for development
            return mockRoles;
        }
    },

    // Get role by ID
    getRoleById: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ROLES.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching role:', error);
            // Return mock data for development
            return mockRoles.find(role => role.id === id);
        }
    },

    // Get role permissions
    getRolePermissions: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.ROLES.PERMISSIONS(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            // Return mock data for development
            const role = mockRoles.find(role => role.id === id);
            return role ? role.permissions : [];
        }
    },

    // Create new role
    createRole: async (roleData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.ROLES.BASE, roleData);
            return response.data;
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    },

    // Update role
    updateRole: async (id, roleData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.ROLES.BY_ID(id), roleData);
            return response.data;
        } catch (error) {
            console.error('Error updating role:', error);
            throw error;
        }
    },

    // Delete role
    deleteRole: async (id) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.ROLES.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting role:', error);
            throw error;
        }
    },
};
