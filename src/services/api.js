import axios from "axios";

// Cấu hình base URL - thay đổi theo môi trường
const BASE_URL = "https://decalxeapi-production.up.railway.app/";
// const BASE_URL = 'http://localhost:5000'; // Uncomment for local development

// Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Thêm token nếu có
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Test endpoint
  testConnection: () => api.get("/swagger/v1/swagger.json"),

  // Auth
  login: (credentials) => api.post("/api/auth/login", credentials),
  resetPassword: (data) =>
    api.post("/api/auth/reset-password-by-username", data),

  // Accounts
  getAccounts: () => api.get("/api/accounts"),
  getAccount: (id) => api.get(`/api/accounts/${id}`),
  createAccount: (data) => api.post("/api/accounts", data),

  // Customers
  getCustomers: () => api.get("/api/customers"),
  getCustomer: (id) => api.get(`/api/customers/${id}`),
  createCustomer: (data) => api.post("/api/customers", data),

  // Customer Vehicles
  getCustomerVehicles: () => api.get("/api/customervehicles"),
  getCustomerVehicle: (id) => api.get(`/api/customervehicles/${id}`),

  // Decal Services
  getDecalServices: () => api.get("/api/decalservices"),
  getDecalService: (id) => api.get(`/api/decalservices/${id}`),

  // Decal Templates
  getDecalTemplates: () => api.get("/api/decaltemplates"),
  getDecalTemplate: (id) => api.get(`/api/decaltemplates/${id}`),

  // Decal Types
  getDecalTypes: () => api.get("/api/decaltypes"),
  getDecalType: (id) => api.get(`/api/decaltypes/${id}`),

  // Deposits
  getDeposits: () => api.get("/api/deposits"),
  getDeposit: (id) => api.get(`/api/deposits/${id}`),

  // Design Comments
  getDesignComments: () => api.get("/api/designcomments"),
  getDesignComment: (id) => api.get(`/api/designcomments/${id}`),

  // Designs
  getDesigns: () => api.get("/api/designs"),
  getDesign: (id) => api.get(`/api/designs/${id}`),

  // Design Template Items
  getDesignTemplateItems: () => api.get("/api/designtemplateitems"),
  getDesignTemplateItem: (id) => api.get(`/api/designtemplateitems/${id}`),

  // Design Work Orders
  getDesignWorkOrders: () => api.get("/api/designworkorders"),
  getDesignWorkOrder: (id) => api.get(`/api/designworkorders/${id}`),

  // Employees
  getEmployees: () => api.get("/api/employees"),
  getEmployee: (id) => api.get(`/api/employees/${id}`),

  // Feedbacks
  getFeedbacks: () => api.get("/api/feedbacks"),
  getFeedback: (id) => api.get(`/api/feedbacks/${id}`),

  // Order Details
  getOrderDetails: () => api.get("/api/orderdetails"),
  getOrderDetail: (id) => api.get(`/api/orderdetails/${id}`),

  // Orders
  getOrders: () => api.get("/api/orders"),
  getOrder: (id) => api.get(`/api/orders/${id}`),

  // Order Stage Histories
  getOrderStageHistories: () => api.get("/api/orderstagehistories"),
  getOrderStageHistory: (id) => api.get(`/api/orderstagehistories/${id}`),

  // Payments
  getPayments: () => api.get("/api/payments"),
  getPayment: (id) => api.get(`/api/payments/${id}`),

  // Roles
  getRoles: () => api.get("/api/roles"),
  getRole: (id) => api.get(`/api/roles/${id}`),

  // Stores
  getStores: () => api.get("/api/stores"),
  getStore: (id) => api.get(`/api/stores/${id}`),

  // Tech Labor Prices
  getTechLaborPrices: () => api.get("/api/techlaborprices"),
  getTechLaborPrice: (id) => api.get(`/api/techlaborprices/${id}`),

  // Vehicle Brands
  getVehicleBrands: () => api.get("/api/vehiclebrands"),
  getVehicleBrand: (id) => api.get(`/api/vehiclebrands/${id}`),

  // Vehicle Models
  getVehicleModels: () => api.get("/api/vehiclemodels"),
  getVehicleModel: (id) => api.get(`/api/vehiclemodels/${id}`),

  // Warranties
  getWarranties: () => api.get("/api/warranties"),
  getWarranty: (id) => api.get(`/api/warranties/${id}`),
};

export default api;
