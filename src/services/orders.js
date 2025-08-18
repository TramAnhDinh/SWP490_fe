import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const orderService = {
  // Get all orders with pagination and filtering
  getOrders: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BASE, { params });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.BASE, orderData);
    return response.data;
  },

  // Create order with customer information
  createOrderWithCustomer: async (orderData) => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS.WITH_CUSTOMER, orderData);
    return response.data;
  },

  // Update order
  updateOrder: async (id, orderData) => {
    const response = await apiClient.put(API_ENDPOINTS.ORDERS.BY_ID(id), orderData);
    return response.data;
  },

  // Delete order
  deleteOrder: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    console.log('Updating order status:', { id, status, url: API_ENDPOINTS.ORDERS.UPDATE_STATUS(id) });
    const response = await apiClient.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), status);
    return response.data;
  },

  // Assign employee to order
  assignEmployee: async (orderId, employeeId) => {
    const response = await apiClient.put(API_ENDPOINTS.ORDERS.ASSIGN_EMPLOYEE(orderId, employeeId));
    return response.data;
  },

  // Unassign employee from order
  unassignEmployee: async (orderId) => {
    const response = await apiClient.put(API_ENDPOINTS.ORDERS.UNASSIGN_EMPLOYEE(orderId));
    return response.data;
  },

  // Get assigned employee for order
  getAssignedEmployee: async (orderId) => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.ASSIGNED_EMPLOYEE(orderId));
    return response.data;
  },

  // Get sales statistics
  getSalesStatistics: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.SALES_STATISTICS, { params });
    return response.data;
  },

  // Get order create form data
  getOrderCreateFormData: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.CREATE_FORM_DATA);
    return response.data;
  },

  // Track order
  trackOrder: async (orderId, customerPhone, licensePlate) => {
    const params = {};
    if (orderId) params.orderId = orderId;
    if (customerPhone) params.customerPhone = customerPhone;
    if (licensePlate) params.licensePlate = licensePlate;
    
    const response = await apiClient.get(API_ENDPOINTS.ORDERS.TRACKING, { params });
    return response.data;
  },

  // TODO: Remove mock data when API is fully implemented
};