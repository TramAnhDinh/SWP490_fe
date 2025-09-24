import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingCart,
    DollarSign,
    Package,
    Car,
    Palette,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart3,
    Calendar,
    MapPin,
    Building,
    Wrench,
    Star,
    Eye,
    Edit,
    Plus
} from 'lucide-react';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService } from '../../services/analyticsService';
import { orderService } from '../../services/orderService';
import { designService } from '../../services/designService';
import { employeeService } from '../../services/employeeService';
import { storeService } from '../../services/storeService';

const ManagerDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [selectedStore, setSelectedStore] = useState(user?.storeId || '');

    // Get analytics data from API
    const { data: analyticsData, isLoading: loadingAnalytics } = useQuery({
        queryKey: ['analytics', selectedStore, selectedPeriod],
        queryFn: () => analyticsService.getSalesAnalytics({
            storeId: selectedStore,
            period: selectedPeriod
        }),
        enabled: !!selectedStore
    });

          // Get store data
    const { data: storeData, isLoading: loadingStore } = useQuery({
        queryKey: ['store', selectedStore],
        queryFn: () => storeService.getStoreById(selectedStore),
        enabled: !!selectedStore
    });

    // Get recent orders
    const { data: recentOrders = [], isLoading: loadingOrders } = useQuery({
        queryKey: ['recent-orders', selectedStore],
        queryFn: () => orderService.getOrders({
            storeId: selectedStore,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        }),
        enabled: !!selectedStore
    });

    // Get pending designs
    const { data: pendingDesigns = [], isLoading: loadingDesigns } = useQuery({
        queryKey: ['pending-designs', selectedStore],
        queryFn: () => designService.getDesigns({
            storeId: selectedStore,
            status: 'Pending',
            limit: 10
        }),
        enabled: !!selectedStore
    });

    // Get staff performance
    const { data: staffPerformance = [], isLoading: loadingStaff } = useQuery({
        queryKey: ['staff-performance', selectedStore],
        queryFn: () => analyticsService.getEmployeePerformance({
            storeId: selectedStore
        }),
        enabled: !!selectedStore
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getComplexityColor = (complexity) => {
        switch (complexity) {
            case 'Simple': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Complex': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loadingStore || loadingAnalytics) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản lý</h1>
                    <p className="text-gray-600">
                        Chào mừng {user?.name || 'Manager'} - {storeData?.storeName}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="quarter">Quý này</option>
                    </select>

                    <Button
                        onClick={() => navigate('/analytics/dashboard')}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span>Xem báo cáo chi tiết</span>
                    </Button>
                </div>
            </div>

            {/* Store Info Card */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Building className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{storeData?.storeName}</h2>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{storeData?.address}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4" />
                                    <span>{storeData?.staffCount} nhân viên</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{storeData?.activeOrders} đơn hàng đang xử lý</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-600">Quản lý bởi</p>
                        <p className="font-semibold text-gray-900">{storeData?.manager}</p>
                        <p className="text-sm text-gray-500">{storeData?.phone}</p>
                    </div>
                </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(analyticsData?.revenue || 0)}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                {/* Orders */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analyticsData?.totalOrders || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                {/* Customers */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Khách hàng mới</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analyticsData?.newCustomers || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>

                {/* Designs */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Thiết kế</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analyticsData?.totalDesigns || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Palette className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Đơn hàng gần đây</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/orders')}
                            className="flex items-center space-x-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span>Xem tất cả</span>
                        </Button>
                    </div>

                    {loadingOrders ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Car className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.customerName}</p>
                                            <p className="text-sm text-gray-600">
                                                {order.vehicleType} • {order.service}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                                        <Badge className={getStatusColor(order.status)}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Pending Designs */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Thiết kế chờ xử lý</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/designs/approval')}
                            className="flex items-center space-x-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span>Xem tất cả</span>
                        </Button>
                    </div>

                    {loadingDesigns ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-4">
                            {pendingDesigns.map((design) => (
                                <div key={design.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Palette className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{design.designName}</p>
                                            <p className="text-sm text-gray-600">
                                                {design.customerName} • {design.vehicleType}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Designer: {design.designer}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <Badge className={getComplexityColor(design.complexity)}>
                                            {design.complexity}
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {design.estimatedTime}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Staff Performance */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Hiệu suất nhân viên</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/performance')}
                        className="flex items-center space-x-2"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span>Xem chi tiết</span>
                    </Button>
                </div>

                {loadingStaff ? (
                    <LoadingSpinner />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nhân viên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đơn hàng hoàn thành
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đánh giá KH
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hiệu suất
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {staffPerformance.map((staff) => (
                                    <tr key={staff.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-blue-600">
                                                            {staff.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className="bg-blue-100 text-blue-800">
                                                {staff.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {staff.completedOrders}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 text-sm text-gray-900">{staff.customerRating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${staff.efficiency}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-900">{staff.efficiency}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/orders/create')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Plus className="h-8 w-8 text-blue-600" />
                        <span>Tạo đơn hàng mới</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/designs/editor')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Palette className="h-8 w-8 text-orange-600" />
                        <span>Tạo thiết kế mới</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/customers/create')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Users className="h-8 w-8 text-green-600" />
                        <span>Thêm khách hàng</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/analytics/sales')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                        <span>Xem báo cáo</span>
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ManagerDashboardPage;
