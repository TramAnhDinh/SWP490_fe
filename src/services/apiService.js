import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, HTTP_STATUS, STORAGE_KEYS } from '../constants/api';

// Tạo axios instance với cấu hình chung
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Thêm token nếu có
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    async (error) => {
        console.error('❌ Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data,
        });

        // Handle token refresh
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
                try {
                    const refreshResponse = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
                        refreshToken,
                    });

                    const newToken = refreshResponse.data.accessToken;
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);

                    // Retry original request
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(error.config);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

// API Service Class
class ApiService {
    // ==================== AUTHENTICATION ====================
    auth = {
        login: (credentials) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
        register: (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
        refresh: (refreshToken) => apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),
        logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
        resetPassword: (data) => apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
    };

    // ==================== EMPLOYEES ====================
    employees = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.EMPLOYEES.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id)),
        create: (employeeData) => apiClient.post(API_ENDPOINTS.EMPLOYEES.BASE, employeeData),
        update: (id, employeeData) => apiClient.put(API_ENDPOINTS.EMPLOYEES.BY_ID(id), employeeData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id)),
        getWithAccount: () => apiClient.get(API_ENDPOINTS.EMPLOYEES.WITH_ACCOUNT),
        updateStatus: (id, isActive) => apiClient.patch(API_ENDPOINTS.EMPLOYEES.BY_ID(id), { isActive }),
    };

    // ==================== ACCOUNTS ====================
    accounts = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.ACCOUNTS.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.ACCOUNTS.BY_ID(id)),
        create: (accountData) => apiClient.post(API_ENDPOINTS.ACCOUNTS.BASE, accountData),
        update: (id, accountData) => apiClient.put(API_ENDPOINTS.ACCOUNTS.BY_ID(id), accountData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.ACCOUNTS.BY_ID(id)),
    };

    // ==================== CUSTOMERS ====================
    customers = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.CUSTOMERS.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(id)),
        create: (customerData) => apiClient.post(API_ENDPOINTS.CUSTOMERS.BASE, customerData),
        update: (id, customerData) => apiClient.put(API_ENDPOINTS.CUSTOMERS.BY_ID(id), customerData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.CUSTOMERS.BY_ID(id)),
        search: (searchTerm) => apiClient.get(API_ENDPOINTS.ORDERS.SEARCH_CUSTOMERS, {
            params: { searchTerm }
        }),
    };

    // ==================== ORDERS ====================
    orders = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.ORDERS.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.ORDERS.BY_ID(id)),
        create: (orderData) => apiClient.post(API_ENDPOINTS.ORDERS.BASE, orderData),
        update: (id, orderData) => apiClient.put(API_ENDPOINTS.ORDERS.BY_ID(id), orderData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.ORDERS.BY_ID(id)),
        createWithCustomer: (orderData) => apiClient.post(API_ENDPOINTS.ORDERS.WITH_CUSTOMER, orderData),
        createCustomer: (customerData) => apiClient.post(API_ENDPOINTS.ORDERS.CREATE_CUSTOMER, customerData),
        assignEmployee: (orderId, employeeId) => apiClient.post(API_ENDPOINTS.ORDERS.ASSIGN_EMPLOYEE(orderId, employeeId)),
        unassignEmployee: (orderId) => apiClient.post(API_ENDPOINTS.ORDERS.UNASSIGN_EMPLOYEE(orderId)),
        getAssignedEmployee: (orderId) => apiClient.get(API_ENDPOINTS.ORDERS.ASSIGNED_EMPLOYEE(orderId)),
        updateStatus: (id, status) => apiClient.patch(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status }),
        getSalesStatistics: (params = {}) => apiClient.get(API_ENDPOINTS.ORDERS.SALES_STATISTICS, { params }),
        getTracking: (orderId) => apiClient.get(API_ENDPOINTS.ORDERS.TRACKING, { params: { orderId } }),
    };

    // ==================== CUSTOMER VEHICLES ====================
    customerVehicles = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id)),
        create: (vehicleData) => apiClient.post(API_ENDPOINTS.CUSTOMER_VEHICLES.BASE, vehicleData),
        update: (id, vehicleData) => apiClient.put(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id), vehicleData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id)),
        getByLicensePlate: (licensePlate) => apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_LICENSE_PLATE(licensePlate)),
        getByCustomer: (customerId) => apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_CUSTOMER(customerId)),
        checkExists: (id) => apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.EXISTS(id)),
        checkLicensePlateExists: (licensePlate) => apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.LICENSE_PLATE_EXISTS(licensePlate)),
        checkChassisExists: (chassisNumber) => apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.CHASSIS_EXISTS(chassisNumber)),
    };

    // ==================== DESIGNS ====================
    designs = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.DESIGNS.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.DESIGNS.BY_ID(id)),
        create: (designData) => apiClient.post(API_ENDPOINTS.DESIGNS.BASE, designData),
        update: (id, designData) => apiClient.put(API_ENDPOINTS.DESIGNS.BY_ID(id), designData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.DESIGNS.BY_ID(id)),
    };

    // ==================== PAYMENTS ====================
    payments = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.PAYMENTS.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.PAYMENTS.BY_ID(id)),
        create: (paymentData) => apiClient.post(API_ENDPOINTS.PAYMENTS.BASE, paymentData),
        update: (id, paymentData) => apiClient.put(API_ENDPOINTS.PAYMENTS.BY_ID(id), paymentData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.PAYMENTS.BY_ID(id)),
    };

    // ==================== WARRANTIES ====================
    warranties = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.WARRANTIES.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.WARRANTIES.BY_ID(id)),
        create: (warrantyData) => apiClient.post(API_ENDPOINTS.WARRANTIES.BASE, warrantyData),
        update: (id, warrantyData) => apiClient.put(API_ENDPOINTS.WARRANTIES.BY_ID(id), warrantyData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.WARRANTIES.BY_ID(id)),
    };

    // ==================== STORES ====================
    stores = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.STORES.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.STORES.BY_ID(id)),
        create: (storeData) => apiClient.post(API_ENDPOINTS.STORES.BASE, storeData),
        update: (id, storeData) => apiClient.put(API_ENDPOINTS.STORES.BY_ID(id), storeData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.STORES.BY_ID(id)),
    };

    // ==================== ROLES ====================
    roles = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.ROLES.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.ROLES.BY_ID(id)),
        create: (roleData) => apiClient.post(API_ENDPOINTS.ROLES.BASE, roleData),
        update: (id, roleData) => apiClient.put(API_ENDPOINTS.ROLES.BY_ID(id), roleData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.ROLES.BY_ID(id)),
    };

    // ==================== VEHICLE BRANDS ====================
    vehicleBrands = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.VEHICLE_BRANDS.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id)),
        create: (brandData) => apiClient.post(API_ENDPOINTS.VEHICLE_BRANDS.BASE, brandData),
        update: (id, brandData) => apiClient.put(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id), brandData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id)),
    };

    // ==================== VEHICLE MODELS ====================
    vehicleModels = {
        getAll: (params = {}) => apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.BASE, { params }),
        getById: (id) => apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id)),
        create: (modelData) => apiClient.post(API_ENDPOINTS.VEHICLE_MODELS.BASE, modelData),
        update: (id, modelData) => apiClient.put(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id), modelData),
        delete: (id) => apiClient.delete(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id)),
        getDecalTypes: (modelId) => apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPES(modelId)),
        getDecalType: (modelId, decalTypeId) => apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPE(modelId, decalTypeId)),
        getTemplates: (modelId) => apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.TEMPLATES(modelId)),
    };

    // ==================== DECAL SERVICES ====================
    decalServices = {
        getAll: (params = {}) => apiClient.get('/DecalServices', { params }),
        getById: (id) => apiClient.get(`/DecalServices/${id}`),
        create: (serviceData) => apiClient.post('/DecalServices', serviceData),
        update: (id, serviceData) => apiClient.put(`/DecalServices/${id}`, serviceData),
        delete: (id) => apiClient.delete(`/DecalServices/${id}`),
    };

    // ==================== DECAL TEMPLATES ====================
    decalTemplates = {
        getAll: (params = {}) => apiClient.get('/DecalTemplates', { params }),
        getById: (id) => apiClient.get(`/DecalTemplates/${id}`),
        create: (templateData) => apiClient.post('/DecalTemplates', templateData),
        update: (id, templateData) => apiClient.put(`/DecalTemplates/${id}`, templateData),
        delete: (id) => apiClient.delete(`/DecalTemplates/${id}`),
    };

    // ==================== DECAL TYPES ====================
    decalTypes = {
        getAll: (params = {}) => apiClient.get('/DecalTypes', { params }),
        getById: (id) => apiClient.get(`/DecalTypes/${id}`),
        create: (typeData) => apiClient.post('/DecalTypes', typeData),
        update: (id, typeData) => apiClient.put(`/DecalTypes/${id}`, typeData),
        delete: (id) => apiClient.delete(`/DecalTypes/${id}`),
    };

    // ==================== DEPOSITS ====================
    deposits = {
        getAll: (params = {}) => apiClient.get('/Deposits', { params }),
        getById: (id) => apiClient.get(`/Deposits/${id}`),
        create: (depositData) => apiClient.post('/Deposits', depositData),
        update: (id, depositData) => apiClient.put(`/Deposits/${id}`, depositData),
        delete: (id) => apiClient.delete(`/Deposits/${id}`),
    };

    // ==================== DESIGN COMMENTS ====================
    designComments = {
        getAll: (params = {}) => apiClient.get('/DesignComments', { params }),
        getById: (id) => apiClient.get(`/DesignComments/${id}`),
        create: (commentData) => apiClient.post('/DesignComments', commentData),
        update: (id, commentData) => apiClient.put(`/DesignComments/${id}`, commentData),
        delete: (id) => apiClient.delete(`/DesignComments/${id}`),
    };

    // ==================== DESIGN TEMPLATE ITEMS ====================
    designTemplateItems = {
        getAll: (params = {}) => apiClient.get('/DesignTemplateItems', { params }),
        getById: (id) => apiClient.get(`/DesignTemplateItems/${id}`),
        create: (itemData) => apiClient.post('/DesignTemplateItems', itemData),
        update: (id, itemData) => apiClient.put(`/DesignTemplateItems/${id}`, itemData),
        delete: (id) => apiClient.delete(`/DesignTemplateItems/${id}`),
    };

    // ==================== DESIGN WORK ORDERS ====================
    designWorkOrders = {
        getAll: (params = {}) => apiClient.get('/DesignWorkOrders', { params }),
        getById: (id) => apiClient.get(`/DesignWorkOrders/${id}`),
        create: (workOrderData) => apiClient.post('/DesignWorkOrders', workOrderData),
        update: (id, workOrderData) => apiClient.put(`/DesignWorkOrders/${id}`, workOrderData),
        delete: (id) => apiClient.delete(`/DesignWorkOrders/${id}`),
    };

    // ==================== FEEDBACKS ====================
    feedbacks = {
        getAll: (params = {}) => apiClient.get('/Feedbacks', { params }),
        getById: (id) => apiClient.get(`/Feedbacks/${id}`),
        create: (feedbackData) => apiClient.post('/Feedbacks', feedbackData),
        update: (id, feedbackData) => apiClient.put(`/Feedbacks/${id}`, feedbackData),
        delete: (id) => apiClient.delete(`/Feedbacks/${id}`),
    };

    // ==================== ORDER DETAILS ====================
    orderDetails = {
        getAll: (params = {}) => apiClient.get('/OrderDetails', { params }),
        getById: (id) => apiClient.get(`/OrderDetails/${id}`),
        create: (orderDetailData) => apiClient.post('/OrderDetails', orderDetailData),
        update: (id, orderDetailData) => apiClient.put(`/OrderDetails/${id}`, orderDetailData),
        delete: (id) => apiClient.delete(`/OrderDetails/${id}`),
    };

    // ==================== ORDER STAGE HISTORIES ====================
    orderStageHistories = {
        getAll: (params = {}) => apiClient.get('/OrderStageHistories', { params }),
        getById: (id) => apiClient.get(`/OrderStageHistories/${id}`),
        create: (historyData) => apiClient.post('/OrderStageHistories', historyData),
        update: (id, historyData) => apiClient.put(`/OrderStageHistories/${id}`, historyData),
        delete: (id) => apiClient.delete(`/OrderStageHistories/${id}`),
    };

    // ==================== TECH LABOR PRICES ====================
    techLaborPrices = {
        getAll: (params = {}) => apiClient.get('/TechLaborPrices', { params }),
        getById: (id) => apiClient.get(`/TechLaborPrices/${id}`),
        create: (priceData) => apiClient.post('/TechLaborPrices', priceData),
        update: (id, priceData) => apiClient.put(`/TechLaborPrices/${id}`, priceData),
        delete: (id) => apiClient.delete(`/TechLaborPrices/${id}`),
    };

    // ==================== UTILITY METHODS ====================
    testConnection: () => apiClient.get('/swagger/v1/swagger.json'),

    // Helper method để lấy base URL
    getBaseURL: () => API_BASE_URL,

    // Helper method để tạo full URL
    getFullURL: (endpoint) => `${API_BASE_URL}${endpoint}`,
}

// Export singleton instance
export default new ApiService();

// Export individual modules for specific imports
export const authAPI = new ApiService().auth;
export const employeesAPI = new ApiService().employees;
export const accountsAPI = new ApiService().accounts;
export const customersAPI = new ApiService().customers;
export const ordersAPI = new ApiService().orders;
export const customerVehiclesAPI = new ApiService().customerVehicles;
export const designsAPI = new ApiService().designs;
export const paymentsAPI = new ApiService().payments;
export const warrantiesAPI = new ApiService().warranties;
export const storesAPI = new ApiService().stores;
export const rolesAPI = new ApiService().roles;
export const vehicleBrandsAPI = new ApiService().vehicleBrands;
export const vehicleModelsAPI = new ApiService().vehicleModels;
export const decalServicesAPI = new ApiService().decalServices;
export const decalTemplatesAPI = new ApiService().decalTemplates;
export const decalTypesAPI = new ApiService().decalTypes;
export const depositsAPI = new ApiService().deposits;
export const designCommentsAPI = new ApiService().designComments;
export const designTemplateItemsAPI = new ApiService().designTemplateItems;
export const designWorkOrdersAPI = new ApiService().designWorkOrders;
export const feedbacksAPI = new ApiService().feedbacks;
export const orderDetailsAPI = new ApiService().orderDetails;
export const orderStageHistoriesAPI = new ApiService().orderStageHistories;
export const techLaborPricesAPI = new ApiService().techLaborPrices;
