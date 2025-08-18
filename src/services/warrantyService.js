import apiClient from "./apiClient";

// Warranty & Support Module Service
export const warrantyService = {
  // Warranty Management
  async getWarranties() {
    const response = await apiClient.get("/Warranties");
    return response.data;
  },

  async getWarrantyById(id) {
    const response = await apiClient.get(`/Warranties/${id}`);
    return response.data;
  },

  async createWarranty(warrantyData) {
    const response = await apiClient.post("/Warranties", warrantyData);
    return response.data;
  },

  async updateWarranty(id, warrantyData) {
    const response = await apiClient.put(`/Warranties/${id}`, warrantyData);
    return response.data;
  },

  async deleteWarranty(id) {
    const response = await apiClient.delete(`/Warranties/${id}`);
    return response.data;
  },

  async getWarrantiesByVehicle(vehicleId) {
    const response = await apiClient.get(`/Warranties/by-vehicle/${vehicleId}`);
    return response.data;
  },

  async getWarrantiesByStatus(status) {
    const response = await apiClient.get(`/Warranties/by-status/${status}`);
    return response.data;
  },

  // Feedback System
  async getFeedbacks() {
    const response = await apiClient.get("/Feedbacks");
    return response.data;
  },

  async getFeedbackById(id) {
    const response = await apiClient.get(`/Feedbacks/${id}`);
    return response.data;
  },

  async createFeedback(feedbackData) {
    const response = await apiClient.post("/Feedbacks", feedbackData);
    return response.data;
  },

  async updateFeedback(id, feedbackData) {
    const response = await apiClient.put(`/Feedbacks/${id}`, feedbackData);
    return response.data;
  },

  async deleteFeedback(id) {
    const response = await apiClient.delete(`/Feedbacks/${id}`);
    return response.data;
  },

  async getFeedbacksByOrder(orderId) {
    const response = await apiClient.get(`/Feedbacks/by-order/${orderId}`);
    return response.data;
  },

  async getFeedbacksByCustomer(customerId) {
    const response = await apiClient.get(
      `/Feedbacks/by-customer/${customerId}`
    );
    return response.data;
  },

  // Support Ticket Management (using existing feedback system)
  async getSupportTickets() {
    const response = await apiClient.get("/Feedbacks/support-tickets");
    return response.data;
  },

  async getSupportTicketById(id) {
    const response = await apiClient.get(`/Feedbacks/support-tickets/${id}`);
    return response.data;
  },

  async createSupportTicket(ticketData) {
    const response = await apiClient.post(
      "/Feedbacks/support-tickets",
      ticketData
    );
    return response.data;
  },

  async updateSupportTicket(id, ticketData) {
    const response = await apiClient.put(
      `/Feedbacks/support-tickets/${id}`,
      ticketData
    );
    return response.data;
  },

  async closeSupportTicket(id) {
    const response = await apiClient.put(
      `/Feedbacks/support-tickets/${id}/close`
    );
    return response.data;
  },

  // Quality Assurance
  async getQualityReports() {
    const response = await apiClient.get("/Feedbacks/quality-reports");
    return response.data;
  },

  async getCustomerSatisfactionStats() {
    const response = await apiClient.get("/Feedbacks/satisfaction-stats");
    return response.data;
  },
};

export default warrantyService;
