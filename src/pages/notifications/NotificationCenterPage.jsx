import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Bell, Search, Filter, Download, RefreshCw, Check, Trash2, Eye, Clock, AlertTriangle,
    CheckCircle, XCircle, Plus, Settings, Users, Calendar, ArrowUpDown, Mail, MessageSquare,
    Star, Archive, Tag, Filter as FilterIcon, MoreHorizontal, ExternalLink, Package, Wrench, Palette
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationCenterPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Mock data for notifications
    const mockNotifications = [
        {
            id: '1',
            title: 'Đơn hàng mới #ORD001',
            message: 'Khách hàng Nguyễn Văn A đã đặt đơn hàng mới',
            type: 'order',
            priority: 'high',
            status: 'unread',
            createdAt: '2024-01-15T10:30:00Z',
            readAt: null
        },
        {
            id: '2',
            title: 'Lắp đặt hoàn thành',
            message: 'Đơn hàng #ORD002 đã được lắp đặt thành công',
            type: 'installation',
            priority: 'medium',
            status: 'read',
            createdAt: '2024-01-15T09:15:00Z',
            readAt: '2024-01-15T09:20:00Z'
        },
        {
            id: '3',
            title: 'Thiết kế mới',
            message: 'Designer đã tạo thiết kế mới cho đơn hàng #ORD003',
            type: 'design',
            priority: 'low',
            status: 'unread',
            createdAt: '2024-01-15T08:45:00Z',
            readAt: null
        }
    ];

    const notifications = mockNotifications;
    const isLoading = false;
    const refetch = () => console.log('Refetch disabled - using mock data');

    // Mock stats
    const stats = {
        total: 3,
        unread: 2,
        read: 1,
        today: 1
    };

    // Mock mutations - no API calls
    const markAsReadMutation = {
        mutate: (notificationId) => {
            console.log('Mark as read disabled - using mock data');
            toast.success('Đã đánh dấu đã đọc');
        },
        isPending: false
    };

    const markAllAsReadMutation = {
        mutate: () => {
            console.log('Mark all as read disabled - using mock data');
            toast.success('Đã đánh dấu tất cả đã đọc');
        },
        isPending: false
    };

    const deleteNotificationMutation = {
        mutate: (notificationId) => {
            console.log('Delete notification disabled - using mock data');
            toast.success('Đã xóa thông báo');
        },
        isPending: false
    };

    const bulkDeleteMutation = {
        mutate: (notificationIds) => {
            console.log('Bulk delete disabled - using mock data');
            setSelectedNotifications([]);
            toast.success('Đã xóa các thông báo đã chọn');
        },
        isPending: false
    };

    // Categories
    const categories = [
        { id: 'all', name: 'Tất cả', icon: Bell, color: 'bg-gray-500' },
        { id: 'order', name: 'Đơn hàng', icon: Package, color: 'bg-blue-500' },
        { id: 'installation', name: 'Lắp đặt', icon: Wrench, color: 'bg-green-500' },
        { id: 'design', name: 'Thiết kế', icon: Palette, color: 'bg-purple-500' },
        { id: 'customer', name: 'Khách hàng', icon: Users, color: 'bg-orange-500' },
        { id: 'system', name: 'Hệ thống', icon: Settings, color: 'bg-red-500' },
        { id: 'promotion', name: 'Khuyến mãi', icon: Star, color: 'bg-yellow-500' }
    ];

    // Handle bulk actions
    const handleSelectAll = () => {
        if (selectedNotifications.length === notifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.map(n => n.id));
        }
    };

    const handleSelectNotification = (notificationId) => {
        setSelectedNotifications(prev =>
            prev.includes(notificationId)
                ? prev.filter(id => id !== notificationId)
                : [...prev, notificationId]
        );
    };

    const handleBulkAction = (action) => {
        if (selectedNotifications.length === 0) {
            toast.error('Vui lòng chọn thông báo để thực hiện');
            return;
        }

        switch (action) {
            case 'markAsRead':
                selectedNotifications.forEach(id => markAsReadMutation.mutate(id));
                break;
            case 'delete':
                bulkDeleteMutation.mutate(selectedNotifications);
                break;
            default:
                break;
        }
    };

    // Get notification icon and color
    const getNotificationIcon = (type) => {
        const category = categories.find(c => c.id === type);
        return category ? category.icon : Bell;
    };

    const getNotificationColor = (type) => {
        const category = categories.find(c => c.id === type);
        return category ? category.color : 'bg-gray-500';
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trung tâm thông báo</h1>
                    <p className="text-gray-600">Quản lý và theo dõi tất cả thông báo trong hệ thống</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Làm mới
                    </Button>
                    <Button onClick={() => navigate('/notifications/create')} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo thông báo
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng thông báo</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Chưa đọc</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.unread || 0}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đã đọc</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.read || 0}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.today || 0}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Categories */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục thông báo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === category.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <div className={`p-2 rounded-lg ${category.color}`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Card>

            {/* Filters and Search */}
            <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thông báo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả độ ưu tiên</option>
                            <option value="high">Cao</option>
                            <option value="medium">Trung bình</option>
                            <option value="low">Thấp</option>
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="unread">Chưa đọc</option>
                            <option value="read">Đã đọc</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">
                            Đã chọn {selectedNotifications.length} thông báo
                        </span>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleBulkAction('markAsRead')}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Đánh dấu đã đọc
                            </Button>
                            <Button
                                onClick={() => handleBulkAction('delete')}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                Xóa
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Notifications List */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Danh sách thông báo</h3>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => markAllAsReadMutation.mutate()}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Đánh dấu tất cả đã đọc
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="text-center py-8">
                            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Không có thông báo nào</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                                <div
                                    key={notification.id}
                                    className={`p-4 border rounded-lg transition-all ${notification.unread
                                        ? 'bg-blue-50 border-blue-200'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.includes(notification.id)}
                                            onChange={() => handleSelectNotification(notification.id)}
                                            className="mt-1"
                                        />
                                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                                    <p className="text-gray-600 mt-1">{notification.message}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge className={getPriorityColor(notification.priority)}>
                                                            {notification.priority === 'high' ? 'Cao' :
                                                                notification.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                                        </Badge>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(notification.createdAt).toLocaleString('vi-VN')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {notification.unread && (
                                                        <Button
                                                            onClick={() => markAsReadMutation.mutate(notification.id)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={() => deleteNotificationMutation.mutate(notification.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {notifications.length > 0 && (
                    <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-700">
                            Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, notifications.length)} trong tổng số {notifications.length} thông báo
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                Trước
                            </Button>
                            <Button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={notifications.length < itemsPerPage}
                                variant="outline"
                                size="sm"
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default NotificationCenterPage;
