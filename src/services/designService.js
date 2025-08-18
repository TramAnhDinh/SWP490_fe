import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const designService = {
  // Get all designs with optional filters
  getDesigns: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.designerId) queryParams.append('designerId', params.designerId);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await apiClient.get(`${API_ENDPOINTS.DESIGNS.BASE}?${queryParams}`);
    return response.data;
  },

  // Get design by ID
  getDesignById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.DESIGNS.BY_ID(id));
    return response.data;
  },

  // Create new design
  createDesign: async (designData) => {
    const response = await apiClient.post(API_ENDPOINTS.DESIGNS.BASE, designData);
    return response.data;
  },

  // Create design without file (for testing)
  createDesignWithoutFile: async (designData) => {
    const payload = {
      designName: designData.designName || 'Thiết kế mới',
      description: designData.description || '',
      category: designData.category || 'General',
      tags: designData.tags || '',
      price: designData.price || 0,
      designURL: designData.designURL || 'https://via.placeholder.com/300x200/0066cc/ffffff?text=Design'
    };

    const response = await apiClient.post(API_ENDPOINTS.DESIGNS.BASE, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Test function with minimal payload
  testCreateDesign: async () => {
    const minimalPayload = {
      designName: 'Test Design',
      description: 'Test description',
      category: 'Test',
      price: 0,
      designURL: 'https://via.placeholder.com/300x200/0066cc/ffffff?text=Test+Design',
      isActive: true
    };

    console.log('Testing with minimal payload:', minimalPayload);
    
    const response = await apiClient.post(API_ENDPOINTS.DESIGNS.BASE, minimalPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Test function with only required fields
  testCreateDesignSimple: async () => {
    const simplePayload = {
      designName: 'Simple Test Design',
      description: 'Simple test',
      designURL: 'https://via.placeholder.com/300x200/ff6600/ffffff?text=Simple+Design'
    };

    console.log('Testing with simple payload:', simplePayload);
    
    const response = await apiClient.post(API_ENDPOINTS.DESIGNS.BASE, simplePayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // Upload design with URL
  uploadDesign: async ({ designURL, designName, description, category, tags, price }) => {
    try {
      // Prepare JSON payload with DesignURL field
      const payload = {
        // Basic design info
        designName: designName || 'Thiết kế mới',
        description: description || '',
        category: category || 'General',
        tags: tags || '',
        price: price || 0,
        
        // DesignURL field - API expects this
        designURL: designURL,
        
        // Additional metadata
        isActive: true
      };

      console.log('Uploading design with URL...', {
        designName: payload.designName,
        designURL: payload.designURL
      });

      console.log('Full payload structure:', payload);

      const response = await apiClient.post(API_ENDPOINTS.DESIGNS.BASE, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in uploadDesign:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      throw error;
    }
  },

  // Update design
  updateDesign: async (id, data) => {
    const response = await apiClient.put(API_ENDPOINTS.DESIGNS.BY_ID(id), data);
    return response.data;
  },

  // Delete design
  deleteDesign: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.DESIGNS.BY_ID(id));
    return response.data;
  },

  // Approve design
  approveDesign: async (id, approvalData) => {
    const response = await apiClient.patch(`/designs/${id}/approve`, approvalData);
    return response.data;
  },

  // Reject design
  rejectDesign: async (id, rejectionData) => {
    const response = await apiClient.patch(`/designs/${id}/reject`, rejectionData);
    return response.data;
  },

  // Get design comments
  getDesignComments: async (designId) => {
    const response = await apiClient.get(`/designs/${designId}/comments`);
    return response.data;
  },

  // Add comment to design
  addComment: async (designId, comment) => {
    const response = await apiClient.post(`/designs/${designId}/comments`, comment);
    return response.data;
  },

  // Update comment
  updateComment: async (designId, commentId, comment) => {
    const response = await apiClient.put(`/designs/${designId}/comments/${commentId}`, comment);
    return response.data;
  },

  // Delete comment
  deleteComment: async (designId, commentId) => {
    const response = await apiClient.delete(`/designs/${designId}/comments/${commentId}`);
    return response.data;
  },

  // Get design versions
  getDesignVersions: async (designId) => {
    const response = await apiClient.get(`/designs/${designId}/versions`);
    return response.data;
  },

  // Create new version
  createVersion: async (designId, versionData) => {
    const response = await apiClient.post(`/designs/${designId}/versions`, versionData);
    return response.data;
  },

  // Get design templates
  getTemplates: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.vehicleModel) queryParams.append('vehicleModel', params.vehicleModel);

    const response = await apiClient.get(`/design-templates?${queryParams}`);
    return response.data;
  },

  // Get template by ID
  getTemplateById: async (id) => {
    const response = await apiClient.get(`/design-templates/${id}`);
    return response.data;
  },

  // Create template
  createTemplate: async (templateData) => {
    const response = await apiClient.post('/design-templates', templateData);
    return response.data;
  },

  // Update template
  updateTemplate: async (id, templateData) => {
    const response = await apiClient.put(`/design-templates/${id}`, templateData);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (id) => {
    const response = await apiClient.delete(`/design-templates/${id}`);
    return response.data;
  },

  // Download design
  downloadDesign: async (id) => {
    const response = await apiClient.get(`/designs/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get design analytics
  getDesignAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.designerId) queryParams.append('designerId', params.designerId);

    const response = await apiClient.get(`/designs/analytics?${queryParams}`);
    return response.data;
  },
};