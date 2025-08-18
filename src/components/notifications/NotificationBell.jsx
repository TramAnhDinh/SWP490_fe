import React, { useState } from 'react';
import { Bell, X, Check, Trash2, Settings } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { cn } from '../../utils/cn';

const NotificationBell = () => {
    const { unreadCount, notifications, markAsRead, deleteNotification, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification.notificationID);
        }
        setIsOpen(false);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
        setIsOpen(false);
    };

    const handleDeleteNotification = (e, notificationId) => {
        e.stopPropagation();
        deleteNotification(notificationId);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'Order':
                return '📦';
            case 'Installation':
                return '🔧';
            case 'Design':
                return '🎨';
            case 'Customer':
                return '👤';
            case 'System':
                return '⚙️';
            default:
                return '📢';
        }
    };

    const getNotificationColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'border-red-200 bg-red-50';
            case 'medium':
                return 'border-yellow-200 bg-yellow-50';
            case 'low':
                return 'border-blue-200 bg-blue-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Check className="w-4 h-4" />
                                    Đánh dấu đã đọc
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p>Không có thông báo nào</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.slice(0, 10).map((notification) => (
                                    <div
                                        key={notification.notificationID}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={cn(
                                            'p-4 hover:bg-gray-50 cursor-pointer transition-colors',
                                            !notification.isRead && 'bg-blue-50',
                                            getNotificationColor(notification.priority)
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 text-2xl">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className={cn(
                                                        'text-sm font-medium',
                                                        !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                                                    )}>
                                                        {notification.title}
                                                    </p>
                                                    <button
                                                        onClick={(e) => handleDeleteNotification(e, notification.notificationID)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // Navigate to notifications page
                                    window.location.href = '/notifications';
                                }}
                                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Xem tất cả thông báo
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default NotificationBell;
