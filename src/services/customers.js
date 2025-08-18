import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const customerService = {
  // Get all customers
  getCustomers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BASE, { params });
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    const response = await apiClient.post(API_ENDPOINTS.CUSTOMERS.BASE, customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    return response.data;
  },

  // Get customer vehicles by customer ID
  getCustomerVehiclesByCustomerId: async (customerId) => {
    const response = await apiClient.get(`/CustomerVehicles/by-customer/${customerId}`);
    return response.data;
  },

  // TODO: Remove mock data when API is fully implemented
};