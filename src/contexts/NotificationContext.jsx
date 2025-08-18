import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    // Simple state without complex dependencies
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isPolling, setIsPolling] = useState(false);

    // All notification functions are temporarily disabled
    const markAsRead = useCallback(async (notificationId) => {
        console.log('Mark as read disabled - backend endpoint not available');
    }, []);

    const markMultipleAsRead = useCallback(async (notificationIds) => {
        console.log('Mark multiple as read disabled - backend endpoint not available');
    }, []);

    const markAllAsRead = useCallback(async () => {
        console.log('Mark all as read disabled - backend endpoint not available');
        toast.success('Tính năng tạm thời không khả dụng');
    }, []);

    const deleteNotification = useCallback(async (notificationId) => {
        console.log('Delete notification disabled - backend endpoint not available');
        toast.success('Tính năng tạm thời không khả dụng');
    }, []);

    const createNotification = useCallback(async (notificationData) => {
        console.log('Create notification disabled - backend endpoint not available');
        return Promise.resolve({ id: 'mock-id' });
    }, []);

    const sendBulkNotification = useCallback(async (bulkData) => {
        console.log('Send bulk notification disabled - backend endpoint not available');
        toast.success('Tính năng tạm thời không khả dụng');
        return Promise.resolve({ success: true });
    }, []);

    const startPolling = useCallback(() => {
        setIsPolling(true);
    }, []);

    const stopPolling = useCallback(() => {
        setIsPolling(false);
    }, []);

    const getNotificationById = useCallback(async (id) => {
        console.log('Get notification by ID disabled - backend endpoint not available');
        return Promise.resolve({ id: 'mock-id', title: 'Mock Notification' });
    }, []);

    const getNotificationStats = useCallback(async () => {
        console.log('Get notification stats disabled - backend endpoint not available');
        return Promise.resolve({ total: 0, unread: 0, read: 0, today: 0 });
    }, []);

    const exportNotifications = useCallback(async (format, params) => {
        console.log('Export notifications disabled - backend endpoint not available');
        toast.success('Tính năng tạm thời không khả dụng');
    }, []);

    const value = {
        // State
        unreadCount,
        notifications,
        isPolling,

        // Actions
        markAsRead,
        markMultipleAsRead,
        markAllAsRead,
        deleteNotification,
        createNotification,
        sendBulkNotification,
        getNotificationById,
        getNotificationStats,
        exportNotifications,
        startPolling,
        stopPolling,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
