import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { toast } from "react-hot-toast";

// Service functions
const vehicleService = {
  // Get all customer vehicles
  getCustomerVehicles: async (params = {}) => {
    const response = await apiClient.get("/CustomerVehicles", { params });
    return response.data;
  },

  // Get customer vehicle by ID
  getCustomerVehicleById: async (id) => {
    const response = await apiClient.get(`/CustomerVehicles/${id}`);
    return response.data;
  },

  // Search vehicles by term (license plate, chassis number, etc.)
  searchVehicles: async (searchTerm) => {
    const response = await apiClient.get("/CustomerVehicles", {
      params: {
        searchTerm,
        pageSize: 50, // Limit results for search
      },
    });
    return response.data;
  },

  // Create new customer vehicle
  createCustomerVehicle: async (vehicleData) => {
    const response = await apiClient.post("/CustomerVehicles", vehicleData);
    return response.data;
  },

  // Get vehicle models
  getVehicleModels: async () => {
    const response = await apiClient.get("/VehicleModels");
    return response.data;
  },

  // Get vehicle brands
  getVehicleBrands: async () => {
    const response = await apiClient.get("/VehicleBrands");
    return response.data;
  },
};

// Hooks
export const useCustomerVehicles = (params = {}) => {
  return useQuery({
    queryKey: ["customerVehicles", params],
    queryFn: () => vehicleService.getCustomerVehicles(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      // Transform data for easier use in components
      return Array.isArray(data) ? data : data?.items || [];
    },
  });
};

export const useCustomerVehicle = (id) => {
  return useQuery({
    queryKey: ["customerVehicles", id],
    queryFn: () => vehicleService.getCustomerVehicleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useVehicleSearch = (searchTerm) => {
  return useQuery({
    queryKey: ["customerVehicles", "search", searchTerm],
    queryFn: () => vehicleService.searchVehicles(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2, // Only search when term is at least 2 characters
    staleTime: 1000 * 30, // 30 seconds for search results
    select: (data) => {
      // Transform data for easier use in components
      return Array.isArray(data) ? data : data?.items || [];
    },
  });
};

export const useVehicleModels = () => {
  return useQuery({
    queryKey: ["vehicleModels"],
    queryFn: vehicleService.getVehicleModels,
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (data) => {
      return Array.isArray(data) ? data : data?.items || [];
    },
  });
};

export const useVehicleBrands = () => {
  return useQuery({
    queryKey: ["vehicleBrands"],
    queryFn: vehicleService.getVehicleBrands,
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (data) => {
      return Array.isArray(data) ? data : data?.items || [];
    },
  });
};

export const useCreateCustomerVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vehicleService.createCustomerVehicle,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["customerVehicles"]);
      toast.success("Tạo phương tiện thành công!");
      return data;
    },
    onError: (error) => {
      console.error("Error creating vehicle:", error);
      toast.error(error.response?.data?.message || "Tạo phương tiện thất bại");
    },
  });
};
