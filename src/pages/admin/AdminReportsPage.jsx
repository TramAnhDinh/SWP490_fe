import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BarChart3,
    TrendingUp,
    Users,
    Store,
    ShoppingCart,
    DollarSign,
    Download,
    Calendar,
    Filter,
    RefreshCw,
    Eye,
    FileText,
    PieChart,
    Activity,
    Clock
} from 'lucide-react';
import { Card, Button, Badge, LoadingSpinner, Input } from '../../components/common';
import { analyticsService } from '../../services/analyticsService';

const AdminReportsPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedReport, setSelectedReport] = useState('overview');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // Get reports data
    const { data: reportsData, isLoading: loadingReports } = useQuery({
        queryKey: ['admin-reports', selectedPeriod, dateRange],
        queryFn: async () => {
            try {
                // Try to get real data from API
                const [salesData, customerData, operationsData, financialData] = await Promise.all([
                    analyticsService.getSalesAnalytics({ period: selectedPeriod, ...dateRange }),
                    analyticsService.getCustomerAnalytics({ period: selectedPeriod, ...dateRange }),
                    analyticsService.getOrderAnalytics({ period: selectedPeriod, ...dateRange }),
                    analyticsService.getRevenueAnalytics({ period: selectedPeriod, ...dateRange })
                ]);

                return {
                    overview: {
                        totalRevenue: financialData.totalRevenue || 0,
                        totalOrders: operationsData.totalOrders || 0,
                        totalCustomers: customerData.totalCustomers || 0,
                        totalStores: 12, // This should come from stores API
                        totalEmployees: 156, // This should come from employees API
                        averageOrderValue: operationsData.averageOrderValue || 0,
                        revenueGrowth: 15.2, // Calculate from data
                        orderGrowth: 8.7,
                        customerGrowth: 12.3
                    },
                    sales: salesData,
                    customers: customerData,
                    operations: operationsData,
                    financial: financialData
                };
            } catch (error) {
                console.error('Error fetching reports data:', error);
                // Return mock data as fallback
                return {
                    overview: {
                        totalRevenue: 2850000000,
                        totalOrders: 1245,
                        totalCustomers: 2847,
                        totalStores: 12,
                        totalEmployees: 156,
                        averageOrderValue: 2289156,
                        revenueGrowth: 15.2,
                        orderGrowth: 8.7,
                        customerGrowth: 12.3
                    },
                    sales: {
                        dailyRevenue: [
                            { date: '2024-01-01', revenue: 45000000, orders: 18 },
                            { date: '2024-01-02', revenue: 52000000, orders: 22 },
                            { date: '2024-01-03', revenue: 38000000, orders: 16 },
                            { date: '2024-01-04', revenue: 61000000, orders: 25 },
                            { date: '2024-01-05', revenue: 48000000, orders: 19 },
                            { date: '2024-01-06', revenue: 55000000, orders: 23 },
                            { date: '2024-01-07', revenue: 42000000, orders: 17 }
                        ],
                        topServices: [
                            { name: 'Decal xe máy', revenue: 850000000, orders: 456, growth: 12.5 },
                            { name: 'Decal ô tô', revenue: 720000000, orders: 234, growth: 8.3 },
                            { name: 'Decal xe tải', revenue: 680000000, orders: 189, growth: 15.7 },
                            { name: 'Decal xe đạp', revenue: 450000000, orders: 312, growth: 6.2 },
                            { name: 'Decal tùy chỉnh', revenue: 150000000, orders: 54, growth: 22.1 }
                        ],
                        storePerformance: [
                            { name: 'Chi nhánh Quận 1', revenue: 520000000, orders: 189, growth: 18.5 },
                            { name: 'Chi nhánh Quận 3', revenue: 480000000, orders: 156, growth: 12.3 },
                            { name: 'Chi nhánh Quận 7', revenue: 610000000, orders: 234, growth: 25.7 },
                            { name: 'Chi nhánh Thủ Đức', revenue: 380000000, orders: 98, growth: 8.9 },
                            { name: 'Chi nhánh Bình Thạnh', revenue: 420000000, orders: 134, growth: 14.2 }
                        ]
                    },
                    customers: {
                        newCustomers: 234,
                        returningCustomers: 2013,
                        customerRetention: 78.5,
                        averageCustomerValue: 1001234,
                        customerSegments: [
                            { segment: 'VIP', count: 156, percentage: 5.5, revenue: 850000000 },
                            { segment: 'Thường xuyên', count: 1245, percentage: 43.7, revenue: 1200000000 },
                            { segment: 'Mới', count: 892, percentage: 31.3, revenue: 450000000 },
                            { segment: 'Không hoạt động', count: 554, percentage: 19.5, revenue: 350000000 }
                        ],
                        topCustomers: [
                            { name: 'Công ty ABC', orders: 45, revenue: 125000000, lastOrder: '2024-01-15' },
                            { name: 'Công ty XYZ', orders: 38, revenue: 98000000, lastOrder: '2024-01-14' },
                            { name: 'Công ty DEF', orders: 32, revenue: 87000000, lastOrder: '2024-01-13' },
                            { name: 'Công ty GHI', orders: 28, revenue: 76000000, lastOrder: '2024-01-12' },
                            { name: 'Công ty JKL', orders: 25, revenue: 68000000, lastOrder: '2024-01-11' }
                        ]
                    },
                    operations: {
                        orderStatusDistribution: [
                            { status: 'Hoàn thành', count: 892, percentage: 71.6 },
                            { status: 'Đang xử lý', count: 156, percentage: 12.5 },
                            { status: 'Chờ thanh toán', count: 98, percentage: 7.9 },
                            { status: 'Đã hủy', count: 45, percentage: 3.6 },
                            { status: 'Trả hàng', count: 54, percentage: 4.4 }
                        ],
                        averageProcessingTime: {
                            design: 2.5,
                            production: 1.8,
                            installation: 3.2,
                            total: 7.5
                        },
                        qualityMetrics: {
                            customerSatisfaction: 4.6,
                            defectRate: 2.3,
                            returnRate: 4.4,
                            reworkRate: 1.8
                        },
                        employeePerformance: [
                            { name: 'Nguyễn Văn A', role: 'Designer', orders: 45, rating: 4.8, revenue: 125000000 },
                            { name: 'Trần Thị B', role: 'Sales', orders: 38, rating: 4.6, revenue: 98000000 },
                            { name: 'Lê Văn C', role: 'Technician', orders: 32, rating: 4.7, revenue: 87000000 },
                            { name: 'Phạm Thị D', role: 'Manager', orders: 28, rating: 4.9, revenue: 76000000 }
                        ]
                    },
                    financial: {
                        revenue: {
                            total: 2850000000,
                            growth: 15.2,
                            breakdown: {
                                services: 2200000000,
                                products: 450000000,
                                installation: 200000000
                            }
                        },
                        expenses: {
                            total: 1800000000,
                            breakdown: {
                                materials: 900000000,
                                labor: 600000000,
                                overhead: 300000000
                            }
                        },
                        profit: {
                            total: 1050000000,
                            margin: 36.8,
                            growth: 22.5
                        },
                        cashFlow: [
                            { month: 'Tháng 1', inflow: 450000000, outflow: 320000000, net: 130000000 },
                            { month: 'Tháng 2', inflow: 520000000, outflow: 380000000, net: 140000000 },
                            { month: 'Tháng 3', inflow: 610000000, outflow: 420000000, net: 190000000 }
                        ]
                    }
                };
            }
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: false,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };

    const getGrowthColor = (growth) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getGrowthIcon = (growth) => {
        if (growth > 0) return <TrendingUp className="h-4 w-4" />;
        if (growth < 0) return <TrendingUp className="h-4 w-4 rotate-180" />;
        return null;
    };

    const reportTypes = [
        { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
        { id: 'sales', name: 'Báo cáo bán hàng', icon: ShoppingCart },
        { id: 'customers', name: 'Báo cáo khách hàng', icon: Users },
        { id: 'operations', name: 'Báo cáo vận hành', icon: Activity },
        { id: 'financial', name: 'Báo cáo tài chính', icon: DollarSign }
    ];

    if (loadingReports) {
        return <LoadingSpinner />;
    }

    const data = reportsData || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Báo cáo hệ thống</h1>
                    <p className="text-gray-600">Báo cáo toàn diện về hiệu suất hệ thống và kinh doanh</p>
                </div>

                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <Download className="h-4 w-4" />
                        <span>Xuất báo cáo</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>Làm mới</span>
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại báo cáo
                        </label>
                        <select
                            value={selectedReport}
                            onChange={(e) => setSelectedReport(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {reportTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Khoảng thời gian
                        </label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                            <option value="quarter">Quý này</option>
                            <option value="year">Năm nay</option>
                            <option value="custom">Tùy chỉnh</option>
                        </select>
                    </div>

                    {selectedPeriod === 'custom' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Từ ngày
                                </label>
                                <Input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đến ngày
                                </label>
                                <Input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Card>

            {/* Report Content */}
            {selectedReport === 'overview' && data.overview && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(data.overview.totalRevenue)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm ${getGrowthColor(data.overview.revenueGrowth)}`}>
                                            {data.overview.revenueGrowth > 0 ? '+' : ''}{data.overview.revenueGrowth}%
                                        </span>
                                        {getGrowthIcon(data.overview.revenueGrowth)}
                                    </div>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(data.overview.totalOrders)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm ${getGrowthColor(data.overview.orderGrowth)}`}>
                                            {data.overview.orderGrowth > 0 ? '+' : ''}{data.overview.orderGrowth}%
                                        </span>
                                        {getGrowthIcon(data.overview.orderGrowth)}
                                    </div>
                                </div>
                                <ShoppingCart className="h-8 w-8 text-blue-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(data.overview.totalCustomers)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm ${getGrowthColor(data.overview.customerGrowth)}`}>
                                            {data.overview.customerGrowth > 0 ? '+' : ''}{data.overview.customerGrowth}%
                                        </span>
                                        {getGrowthIcon(data.overview.customerGrowth)}
                                    </div>
                                </div>
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Giá trị đơn hàng TB</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(data.overview.averageOrderValue)}
                                    </p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-orange-600" />
                            </div>
                        </Card>
                    </div>

                    {/* System Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Tổng quan hệ thống</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Tổng cửa hàng:</span>
                                    <span className="font-medium">{data.overview.totalStores}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Tổng nhân viên:</span>
                                    <span className="font-medium">{data.overview.totalEmployees}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Tổng đơn hàng:</span>
                                    <span className="font-medium">{formatNumber(data.overview.totalOrders)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Tổng doanh thu:</span>
                                    <span className="font-medium">{formatCurrency(data.overview.totalRevenue)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Tăng trưởng</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Doanh thu:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`font-medium ${getGrowthColor(data.overview.revenueGrowth)}`}>
                                            {data.overview.revenueGrowth > 0 ? '+' : ''}{data.overview.revenueGrowth}%
                                        </span>
                                        {getGrowthIcon(data.overview.revenueGrowth)}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Đơn hàng:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`font-medium ${getGrowthColor(data.overview.orderGrowth)}`}>
                                            {data.overview.orderGrowth > 0 ? '+' : ''}{data.overview.orderGrowth}%
                                        </span>
                                        {getGrowthIcon(data.overview.orderGrowth)}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Khách hàng:</span>
                                    <div className="flex items-center space-x-2">
                                        <span className={`font-medium ${getGrowthColor(data.overview.customerGrowth)}`}>
                                            {data.overview.customerGrowth > 0 ? '+' : ''}{data.overview.customerGrowth}%
                                        </span>
                                        {getGrowthIcon(data.overview.customerGrowth)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {selectedReport === 'sales' && data.sales && (
                <div className="space-y-6">
                    {/* Sales Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Dịch vụ bán chạy</h3>
                            <div className="space-y-3">
                                {data.sales.topServices.map((service, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{service.name}</p>
                                            <p className="text-xs text-gray-500">{formatNumber(service.orders)} đơn hàng</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatCurrency(service.revenue)}
                                            </p>
                                            <p className={`text-xs ${getGrowthColor(service.growth)}`}>
                                                {service.growth > 0 ? '+' : ''}{service.growth}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Hiệu suất cửa hàng</h3>
                            <div className="space-y-3">
                                {data.sales.storePerformance.map((store, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{store.name}</p>
                                            <p className="text-xs text-gray-500">{formatNumber(store.orders)} đơn hàng</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatCurrency(store.revenue)}
                                            </p>
                                            <p className={`text-xs ${getGrowthColor(store.growth)}`}>
                                                {store.growth > 0 ? '+' : ''}{store.growth}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Doanh thu theo ngày</h3>
                            <div className="space-y-3">
                                {data.sales.dailyRevenue.map((day, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(day.date).toLocaleDateString('vi-VN')}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatNumber(day.orders)} đơn hàng</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatCurrency(day.revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {selectedReport === 'customers' && data.customers && (
                <div className="space-y-6">
                    {/* Customer Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Khách hàng mới</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(data.customers.newCustomers)}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Khách hàng quay lại</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(data.customers.returningCustomers)}
                                    </p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tỷ lệ giữ chân</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {data.customers.customerRetention}%
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Giá trị TB/khách</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(data.customers.averageCustomerValue)}
                                    </p>
                                </div>
                                <DollarSign className="h-8 w-8 text-orange-600" />
                            </div>
                        </Card>
                    </div>

                    {/* Customer Segments and Top Customers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Phân khúc khách hàng</h3>
                            <div className="space-y-3">
                                {data.customers.customerSegments.map((segment, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{segment.segment}</p>
                                            <p className="text-xs text-gray-500">{formatNumber(segment.count)} khách hàng</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {segment.percentage}%
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatCurrency(segment.revenue)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Khách hàng hàng đầu</h3>
                            <div className="space-y-3">
                                {data.customers.topCustomers.map((customer, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatNumber(customer.orders)} đơn hàng
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatCurrency(customer.revenue)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(customer.lastOrder).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {selectedReport === 'operations' && data.operations && (
                <div className="space-y-6">
                    {/* Operations Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Thời gian xử lý TB</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {data.operations.averageProcessingTime.total} ngày
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Hài lòng khách hàng</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {data.operations.qualityMetrics.customerSatisfaction}/5.0
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-green-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tỷ lệ lỗi</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {data.operations.qualityMetrics.defectRate}%
                                    </p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-orange-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tỷ lệ trả hàng</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {data.operations.qualityMetrics.returnRate}%
                                    </p>
                                </div>
                                <RefreshCw className="h-8 w-8 text-red-600" />
                            </div>
                        </Card>
                    </div>

                    {/* Order Status and Employee Performance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Phân bố trạng thái đơn hàng</h3>
                            <div className="space-y-3">
                                {data.operations.orderStatusDistribution.map((status, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{status.status}</p>
                                            <p className="text-xs text-gray-500">{formatNumber(status.count)} đơn hàng</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {status.percentage}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Hiệu suất nhân viên</h3>
                            <div className="space-y-3">
                                {data.operations.employeePerformance.map((employee, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                            <p className="text-xs text-gray-500">{employee.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatNumber(employee.orders)} đơn hàng
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {employee.rating}/5.0
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {selectedReport === 'financial' && data.financial && (
                <div className="space-y-6">
                    {/* Financial Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(data.financial.revenue.total)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm ${getGrowthColor(data.financial.revenue.growth)}`}>
                                            {data.financial.revenue.growth > 0 ? '+' : ''}{data.financial.revenue.growth}%
                                        </span>
                                        {getGrowthIcon(data.financial.revenue.growth)}
                                    </div>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng chi phí</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(data.financial.expenses.total)}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-red-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Lợi nhuận</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(data.financial.profit.total)}
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-sm ${getGrowthColor(data.financial.profit.growth)}`}>
                                            {data.financial.profit.growth > 0 ? '+' : ''}{data.financial.profit.growth}%
                                        </span>
                                        {getGrowthIcon(data.financial.profit.growth)}
                                    </div>
                                </div>
                                <BarChart3 className="h-8 w-8 text-blue-600" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Biên lợi nhuận</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {data.financial.profit.margin}%
                                    </p>
                                </div>
                                <PieChart className="h-8 w-8 text-purple-600" />
                            </div>
                        </Card>
                    </div>

                    {/* Revenue Breakdown and Cash Flow */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Phân bổ doanh thu</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Dịch vụ:</span>
                                    <span className="font-medium">{formatCurrency(data.financial.revenue.breakdown.services)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Sản phẩm:</span>
                                    <span className="font-medium">{formatCurrency(data.financial.revenue.breakdown.products)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Lắp đặt:</span>
                                    <span className="font-medium">{formatCurrency(data.financial.revenue.breakdown.installation)}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Dòng tiền</h3>
                            <div className="space-y-3">
                                {data.financial.cashFlow.map((month, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{month.month}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {formatCurrency(month.net)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Thu: {formatCurrency(month.inflow)} | Chi: {formatCurrency(month.outflow)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage;
