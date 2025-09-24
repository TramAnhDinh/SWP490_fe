import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const employeeService = {
  // Get all employees with optional filters
  getEmployees: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.role) queryParams.append('role', params.role);
      if (params.status) queryParams.append('status', params.status);
      if (params.storeId) queryParams.append('storeId', params.storeId);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);

      const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BASE}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES.BASE, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.EMPLOYEES.BY_ID(id), employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Get employee with account details
  getEmployeeWithAccount: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.WITH_ACCOUNT);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee with account:', error);
      return null;
    }
  },

  // Get employee performance
  getEmployeePerformance: async (employeeId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.period) queryParams.append('period', params.period);

      const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BY_ID(employeeId)}/performance?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee performance:', error);
      // Return mock data for development
      return {
        completedOrders: 15,
        customerRating: 4.9,
        efficiency: 92,
        averageOrderTime: 3.8,
        totalRevenue: 45000000
      };
    }
  },

  // Get employees by role
  getEmployeesByRole: async (role) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BASE}?role=${role}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees by role:', error);
      return [];
    }
  },

  // Get employees by store
  getEmployeesByStore: async (storeId) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BASE}?storeId=${storeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees by store:', error);
      return [];
    }
  }
};