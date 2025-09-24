import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const customerService = {
  // Get all customers with optional filters
  getCustomers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.storeId) queryParams.append('storeId', params.storeId);
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);

      const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMERS.BASE}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CUSTOMERS.BASE, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  // Search customers by phone or email
  searchCustomers: async (searchTerm) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.SEARCH_CUSTOMERS}?searchTerm=${searchTerm}`);
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  },

  // Create customer with account
  createCustomerWithAccount: async (customerData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE_CUSTOMER, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer with account:', error);
      throw error;
    }
  }
};