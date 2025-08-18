import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Bell,
    Search,
    Filter,
    Download,
    RefreshCw,
    Check,
    Trash2,
    Eye,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus,
    Settings,
    Users,
    Calendar,
    ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { notificationService } from '../../services/notificationService';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { markMultipleAsRead, deleteNotification } = useNotifications();

    // Mock data for notifications
    const mockNotifications = [
        {
            id: '1',
            title: 'Đơn hàng mới #ORD001',
            message: 'Khách hàng Nguyễn Văn A đã đặt đơn hàng mới',
            type: 'order',
            priority: 'high',
            isRead: false,
            createdAt: '2024-01-15T10:30:00Z'
        },
        {
            id: '2',
            title: 'Lắp đặt hoàn thành',
            message: 'Đơn hàng #ORD002 đã được lắp đặt thành công',
            type: 'installation',
            priority: 'medium',
            isRead: true,
            createdAt: '2024-01-15T09:15:00Z'
        },
        {
            id: '3',
            title: 'Thiết kế mới',
            message: 'Designer đã tạo thiết kế mới cho đơn hàng #ORD003',
            type: 'design',
            priority: 'low',
            isRead: false,
            createdAt: '2024-01-15T08:45:00Z'
        }
    ];

    const notificationsData = {
        notifications: mockNotifications,
        totalCount: mockNotifications.length
    };
    const isLoading = false;
    const error = null;
    const refetch = () => console.log('Refetch disabled - using mock data');

    // Mock stats
    const stats = {
        total: 3,
        unread: 2,
        read: 1,
        today: 1
    };

    // Mock mutations - no API calls
    const markMultipleAsReadMutation = {
        mutate: (ids) => {
            console.log('Mark multiple as read disabled - using mock data');
            setSelectedNotifications([]);
            toast.success('Đã đánh dấu thông báo đã đọc');
        },
        isPending: false
    };

    const deleteMultipleMutation = {
        mutate: (ids) => {
            console.log('Delete multiple notifications disabled - using mock data');
            setSelectedNotifications([]);
            toast.success('Đã xóa thông báo đã chọn');
        },
        isPending: false
    };

    const exportMutation = {
        mutate: (params) => {
            console.log('Export notifications disabled - using mock data');
            toast.success('Đã xuất thông báo thành công');
        },
        isPending: false
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedNotifications(notificationsData.notifications.map(n => n.notificationID));
        } else {
            setSelectedNotifications([]);
        }
    };

    const handleSelectNotification = (notificationId, checked) => {
        if (checked) {
            setSelectedNotifications(prev => [...prev, notificationId]);
        } else {
            setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
        }
    };

    const handleMarkSelectedAsRead = () => {
        if (selectedNotifications.length === 0) {
            toast.error('Vui lòng chọn thông báo để đánh dấu đã đọc');
            return;
        }
        markMultipleAsReadMutation.mutate(selectedNotifications);
    };

    const handleDeleteSelected = () => {
        if (selectedNotifications.length === 0) {
            toast.error('Vui lòng chọn thông báo để xóa');
            return;
        }
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedNotifications.length} thông báo đã chọn?`)) {
            deleteMultipleMutation.mutate(selectedNotifications);
        }
    };

    const handleExport = () => {
        exportMutation.mutate({
            search: searchTerm,
            type: filterType !== 'all' ? filterType : undefined,
            priority: filterPriority !== 'all' ? filterPriority : undefined,
            isRead: filterStatus !== 'all' ? (filterStatus === 'read') : undefined,
        });
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

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'high':
                return <Badge className="bg-red-100 text-red-800">Cao</Badge>;
            case 'medium':
                return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>;
            case 'low':
                return <Badge className="bg-blue-100 text-blue-800">Thấp</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
        }
    };

    const getStatusBadge = (isRead) => {
        return isRead ? (
            <Badge className="bg-green-100 text-green-800">Đã đọc</Badge>
        ) : (
            <Badge className="bg-blue-100 text-blue-800">Chưa đọc</Badge>
        );
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                    <AlertTriangle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Lỗi khi tải dữ liệu</h3>
                <p className="text-red-600 mb-4">Không thể kết nối đến máy chủ</p>
                <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                </Button>
            </div>
        );
    }

    const totalPages = Math.ceil(notificationsData.totalCount / pageSize);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý thông báo</h1>
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
                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Bell className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng thông báo</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Chưa đọc</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.unreadCount || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đã đọc</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.readCount || 0}</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.todayCount || 0}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters and Controls */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm thông báo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Bộ lọc
                        </Button>

                        <Button
                            onClick={handleExport}
                            variant="outline"
                            className="flex items-center gap-2"
                            disabled={exportMutation.isLoading}
                        >
                            <Download className="w-4 h-4" />
                            Xuất Excel
                        </Button>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Loại thông báo
                                </label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả loại</option>
                                    <option value="Order">Đơn hàng</option>
                                    <option value="Installation">Lắp đặt</option>
                                    <option value="Design">Thiết kế</option>
                                    <option value="Customer">Khách hàng</option>
                                    <option value="System">Hệ thống</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mức độ ưu tiên
                                </label>
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả mức độ</option>
                                    <option value="high">Cao</option>
                                    <option value="medium">Trung bình</option>
                                    <option value="low">Thấp</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="unread">Chưa đọc</option>
                                    <option value="read">Đã đọc</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số lượng mỗi trang
                                </label>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-blue-900">
                            Đã chọn {selectedNotifications.length} thông báo
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleMarkSelectedAsRead}
                                variant="outline"
                                size="sm"
                                className="text-blue-700 border-blue-300 hover:bg-blue-100"
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Đánh dấu đã đọc
                            </Button>
                            <Button
                                onClick={handleDeleteSelected}
                                variant="outline"
                                size="sm"
                                className="text-red-700 border-red-300 hover:bg-red-100"
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Xóa
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Notifications List */}
            <Card>
                {notificationsData.notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Bell className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có thông báo</h3>
                        <p className="text-gray-600">Không có thông báo nào phù hợp với bộ lọc hiện tại</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.length === notificationsData.notifications.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thông báo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mức độ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {notificationsData.notifications.map((notification) => (
                                    <tr key={notification.notificationID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedNotifications.includes(notification.notificationID)}
                                                onChange={(e) => handleSelectNotification(notification.notificationID, e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 text-2xl mr-3">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className="bg-gray-100 text-gray-800">
                                                {notification.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getPriorityBadge(notification.priority)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(notification.isRead)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                                            <br />
                                            {new Date(notification.createdAt).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => navigate(`/notifications/${notification.notificationID}`)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => deleteNotification(notification.notificationID)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <Card>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Hiển thị {((currentPage - 1) * pageSize) + 1} đến {Math.min(currentPage * pageSize, notificationsData.totalCount)} trong tổng số {notificationsData.totalCount} thông báo
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                Trước
                            </Button>
                            <span className="text-sm text-gray-700">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                            >
                                Sau
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default NotificationListPage;
