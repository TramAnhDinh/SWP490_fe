import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

// Mock data for development
const mockSalesAnalytics = {
  totalRevenue: 125000000,
  totalOrders: 45,
  averageOrderValue: 2777778,
  topServices: [
    { name: 'Bọc toàn bộ xe', revenue: 45000000, orders: 15 },
    { name: 'Decal xe máy', revenue: 35000000, orders: 20 },
    { name: 'Phim cách nhiệt', revenue: 25000000, orders: 10 }
  ],
  dailyRevenue: [12000000, 15000000, 18000000, 14000000, 16000000, 20000000, 17000000],
  monthlyRevenue: [120000000, 135000000, 150000000, 125000000, 140000000, 155000000]
};

const mockSystemPerformance = {
  totalStores: 12,
  totalEmployees: 156,
  totalCustomers: 2847,
  totalOrders: 1245,
  systemUptime: 99.8,
  averageResponseTime: 245,
  totalRevenue: 2850000000,
  activeUsers: 89
};

const mockStorePerformance = {
  totalRevenue: 125000000,
  totalOrders: 45,
  completedOrders: 38,
  pendingOrders: 7,
  averageOrderValue: 2777778,
  customerSatisfaction: 4.6,
  employeePerformance: 4.8
};

export const analyticsService = {
  // Get sales analytics
  getSalesAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.SALES, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      // Return mock data for development
      return mockSalesAnalytics;
    }
  },

  // Get system performance analytics
  getSystemPerformance: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.SYSTEM_PERFORMANCE, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching system performance:', error);
      // Return mock data for development
      return mockSystemPerformance;
    }
  },

  // Get store performance analytics
  getStorePerformance: async (storeId, params = {}) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ANALYTICS.STORE_PERFORMANCE}/${storeId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching store performance:', error);
      // Return mock data for development
      return mockStorePerformance;
    }
  },

  // Get employee performance analytics
  getEmployeePerformance: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.EMPLOYEE_PERFORMANCE, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee performance:', error);
      // Return mock data for development
      return {
        topPerformers: [
          { name: 'Nguyễn Văn A', role: 'Designer', performance: 4.8, completedTasks: 25 },
          { name: 'Trần Thị B', role: 'Sales Staff', performance: 4.7, completedTasks: 30 },
          { name: 'Lê Văn C', role: 'Installation Tech', performance: 4.6, completedTasks: 20 }
        ],
        averagePerformance: 4.5,
        totalEmployees: 156
      };
    }
  },

  // Get design analytics
  getDesignAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.DESIGN, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching design analytics:', error);
      // Return mock data for development
      return {
        totalDesigns: 28,
        completedDesigns: 22,
        pendingDesigns: 4,
        inProgressDesigns: 2,
        averageRating: 4.7,
        totalRequests: 35,
        approvedRequests: 28,
        pendingApprovals: 7
      };
    }
  },

  // Get customer analytics
  getCustomerAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.CUSTOMER, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      // Return mock data for development
      return {
        totalCustomers: 2847,
        newCustomers: 156,
        returningCustomers: 2691,
        averageSatisfaction: 4.6,
        topCustomerTypes: [
          { type: 'Cá nhân', count: 1890, percentage: 66.4 },
          { type: 'Doanh nghiệp', count: 957, percentage: 33.6 }
        ]
      };
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.REVENUE, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      // Return mock data for development
      return {
        totalRevenue: 2850000000,
        monthlyRevenue: [120000000, 135000000, 150000000, 125000000, 140000000, 155000000],
        revenueByService: [
          { service: 'Bọc toàn bộ xe', revenue: 850000000, percentage: 29.8 },
          { service: 'Decal xe máy', revenue: 650000000, percentage: 22.8 },
          { service: 'Phim cách nhiệt', revenue: 450000000, percentage: 15.8 },
          { service: 'Khác', revenue: 900000000, percentage: 31.6 }
        ]
      };
    }
  },

  // Get order analytics
  getOrderAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.ORDER, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      // Return mock data for development
      return {
        totalOrders: 1245,
        completedOrders: 1180,
        pendingOrders: 45,
        cancelledOrders: 20,
        averageOrderValue: 2289157,
        ordersByStatus: [
          { status: 'Completed', count: 1180, percentage: 94.8 },
          { status: 'Pending', count: 45, percentage: 3.6 },
          { status: 'Cancelled', count: 20, percentage: 1.6 }
        ]
      };
    }
  },

  // Get performance comparison
  getPerformanceComparison: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.PERFORMANCE_COMPARISON, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching performance comparison:', error);
      // Return mock data for development
      return {
        currentPeriod: {
          revenue: 125000000,
          orders: 45,
          customers: 156
        },
        previousPeriod: {
          revenue: 115000000,
          orders: 42,
          customers: 148
        },
        growth: {
          revenue: 8.7,
          orders: 7.1,
          customers: 5.4
        }
      };
    }
  }
};
