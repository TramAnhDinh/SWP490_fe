import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const vehicleService = {
    // Get all vehicle brands
    getVehicleBrands: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (params.search) queryParams.append('search', params.search);
            if (params.status) queryParams.append('status', params.status);

            const response = await apiClient.get(`${API_ENDPOINTS.VEHICLE_BRANDS.BASE}?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle brands:', error);
            return [];
        }
    },

    // Get vehicle brand by ID
    getVehicleBrandById: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle brand:', error);
            return null;
        }
    },

    // Create new vehicle brand
    createVehicleBrand: async (brandData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.VEHICLE_BRANDS.BASE, brandData);
            return response.data;
        } catch (error) {
            console.error('Error creating vehicle brand:', error);
            throw error;
        }
    },

    // Update vehicle brand
    updateVehicleBrand: async (id, brandData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id), brandData);
            return response.data;
        } catch (error) {
            console.error('Error updating vehicle brand:', error);
            throw error;
        }
    },

    // Delete vehicle brand
    deleteVehicleBrand: async (id) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.VEHICLE_BRANDS.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting vehicle brand:', error);
            throw error;
        }
    },

    // Get all vehicle models
    getVehicleModels: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (params.search) queryParams.append('search', params.search);
            if (params.brandId) queryParams.append('brandId', params.brandId);
            if (params.vehicleType) queryParams.append('vehicleType', params.vehicleType);

            const response = await apiClient.get(`${API_ENDPOINTS.VEHICLE_MODELS.BASE}?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle models:', error);
            return [];
        }
    },

    // Get vehicle model by ID
    getVehicleModelById: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle model:', error);
            return null;
        }
    },

    // Create new vehicle model
    createVehicleModel: async (modelData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.VEHICLE_MODELS.BASE, modelData);
            return response.data;
        } catch (error) {
            console.error('Error creating vehicle model:', error);
            throw error;
        }
    },

    // Update vehicle model
    updateVehicleModel: async (id, modelData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id), modelData);
            return response.data;
        } catch (error) {
            console.error('Error updating vehicle model:', error);
            throw error;
        }
    },

    // Delete vehicle model
    deleteVehicleModel: async (id) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.VEHICLE_MODELS.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting vehicle model:', error);
            throw error;
        }
    },

    // Get compatible decal types for vehicle model
    getCompatibleDecalTypes: async (modelId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPES(modelId));
            return response.data;
        } catch (error) {
            console.error('Error fetching compatible decal types:', error);
            return [];
        }
    },

    // Assign decal type to vehicle model
    assignDecalTypeToVehicle: async (modelId, decalTypeId, assignmentData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPE(modelId, decalTypeId), assignmentData);
            return response.data;
        } catch (error) {
            console.error('Error assigning decal type to vehicle:', error);
            throw error;
        }
    },

    // Unassign decal type from vehicle model
    unassignDecalTypeFromVehicle: async (modelId, decalTypeId) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.VEHICLE_MODELS.DECAL_TYPE(modelId, decalTypeId));
            return response.data;
        } catch (error) {
            console.error('Error unassigning decal type from vehicle:', error);
            throw error;
        }
    },

    // Get customer vehicles
    getCustomerVehicles: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();

            if (params.search) queryParams.append('search', params.search);
            if (params.customerId) queryParams.append('customerId', params.customerId);
            if (params.licensePlate) queryParams.append('licensePlate', params.licensePlate);

            const response = await apiClient.get(`${API_ENDPOINTS.CUSTOMER_VEHICLES.BASE}?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching customer vehicles:', error);
            return [];
        }
    },

    // Get customer vehicle by ID
    getCustomerVehicleById: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error fetching customer vehicle:', error);
            return null;
        }
    },

    // Get customer vehicle by license plate
    getCustomerVehicleByLicensePlate: async (licensePlate) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_LICENSE_PLATE(licensePlate));
            return response.data;
        } catch (error) {
            console.error('Error fetching customer vehicle by license plate:', error);
            return null;
        }
    },

    // Get customer vehicles by customer ID
    getCustomerVehiclesByCustomer: async (customerId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_CUSTOMER(customerId));
            return response.data;
        } catch (error) {
            console.error('Error fetching customer vehicles by customer:', error);
            return [];
        }
    },

    // Create new customer vehicle
    createCustomerVehicle: async (vehicleData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.CUSTOMER_VEHICLES.BASE, vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error creating customer vehicle:', error);
            throw error;
        }
    },

    // Update customer vehicle
    updateCustomerVehicle: async (id, vehicleData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id), vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error updating customer vehicle:', error);
            throw error;
        }
    },

    // Delete customer vehicle
    deleteCustomerVehicle: async (id) => {
        try {
            const response = await apiClient.delete(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting customer vehicle:', error);
            throw error;
        }
    }
};
