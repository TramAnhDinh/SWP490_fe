import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const customerVehicleService = {
    // Get all vehicles
    getAllVehicles: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BASE, { params });
        return response.data;
    },

    // Get vehicle by ID
    getVehicleById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id));
        return response.data;
    },

    // Get vehicle by license plate
    getVehicleByLicensePlate: async (licensePlate) => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_LICENSE_PLATE(licensePlate));
        return response.data;
    },

    // Get vehicles by customer ID
    getVehiclesByCustomerId: async (customerId) => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_CUSTOMER(customerId));
        return response.data;
    },

    // Create new vehicle
    createVehicle: async (vehicleData) => {
        const response = await apiClient.post(API_ENDPOINTS.CUSTOMER_VEHICLES.BASE, vehicleData);
        return response.data;
    },

    // Update vehicle
    updateVehicle: async (id, vehicleData) => {
        const response = await apiClient.put(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id), vehicleData);
        return response.data;
    },

    // Delete vehicle
    deleteVehicle: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.CUSTOMER_VEHICLES.BY_ID(id));
        return response.data;
    },

    // Check if vehicle exists
    checkVehicleExists: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.EXISTS(id));
        return response.data;
    },

    // Check if license plate exists
    checkLicensePlateExists: async (licensePlate) => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.LICENSE_PLATE_EXISTS(licensePlate));
        return response.data;
    },

    // Check if chassis number exists
    checkChassisExists: async (chassisNumber) => {
        const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_VEHICLES.CHASSIS_EXISTS(chassisNumber));
        return response.data;
    },
};
