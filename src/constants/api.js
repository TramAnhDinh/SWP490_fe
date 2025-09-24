export const API_BASE_URL = 'https://decalxesequences-production.up.railway.app/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
    REFRESH: '/Auth/refresh',
    LOGOUT: '/Auth/logout',
    RESET_PASSWORD: '/Auth/reset-password',
    CHANGE_PASSWORD: '/Auth/change-password',
    RESET_PASSWORD_BY_USERNAME: '/Auth/reset-password-by-username',
  },

  // Employees
  EMPLOYEES: {
    BASE: '/Employees',
    BY_ID: (id) => `/Employees/${id}`,
    WITH_ACCOUNT: '/Employees/with-account',
    PERFORMANCE: (id) => `/Employees/${id}/performance`,
  },

  // Accounts
  ACCOUNTS: {
    BASE: '/Accounts',
    BY_ID: (id) => `/Accounts/${id}`,
    GET_ALL: '/Accounts',
    GET_BY_ID: (id) => `/Accounts/${id}`,
    CREATE: '/Accounts',
    UPDATE: (id) => `/Accounts/${id}`,
    DELETE: (id) => `/Accounts/${id}`,
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
    UNASSIGN_EMPLOYEE: (orderId) => `/Orders/${orderId}/assign`,
    ASSIGNED_EMPLOYEE: (orderId) => `/Orders/${orderId}/assigned-employee`,
    UPDATE_STATUS: (id) => `/Orders/${id}/status`,
    SALES_STATISTICS: '/Orders/statistics/sales',
    // New endpoints for customer integration
    WITH_CUSTOMER: '/Orders/with-customer',
    SEARCH_CUSTOMERS: '/Orders/search-customers',
    CREATE_CUSTOMER: '/Orders/customers',
    // Additional endpoints
    ASSIGN: (id) => `/Orders/${id}/assign`,
    TIMELINE: (id) => `/Orders/${id}/timeline`,
    NOTES: (id) => `/Orders/${id}/notes`,
    FILES: (id) => `/Orders/${id}/files`,
    STATS: '/Orders/stats',
    EXPORT: '/Orders/export',
  },

  // Order Details
  ORDER_DETAILS: {
    BASE: '/OrderDetails',
    BY_ID: (id) => `/OrderDetails/${id}`,
  },

  // Order Stage Histories
  ORDER_STAGE_HISTORIES: {
    BASE: '/OrderStageHistories',
    BY_ID: (id) => `/OrderStageHistories/${id}`,
    BY_ORDER: (orderId) => `/OrderStageHistories/by-order/${orderId}`,
    BY_STAGE: (stage) => `/OrderStageHistories/by-stage/${stage}`,
    LATEST_BY_ORDER: (orderId) => `/OrderStageHistories/latest-by-order/${orderId}`,
  },

  // Order Stages
  ORDER_STAGES: {
    BASE: '/OrderStages',
    BY_ID: (id) => `/OrderStages/${id}`,
  },

  // Vehicle Parts
  VEHICLE_PARTS: {
    BASE: '/VehicleParts',
    BY_ID: (id) => `/VehicleParts/${id}`,
  },

  // Vehicle Model Decal Types
  VEHICLE_MODEL_DECAL_TYPES: {
    BASE: '/VehicleModelDecalTypes',
    BY_ID: (id) => `/VehicleModelDecalTypes/${id}`,
  },

  // Vehicle Model Decal Templates
  VEHICLE_MODEL_DECAL_TEMPLATES: {
    BASE: '/VehicleModelDecalTemplates',
    BY_ID: (id) => `/VehicleModelDecalTemplates/${id}`,
  },

  // Designs
  DESIGNS: {
    BASE: '/Designs',
    BY_ID: (id) => `/Designs/${id}`,
    APPROVE: (id) => `/Designs/${id}/approve`,
    REJECT: (id) => `/Designs/${id}/reject`,
    COMMENTS: (id) => `/Designs/${id}/comments`,
    VERSIONS: (id) => `/Designs/${id}/versions`,
    DOWNLOAD: (id) => `/Designs/${id}/download`,
    ANALYTICS: '/Designs/analytics',
  },

  // Design Comments
  DESIGN_COMMENTS: {
    BASE: '/DesignComments',
    BY_ID: (id) => `/DesignComments/${id}`,
  },

  // Design Work Orders
  DESIGN_WORK_ORDERS: {
    BASE: '/DesignWorkOrders',
    BY_ID: (id) => `/DesignWorkOrders/${id}`,
  },

  // Design Template Items
  DESIGN_TEMPLATE_ITEMS: {
    BASE: '/DesignTemplateItems',
    BY_ID: (id) => `/DesignTemplateItems/${id}`,
  },

  // Vehicle Models
  VEHICLE_MODELS: {
    BASE: '/VehicleModels',
    BY_ID: (id) => `/VehicleModels/${id}`,
    DECAL_TYPES: (modelId) => `/VehicleModels/${modelId}/decaltypes`,
    DECAL_TYPE: (modelId, decalTypeId) => `/VehicleModels/${modelId}/decaltypes/${decalTypeId}`,
    TEMPLATES: (modelId) => `/VehicleModels/${modelId}/templates`,
  },

  // Vehicle Brands
  VEHICLE_BRANDS: {
    BASE: '/VehicleBrands',
    BY_ID: (id) => `/VehicleBrands/${id}`,
  },

  // Vehicle Parts
  VEHICLE_PARTS: {
    BASE: '/VehicleParts',
    BY_ID: (id) => `/VehicleParts/${id}`,
  },


  // Vehicle Model Decal Types
  VEHICLE_MODEL_DECAL_TYPES: {
    BASE: '/VehicleModelDecalTypes',
    BY_ID: (id) => `/VehicleModelDecalTypes/${id}`,
  },

  // Vehicle Model Decal Templates
  VEHICLE_MODEL_DECAL_TEMPLATES: {
    BASE: '/VehicleModelDecalTemplates',
    BY_ID: (id) => `/VehicleModelDecalTemplates/${id}`,
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

  // Tech Labor Prices
  TECH_LABOR_PRICES: {
    BASE: '/TechLaborPrices',
    BY_ID: (serviceId, vehicleModelId) => `/TechLaborPrices/${serviceId}/${vehicleModelId}`,
  },

  // Deposits
  DEPOSITS: {
    BASE: '/Deposits',
    BY_ID: (id) => `/Deposits/${id}`,
    BY_ORDER: (orderId) => `/Deposits/order/${orderId}`,
  },

  // Payments
  PAYMENTS: {
    BASE: '/Payments',
    BY_ID: (id) => `/Payments/${id}`,
    PROCESSING: '/Payments/processing',
    INVOICES: '/Payments/invoices',
    REPORTS: '/Payments/reports',
    DEPOSITS: '/Payments/deposits',
  },

  // Warranties
  WARRANTIES: {
    BASE: '/Warranties',
    BY_ID: (id) => `/Warranties/${id}`,
    MANAGEMENT: '/Warranties/management',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/Notifications',
    BY_ID: (id) => `/Notifications/${id}`,
    CREATE: '/Notifications/create',
    CENTER: '/Notifications/center',
    MESSAGES: '/Notifications/messages',
  },

  // Installations
  INSTALLATIONS: {
    BASE: '/Installations',
    QUEUE: '/Installations/queue',
    TRACKING: '/Installations/tracking',
    QUALITY: '/Installations/quality',
  },

  // Support
  SUPPORT: {
    BASE: '/Support',
    TICKETS: '/Support/tickets',
  },

  // Settings
  SETTINGS: {
    BASE: '/Settings',
    SYSTEM: '/Settings/system',
    PROFILE: '/Settings/profile',
  },

  // Performance
  PERFORMANCE: {
    BASE: '/Performance',
    TRACKING: '/Performance/tracking',
  },

  // Promotions
  PROMOTIONS: {
    BASE: '/Promotions',
    BY_ID: (id) => `/Promotions/${id}`,
  },

  // Scheduled Work Units
  SCHEDULED_WORK_UNITS: {
    BASE: '/ScheduledWorkUnits',
    BY_ID: (id) => `/ScheduledWorkUnits/${id}`,
  },

  // Feedbacks
  FEEDBACKS: {
    BASE: '/Feedbacks',
    BY_ID: (id) => `/Feedbacks/${id}`,
  },

  // Analytics
  ANALYTICS: {
    BASE: '/Analytics',
    SALES: '/Analytics/sales',
    PERFORMANCE: '/Analytics/performance',
    CUSTOMERS: '/Analytics/customers',
    OPERATIONS: '/Analytics/operations',
  },

  // Reports
  REPORTS: {
    BASE: '/Reports',
    SALES: '/Reports/sales',
    PERFORMANCE: '/Reports/performance',
    CUSTOMERS: '/Reports/customers',
    OPERATIONS: '/Reports/operations',
  },

  // Services
  SERVICES: {
    BASE: '/DecalServices',
    BY_ID: (id) => `/DecalServices/${id}`,
  },

  // Decal Services
  DECAL_SERVICES: {
    BASE: '/DecalServices',
    BY_ID: (id) => `/DecalServices/${id}`,
  },

  // Inventory
  INVENTORY: {
    BASE: '/Inventory',
    TRACKING: '/Inventory/tracking',
  },

  // Stores
  STORES: {
    BASE: '/Stores',
    BY_ID: (id) => `/Stores/${id}`,
    GET_ALL: '/Stores',
    GET_BY_ID: (id) => `/Stores/${id}`,
    CREATE: '/Stores',
    UPDATE: (id) => `/Stores/${id}`,
    DELETE: (id) => `/Stores/${id}`,
  },

  // Roles
  ROLES: {
    BASE: '/Roles',
    BY_ID: (id) => `/Roles/${id}`,
    PERMISSIONS: (id) => `/Roles/${id}/permissions`,
  },

  // Decal Types
  DECAL_TYPES: {
    BASE: '/DecalTypes',
    BY_ID: (id) => `/DecalTypes/${id}`,
    CREATE: '/DecalTypes',
    UPDATE: (id) => `/DecalTypes/${id}`,
    DELETE: (id) => `/DecalTypes/${id}`,
  },

  // Decal Templates
  DECAL_TEMPLATES: {
    BASE: '/DecalTemplates',
    BY_ID: (id) => `/DecalTemplates/${id}`,
    CREATE: '/DecalTemplates',
    UPDATE: (id) => `/DecalTemplates/${id}`,
    DELETE: (id) => `/DecalTemplates/${id}`,
    ASSIGN_VEHICLE: (templateId, modelId) => `/DecalTemplates/${templateId}/vehicles/${modelId}`,
    UNASSIGN_VEHICLE: (templateId, modelId) => `/DecalTemplates/${templateId}/vehicles/${modelId}`,
  },

  // Decal Services
  DECAL_SERVICES: {
    BASE: '/DecalServices',
    BY_ID: (id) => `/DecalServices/${id}`,
    CREATE: '/DecalServices',
    UPDATE: (id) => `/DecalServices/${id}`,
    DELETE: (id) => `/DecalServices/${id}`,
    STATISTICS: '/DecalServices/statistics',
    DUPLICATE: (id) => `/DecalServices/${id}/duplicate`,
    EXPORT: '/DecalServices/export',
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