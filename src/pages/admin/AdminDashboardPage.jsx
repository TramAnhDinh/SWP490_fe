import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Shield,
    Users,
    Store,
    BarChart3,
    Settings,
    Eye,
    Edit3,
    Plus,
    Trash2,
    CheckCircle,
    AlertCircle,
    Clock,
    TrendingUp,
    Database,
    Activity,
    Globe
} from 'lucide-react';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService } from '../../services/analyticsService';
import { storeService } from '../../services/storeService';
import { employeeService } from '../../services/employeeService';
import { accountService } from '../../services/accountService';

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    // Get system performance data
    const { data: systemPerformance, isLoading: loadingSystem } = useQuery({
        queryKey: ['system-performance', selectedPeriod],
        queryFn: () => analyticsService.getSystemPerformance({ period: selectedPeriod }),
        enabled: !!user?.userId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: false,
    });

    // Get all stores data
    const { data: stores = [], isLoading: loadingStores } = useQuery({
        queryKey: ['all-stores'],
        queryFn: () => storeService.getStores(),
        enabled: !!user?.userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Get all employees data
    const { data: employees = [], isLoading: loadingEmployees } = useQuery({
        queryKey: ['all-employees'],
        queryFn: () => employeeService.getEmployees(),
        enabled: !!user?.userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Get all accounts data
    const { data: accounts = [], isLoading: loadingAccounts } = useQuery({
        queryKey: ['all-accounts'],
        queryFn: () => accountService.getAccounts(),
        enabled: !!user?.userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Mock data for development
    const mockSystemPerformance = {
        totalStores: 12,
        totalEmployees: 156,
        totalCustomers: 2847,
        totalOrders: 1245,
        systemUptime: 99.8,
        averageResponseTime: 245,
        totalRevenue: 2850000000,
        activeUsers: 89
    };

    const mockStores = [
        { id: 1, name: 'Chi nhánh Quận 1', status: 'Active', revenue: 450000000, employees: 15, orders: 156 },
        { id: 2, name: 'Chi nhánh Quận 3', status: 'Active', revenue: 380000000, employees: 12, orders: 134 },
        { id: 3, name: 'Chi nhánh Quận 7', status: 'Active', revenue: 520000000, employees: 18, orders: 189 },
        { id: 4, name: 'Chi nhánh Thủ Đức', status: 'Active', revenue: 320000000, employees: 10, orders: 98 }
    ];

    const mockEmployees = [
        { id: 1, name: 'Nguyễn Văn A', role: 'Store Manager', store: 'Chi nhánh Quận 1', status: 'Active', performance: 4.8 },
        { id: 2, name: 'Trần Thị B', role: 'Designer', store: 'Chi nhánh Quận 3', status: 'Active', performance: 4.6 },
        { id: 3, name: 'Lê Văn C', role: 'Sales Staff', store: 'Chi nhánh Quận 7', status: 'Active', performance: 4.7 },
        { id: 4, name: 'Phạm Thị D', role: 'Installation Tech', store: 'Chi nhánh Thủ Đức', status: 'Active', performance: 4.5 }
    ];

    const actualPerformance = systemPerformance || mockSystemPerformance;
    const actualStores = stores.length > 0 ? stores : mockStores;
    const actualEmployees = employees.length > 0 ? employees : mockEmployees;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Suspended': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Store Manager': return 'bg-blue-100 text-blue-800';
            case 'Designer': return 'bg-purple-100 text-purple-800';
            case 'Sales Staff': return 'bg-green-100 text-green-800';
            case 'Installation Tech': return 'bg-orange-100 text-orange-800';
            case 'Admin': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loadingSystem) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard System Administrator</h1>
                    <p className="text-gray-600">
                        Chào mừng {user?.name || 'Admin'} - Quản lý hệ thống và chuỗi cửa hàng
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
                        onClick={() => navigate('/admin/settings')}
                        className="flex items-center space-x-2"
                    >
                        <Settings className="h-4 w-4" />
                        <span>Cài đặt hệ thống</span>
                    </Button>
                </div>
            </div>

            {/* System Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Stores */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng cửa hàng</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {actualPerformance.totalStores}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Store className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                {/* Total Employees */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {actualPerformance.totalEmployees}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                {/* System Uptime */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Uptime hệ thống</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {actualPerformance.systemUptime}%
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>

                {/* Total Revenue */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(actualPerformance.totalRevenue)}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Performance */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Hiệu suất hệ thống</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/admin/analytics')}
                            className="flex items-center space-x-2"
                        >
                            <BarChart3 className="h-4 w-4" />
                            <span>Xem chi tiết</span>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Thời gian phản hồi trung bình:</span>
                            <span className="font-medium">{actualPerformance.averageResponseTime}ms</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Người dùng đang hoạt động:</span>
                            <span className="font-medium">{actualPerformance.activeUsers}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Tổng khách hàng:</span>
                            <span className="font-medium">{actualPerformance.totalCustomers}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Tổng đơn hàng:</span>
                            <span className="font-medium">{actualPerformance.totalOrders}</span>
                        </div>
                    </div>
                </Card>

                {/* Quick System Actions */}
                <Card className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác hệ thống</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/admin/backup')}
                            className="flex flex-col items-center p-4 h-auto space-y-2"
                        >
                            <Database className="h-6 w-6 text-blue-600" />
                            <span>Backup dữ liệu</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/admin/logs')}
                            className="flex flex-col items-center p-4 h-auto space-y-2"
                        >
                            <Activity className="h-6 w-6 text-green-600" />
                            <span>Xem logs</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/admin/maintenance')}
                            className="flex flex-col items-center p-4 h-auto space-y-2"
                        >
                            <Settings className="h-6 w-6 text-orange-600" />
                            <span>Bảo trì</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate('/admin/updates')}
                            className="flex flex-col items-center p-4 h-auto space-y-2"
                        >
                            <Globe className="h-6 w-6 text-purple-600" />
                            <span>Cập nhật</span>
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Stores Management */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Quản lý chuỗi cửa hàng</h3>
                    <Button
                        onClick={() => navigate('/admin/stores/add')}
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Thêm cửa hàng mới</span>
                    </Button>
                </div>

                {loadingStores ? (
                    <LoadingSpinner />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cửa hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doanh thu
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nhân viên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đơn hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {actualStores.map((store) => (
                                    <tr key={store.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{store.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={getStatusColor(store.status)}>
                                                {store.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(store.revenue)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {store.employees}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {store.orders}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/stores/${store.id}`)}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    <span>Xem</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/stores/${store.id}/edit`)}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Edit3 className="h-3 w-3" />
                                                    <span>Sửa</span>
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

            {/* Employee Management */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Quản lý nhân viên</h3>
                    <Button
                        onClick={() => navigate('/admin/employees/add')}
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Thêm nhân viên mới</span>
                    </Button>
                </div>

                {loadingEmployees ? (
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
                                        Cửa hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hiệu suất
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {actualEmployees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={getRoleColor(employee.role)}>
                                                {employee.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {employee.store}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge className={getStatusColor(employee.status)}>
                                                {employee.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {employee.performance}/5.0
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/employees/${employee.id}`)}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    <span>Xem</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/employees/${employee.id}/edit`)}
                                                    className="flex items-center space-x-1"
                                                >
                                                    <Edit3 className="h-3 w-3" />
                                                    <span>Sửa</span>
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

            {/* Quick Actions */}
            <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/accounts')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Shield className="h-8 w-8 text-blue-600" />
                        <span>Quản lý tài khoản</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/stores')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Store className="h-8 w-8 text-green-600" />
                        <span>Quản lý cửa hàng</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/analytics')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                        <span>Báo cáo hệ thống</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/admin/settings')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Settings className="h-8 w-8 text-orange-600" />
                        <span>Cài đặt hệ thống</span>
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboardPage;

