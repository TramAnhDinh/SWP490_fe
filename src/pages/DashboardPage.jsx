import React from 'react';
import { Card, Badge, LoadingSpinner } from '../components/common';
import {
  ShoppingCart,
  Users,
  Car,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Store,
  Building
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dashboardStatsService } from '../services/dashboardStatsService';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Fetch dashboard statistics from API
  const { data: dashboardStats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardStatsService.getDashboardStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Format currency for Vietnamese Dong
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with thousand separators
  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  // Calculate stats from real data
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(dashboardStats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      description: 'Từ đơn hàng đã nghiệm thu',
    },
    {
      title: 'Tổng đơn hàng',
      value: formatNumber(dashboardStats?.totalOrders || 0),
      icon: ShoppingCart,
      color: 'bg-blue-500',
      description: 'Tất cả đơn hàng trong hệ thống',
    },
    {
      title: 'Tổng khách hàng',
      value: formatNumber(dashboardStats?.totalCustomers || 0),
      icon: Users,
      color: 'bg-purple-500',
      description: 'Số lượng khách hàng',
    },
    {
      title: 'Giá trị đơn hàng TB',
      value: formatCurrency(dashboardStats?.averageOrderValue || 0),
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Trung bình mỗi đơn hàng',
    },
    {
      title: 'Tổng cửa hàng',
      value: formatNumber(dashboardStats?.totalStores || 0),
      icon: Store,
      color: 'bg-indigo-500',
      description: 'Cửa hàng trong hệ thống',
    },
    {
      title: 'Tổng nhân viên',
      value: formatNumber(dashboardStats?.totalEmployees || 0),
      icon: Building,
      color: 'bg-pink-500',
      description: 'Nhân viên trong hệ thống',
    },
  ];

  // Get recent orders from real data
  const recentOrders = dashboardStats?.rawData?.orders?.slice(0, 3).map(order => ({
    id: order.orderID,
    customer: order.customerFullName || 'N/A',
    vehicle: order.vehicleModelName || 'N/A',
    status: order.orderStatus,
    priority: order.priority || 'Medium',
    date: order.orderDate,
    currentStage: order.currentStage,
  })) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'primary';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Survey': return 'primary';
      case 'Designing': return 'warning';
      case 'ProductionAndInstallation': return 'info';
      case 'AcceptanceAndDelivery': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">
          <p className="font-semibold">Lỗi khi tải dữ liệu dashboard</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về hoạt động kinh doanh</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.description && (
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Stats */}
        <Card>
          <Card.Header>
            <Card.Title>Tổng quan hệ thống</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng cửa hàng:</span>
                <span className="font-semibold">{formatNumber(dashboardStats?.totalStores || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng nhân viên:</span>
                <span className="font-semibold">{formatNumber(dashboardStats?.totalEmployees || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng đơn hàng:</span>
                <span className="font-semibold">{formatNumber(dashboardStats?.totalOrders || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tổng doanh thu:</span>
                <span className="font-semibold text-green-600">{formatCurrency(dashboardStats?.totalRevenue || 0)}</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Orders by Stage */}
        <Card>
          <Card.Header>
            <Card.Title>Đơn hàng theo giai đoạn</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {dashboardStats?.ordersByStage && Object.entries(dashboardStats.ordersByStage).map(([stage, count]) => (
                <div key={stage} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {stage === 'AcceptanceAndDelivery' ? 'Đã nghiệm thu' :
                      stage === 'ProductionAndInstallation' ? 'Đang thi công' :
                        stage === 'Designing' ? 'Đang thiết kế' :
                          stage === 'Survey' ? 'Đang khảo sát' : stage}
                  </span>
                  <Badge variant={getStageColor(stage)} size="sm">
                    {count} đơn
                  </Badge>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders table */}
        <Card>
          <Card.Header>
            <Card.Title>Đơn hàng gần đây</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{order.id}</span>
                      <Badge variant={getPriorityColor(order.priority)} size="sm">
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.vehicle}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(order.status)} size="sm">
                      {order.status}
                    </Badge>
                    {order.currentStage && (
                      <Badge variant={getStageColor(order.currentStage)} size="sm" className="mt-1">
                        {order.currentStage === 'AcceptanceAndDelivery' ? 'Đã nghiệm thu' : order.currentStage}
                      </Badge>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Quick actions */}
        <Card>
          <Card.Header>
            <Card.Title>Hành động nhanh</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Tạo đơn hàng</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Thêm khách hàng</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Car className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Đăng ký xe</p>
              </button>

              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Xem báo cáo</p>
              </button>

              <Link to="/accounts" className="col-span-2">
                <button className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Quản lý tài khoản</p>
                </button>
              </Link>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;