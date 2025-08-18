import apiClient from "./apiClient";

// Payment & Financial Module Service
export const paymentService = {
  // Payment Processing
  async getPayments() {
    const response = await apiClient.get("/Payments");
    return response.data;
  },

  async getPaymentById(id) {
    const response = await apiClient.get(`/Payments/${id}`);
    return response.data;
  },

  async createPayment(paymentData) {
    const response = await apiClient.post("/Payments", paymentData);
    return response.data;
  },

  async updatePayment(id, paymentData) {
    const response = await apiClient.put(`/Payments/${id}`, paymentData);
    return response.data;
  },

  async deletePayment(id) {
    const response = await apiClient.delete(`/Payments/${id}`);
    return response.data;
  },

  // Invoice Management (using Orders API)
  async getInvoices() {
    const response = await apiClient.get("/Orders");
    return response.data;
  },

  async getInvoiceById(id) {
    const response = await apiClient.get(`/Orders/${id}`);
    return response.data;
  },

  async generateInvoice(orderId) {
    const response = await apiClient.post(`/Orders/${orderId}/invoice`);
    return response.data;
  },

  // Financial Reports
  async getFinancialReports(params = {}) {
    // Temporarily return mock data due to backend API not available
    console.log('getFinancialReports called with params:', params);
    return [
      {
        month: 'Tháng 1',
        revenue: 15000000,
        expenses: 8000000,
        profit: 7000000,
        orders: 45,
        payments: 42
      },
      {
        month: 'Tháng 2',
        revenue: 18000000,
        expenses: 9000000,
        profit: 9000000,
        orders: 52,
        payments: 48
      },
      {
        month: 'Tháng 3',
        revenue: 22000000,
        expenses: 11000000,
        profit: 11000000,
        orders: 65,
        payments: 62
      },
      {
        month: 'Tháng 4',
        revenue: 19000000,
        expenses: 9500000,
        profit: 9500000,
        orders: 58,
        payments: 55
      },
      {
        month: 'Tháng 5',
        revenue: 25000000,
        expenses: 12000000,
        profit: 13000000,
        orders: 72,
        payments: 68
      },
      {
        month: 'Tháng 6',
        revenue: 28000000,
        expenses: 14000000,
        profit: 14000000,
        orders: 85,
        payments: 82
      }
    ];
  },

  async getRevenueAnalytics(period = "monthly") {
    // Temporarily return mock data due to backend API not available
    console.log('getRevenueAnalytics called with period:', period);
    return {
      totalRevenue: 127000000,
      totalExpenses: 63500000,
      totalProfit: 63500000,
      averageOrderValue: 249019,
      paymentSuccessRate: 96.5,
      growthRate: 15.2
    };
  },

  // Deposit Management 
  async getDeposits() {
    const response = await apiClient.get("/Deposits");
    return response.data;
  },

  async getDepositById(id) {
    const response = await apiClient.get(`/Deposits/${id}`);
    return response.data;
  },

  async createDeposit(depositData) {
    const response = await apiClient.post("/Deposits", depositData);
    return response.data;
  },

  async updateDeposit(id, depositData) {
    const response = await apiClient.put(`/Deposits/${id}`, depositData);
    return response.data;
  },

  async deleteDeposit(id) {
    const response = await apiClient.delete(`/Deposits/${id}`);
    return response.data;
  },
};

export default paymentService;
