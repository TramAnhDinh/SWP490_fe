import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const notificationService = {
  // Lấy danh sách thông báo
  getNotifications: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.isRead !== undefined) queryParams.append('isRead', params.isRead);
    if (params.type) queryParams.append('type', params.type);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get(`/Notifications?${queryParams}`);
    return response.data;
  },

  // Lấy thông báo theo ID
  getNotificationById: async (id) => {
    const response = await apiClient.get(`/Notifications/${id}`);
    return response.data;
  },

  // Tạo thông báo mới
  createNotification: async (notificationData) => {
    const response = await apiClient.post('/Notifications', {
      Title: notificationData.title,
      Message: notificationData.message,
      Type: notificationData.type,
      Priority: notificationData.priority,
      RecipientID: notificationData.recipientId,
      RecipientType: notificationData.recipientType,
      RelatedEntityID: notificationData.relatedEntityId,
      RelatedEntityType: notificationData.relatedEntityType,
      ScheduledAt: notificationData.scheduledAt,
      ExpiresAt: notificationData.expiresAt
    });
    return response.data;
  },

  // Cập nhật thông báo
  updateNotification: async (id, notificationData) => {
    const response = await apiClient.put(`/Notifications/${id}`, {
      Title: notificationData.title,
      Message: notificationData.message,
      Type: notificationData.type,
      Priority: notificationData.priority,
      IsRead: notificationData.isRead,
      ScheduledAt: notificationData.scheduledAt,
      ExpiresAt: notificationData.expiresAt
    });
    return response.data;
  },

  // Xóa thông báo
  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/Notifications/${id}`);
    return response.data;
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (id) => {
    const response = await apiClient.put(`/Notifications/${id}/read`);
    return response.data;
  },

  // Đánh dấu nhiều thông báo đã đọc
  markMultipleAsRead: async (ids) => {
    const response = await apiClient.put('/Notifications/mark-read', {
      NotificationIDs: ids
    });
    return response.data;
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async () => {
    const response = await apiClient.put('/Notifications/mark-all-read');
    return response.data;
  },

  // Lấy thống kê thông báo
  getNotificationStats: async () => {
    const response = await apiClient.get('/Notifications/stats');
    return response.data;
  },

  // Gửi thông báo cho nhiều người dùng
  sendBulkNotification: async (bulkData) => {
    const response = await apiClient.post('/Notifications/bulk', {
      Title: bulkData.title,
      Message: bulkData.message,
      Type: bulkData.type,
      Priority: bulkData.priority,
      RecipientIDs: bulkData.recipientIds,
      RecipientType: bulkData.recipientType,
      ScheduledAt: bulkData.scheduledAt
    });
    return response.data;
  },

  // Lấy thông báo chưa đọc
  getUnreadNotifications: async () => {
    const response = await apiClient.get('/Notifications/unread');
    return response.data;
  },

  // Lấy thông báo theo người dùng
  getUserNotifications: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);
    if (params.isRead !== undefined) queryParams.append('isRead', params.isRead);
    if (params.type) queryParams.append('type', params.type);

    const response = await apiClient.get(`/Notifications/user/${userId}?${queryParams}`);
    return response.data;
  },

  // Tạo thông báo cho đơn hàng
  createOrderNotification: async (orderId, type, message) => {
    return notificationService.createNotification({
      title: `Thông báo đơn hàng #${orderId}`,
      message: message,
      type: type,
      priority: 'medium',
      relatedEntityId: orderId,
      relatedEntityType: 'Order'
    });
  },

  // Tạo thông báo cho lắp đặt
  createInstallationNotification: async (installationId, type, message) => {
    return notificationService.createNotification({
      title: `Thông báo lắp đặt #${installationId}`,
      message: message,
      type: type,
      priority: 'high',
      relatedEntityId: installationId,
      relatedEntityType: 'Installation'
    });
  },

  // Tạo thông báo cho thiết kế
  createDesignNotification: async (designId, type, message) => {
    return notificationService.createNotification({
      title: `Thông báo thiết kế #${designId}`,
      message: message,
      type: type,
      priority: 'medium',
      relatedEntityId: designId,
      relatedEntityType: 'Design'
    });
  },

  // Tạo thông báo cho khách hàng
  createCustomerNotification: async (customerId, type, message) => {
    return notificationService.createNotification({
      title: 'Thông báo từ DecalXe',
      message: message,
      type: type,
      priority: 'low',
      relatedEntityId: customerId,
      relatedEntityType: 'Customer'
    });
  },

  // Xuất thông báo
  exportNotifications: async (format = 'excel', params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.type) queryParams.append('type', params.type);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.isRead !== undefined) queryParams.append('isRead', params.isRead);

    const response = await apiClient.get(`/Notifications/export/${format}?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
