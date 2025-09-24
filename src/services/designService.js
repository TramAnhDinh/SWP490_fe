import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

// No mock data - using real API only

export const designService = {
  // Get all designs
  getDesigns: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DESIGNS.GET_ALL, { params });
    return response.data;
  },

  // Get design by ID
  getDesignById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DESIGNS.GET_BY_ID}/${id}`);
    return response.data;
  },

  // Create new design
  createDesign: async (designData) => {
    const response = await apiClient.post(API_ENDPOINTS.DESIGNS.CREATE, designData);
    return response.data;
  },

  // Update design
  updateDesign: async (id, designData) => {
    const response = await apiClient.put(`${API_ENDPOINTS.DESIGNS.UPDATE}/${id}`, designData);
    return response.data;
  },

  // Delete design
  deleteDesign: async (id) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.DESIGNS.DELETE}/${id}`);
    return response.data;
  },

  // Get designs by designer
  getDesignsByDesigner: async (designerId, params = {}) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DESIGNS.GET_BY_DESIGNER}/${designerId}`, { params });
    return response.data;
  },

  // Get designs by status
  getDesignsByStatus: async (status, params = {}) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DESIGNS.GET_BY_STATUS}/${status}`, { params });
    return response.data;
  },

  // Get pending design requests
  getPendingDesignRequests: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DESIGNS.GET_PENDING_REQUESTS, { params });
    return response.data;
  },

  // Get designs ready for installation
  getDesignsReadyForInstallation: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DESIGNS.GET_READY_FOR_INSTALLATION, { params });
    return response.data;
  },

  // Update design status
  updateDesignStatus: async (id, status) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.DESIGNS.UPDATE_STATUS}/${id}`, { status });
    return response.data;
  },

  // Submit design for approval
  submitForApproval: async (id, designData) => {
    const response = await apiClient.post(`${API_ENDPOINTS.DESIGNS.SUBMIT_FOR_APPROVAL}/${id}`, designData);
    return response.data;
  },

  // Approve design
  approveDesign: async (id, approvalData) => {
    const response = await apiClient.post(`${API_ENDPOINTS.DESIGNS.APPROVE}/${id}`, approvalData);
    return response.data;
  },

  // Reject design
  rejectDesign: async (id, rejectionData) => {
    const response = await apiClient.post(`${API_ENDPOINTS.DESIGNS.REJECT}/${id}`, rejectionData);
    return response.data;
  },

  // Get design analytics
  getDesignAnalytics: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DESIGNS.GET_ANALYTICS, { params });
    return response.data;
  },

  // Get design templates
  getDesignTemplates: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DECAL_TEMPLATES.BASE, { params });
    return response.data;
  },

  // Create design from template
  createFromTemplate: async (templateId, designData) => {
    const response = await apiClient.post(`${API_ENDPOINTS.DESIGNS.CREATE_FROM_TEMPLATE}/${templateId}`, designData);
    return response.data;
  },

  // Transfer design to installation
  transferToInstallation: async (id, transferData) => {
    const response = await apiClient.post(`${API_ENDPOINTS.DESIGNS.TRANSFER_TO_INSTALLATION}/${id}`, transferData);
    return response.data;
  },

  // Get design comments
  getDesignComments: async (designId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DESIGN_COMMENTS.GET_BY_DESIGN}/${designId}`);
    return response.data;
  },

  // Add design comment
  addDesignComment: async (designId, commentData) => {
    const response = await apiClient.post(`${API_ENDPOINTS.DESIGN_COMMENTS.CREATE}`, {
      designId,
      ...commentData
    });
    return response.data;
  },

  // Get design work orders
  getDesignWorkOrders: async (designId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.DESIGN_WORK_ORDERS.GET_BY_DESIGN}/${designId}`);
    return response.data;
  }
};