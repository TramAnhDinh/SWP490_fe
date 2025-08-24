export const API_BASE_URL = 'https://decalxesequences-production.up.railway.app/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    REFRESH: '/Auth/refresh',
    LOGOUT: '/Auth/logout',
    RESET_PASSWORD: '/Auth/reset-password',
  },

  // Employees
  EMPLOYEES: {
    BASE: '/Employees',
    BY_ID: (id) => `/Employees/${id}`,
    WITH_ACCOUNT: '/Employees/with-account',
  },

  // Accounts
  ACCOUNTS: {
    BASE: '/Accounts',
    BY_ID: (id) => `/Accounts/${id}`
  },

  // Customers
  CUSTOMERS: {
    BASE: '/Customers',
    BY_ID: (id) => `/Customers/${id}`,
  },

  // Orders
  ORDERS: {
    BASE: '/Orders',
    BY_ID: (id) => `/Orders/${id}`,
    CREATE_FORM_DATA: '/Orders/create',
    TRACKING: '/Orders/tracking',
    ASSIGN_EMPLOYEE: (orderId, employeeId) => `/Orders/${orderId}/assign/${employeeId}`,
    UNASSIGN_EMPLOYEE: (orderId) => `/Orders/${orderId}/unassign`,
    ASSIGNED_EMPLOYEE: (orderId) => `/Orders/${orderId}/assigned-employee`,
    UPDATE_STATUS: (id) => `/Orders/${id}/status`,
    SALES_STATISTICS: '/Orders/sales-statistics',
    // New endpoints for customer integration
    WITH_CUSTOMER: '/Orders/with-customer',
    SEARCH_CUSTOMERS: '/Orders/search-customers',
    CREATE_CUSTOMER: '/Orders/customers',
  },

  // Customer Vehicles
  CUSTOMER_VEHICLES: {
    BASE: '/CustomerVehicles',
    BY_ID: (id) => `/CustomerVehicles/${id}`,
    BY_LICENSE_PLATE: (licensePlate) => `/CustomerVehicles/by-license-plate/${licensePlate}`,
    BY_CUSTOMER: (customerId) => `/CustomerVehicles/by-customer/${customerId}`,
    EXISTS: (id) => `/CustomerVehicles/${id}/exists`,
    LICENSE_PLATE_EXISTS: (licensePlate) => `/CustomerVehicles/license-plate/${licensePlate}/exists`,
    CHASSIS_EXISTS: (chassisNumber) => `/CustomerVehicles/chassis/${chassisNumber}/exists`,
  },

  // Designs
  DESIGNS: {
    BASE: '/Designs',
    BY_ID: (id) => `/Designs/${id}`,
  },

  // Payments
  PAYMENTS: {
    BASE: '/Payments',
    BY_ID: (id) => `/Payments/${id}`,
  },

  // Warranties
  WARRANTIES: {
    BASE: '/Warranties',
    BY_ID: (id) => `/Warranties/${id}`,
  },

  // Stores
  STORES: {
    BASE: '/Stores',
    BY_ID: (id) => `/Stores/${id}`,
  },

  // Roles
  ROLES: {
    BASE: '/Roles',
    BY_ID: (id) => `/Roles/${id}`,
  },

  // Vehicle Brands
  VEHICLE_BRANDS: {
    BASE: '/VehicleBrands',
    BY_ID: (id) => `/VehicleBrands/${id}`,
  },

  // Vehicle Models
  VEHICLE_MODELS: {
    BASE: '/VehicleModels',
    BY_ID: (id) => `/VehicleModels/${id}`,
    DECAL_TYPES: (modelId) => `/VehicleModels/${modelId}/decaltypes`,
    DECAL_TYPE: (modelId, decalTypeId) => `/VehicleModels/${modelId}/decaltypes/${decalTypeId}`,
    TEMPLATES: (modelId) => `/VehicleModels/${modelId}/templates`,
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
};