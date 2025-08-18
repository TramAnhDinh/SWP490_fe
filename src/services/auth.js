import apiClient from './apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api';
import { ROLE_PERMISSIONS, checkPermission, getAvailableModules, getAvailableActions } from '../constants/permissions';

export const authService = {
  // Login
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const { accessToken, refreshToken, user } = response.data;

    // Store tokens and user data
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  // Reset password
  resetPassword: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  // Get current user from storage
  getCurrentUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!userData || userData === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || user?.accountRoleName || null;
  },

  // Check if user has permission for a specific role
  hasPermission: (requiredRole) => {
    const userRole = authService.getUserRole();
    if (!userRole) return false;

    // Use ROLE_PERMISSIONS instead of hardcoded hierarchy
    // Check if user role exists in permissions
    if (!ROLE_PERMISSIONS[userRole]) return false;

    // For now, use a simple hierarchy based on role names
    // Admin > Manager > Sales/Designer/Technician > Customer
    const roleHierarchy = {
      'Admin': 6,
      'Manager': 5,
      'Sales': 4,
      'Designer': 4,
      'Technician': 4,
      'Customer': 1,
    };

    const userLevel = roleHierarchy[userRole];
    const requiredLevel = roleHierarchy[requiredRole];

    return userLevel >= requiredLevel;
  },

  // Check if user has specific permission
  hasSpecificPermission: (permission) => {
    const userRole = authService.getUserRole();
    if (!userRole) return false;

    // Check if user role exists in permissions
    if (!ROLE_PERMISSIONS[userRole]) return false;

    // Check if user has the specific permission in their permissions array
    return ROLE_PERMISSIONS[userRole].permissions.includes(permission);
  },

  // Check module permission
  hasModulePermission: (module, action) => {
    const userRole = authService.getUserRole();
    if (!userRole) return false;

    return checkPermission(userRole, module, action);
  },

  // Get available modules for current user
  getAvailableModules: () => {
    const userRole = authService.getUserRole();
    if (!userRole) return [];

    return getAvailableModules(userRole);
  },

  // Get available actions for current user and module
  getAvailableActions: (module) => {
    const userRole = authService.getUserRole();
    if (!userRole) return [];

    return getAvailableActions(userRole, module);
  },
};