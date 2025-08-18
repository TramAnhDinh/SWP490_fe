import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  Users,
  PieChart,
  DollarSign,
  ShoppingCart,
  Target,
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import analyticsService from '../services/analytics/analyticsService';
import { exportUtils } from '../utils/export/exportUtils';

const AnalyticsDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Fetch all analytics data
  const { 
    data: salesData, 
    isLoading: salesLoading 
  } = useQuery({
    queryKey: ['salesAnalytics'],
    queryFn: () => analyticsService.getSalesAnalytics(),
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: performanceData, 
    isLoading: performanceLoading 
  } = useQuery({
    queryKey: ['employeePerformance'],
    queryFn: () => analyticsService.getEmployeePerformance(),
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: customerData, 
    isLoading: customerLoading 
  } = useQuery({
    queryKey: ['customerInsights'],
    queryFn: () => analyticsService.getCustomerInsights(),
    staleTime: 5 * 60 * 1000,
  });

  const { 
    data: operationalData, 
    isLoading: operationalLoading 
  } = useQuery({
    queryKey: ['operationalMetrics'],
    queryFn: () => analyticsService.getOperationalMetrics(),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = salesLoading || performanceLoading || customerLoading || operationalLoading;

  // Calculate team performance summary
  const teamPerformanceSummary = React.useMemo(() => {
    if (!performanceData) return null;
    
    const activeEmployees = performanceData.filter(emp => emp.isActive);
    const totalRevenue = activeEmployees.reduce((sum, emp) => sum + emp.totalRevenue, 0);
    const totalOrders = activeEmployees.reduce((sum, emp) => sum + emp.totalOrders, 0);
    const averageCompletionRate = activeEmployees.reduce((sum, emp) => sum + emp.completionRate, 0) / activeEmployees.length;
    
    return {
      totalEmployees: activeEmployees.length,
      totalRevenue,
      totalOrders,
      averageCompletionRate: averageCompletionRate || 0,
    };
  }, [performanceData]);

  const analyticsCards = [
    {
      title: 'Phân tích Bán hàng',
      description: 'Xu hướng doanh số và dự báo',
      icon: TrendingUp,
      color: 'bg-blue-500',
      href: '/analytics/sales',
      metrics: [
        {
          label: 'Tổng doanh thu',
          value: exportUtils.formatCurrency(salesData?.totalRevenue || 0),
          change: '+12.5%'
        },
        {
          label: 'Tổng đơn hàng',
          value: salesData?.totalOrders || 0,
          change: '+8.2%'
        }
      ]
    },
    {
      title: 'Hiệu suất Nhân viên',
      description: 'Theo dõi và đánh giá hiệu suất',
      icon: Activity,
      color: 'bg-green-500',
      href: '/analytics/performance',
      metrics: [
        {
          label: 'Nhân viên hoạt động',
          value: teamPerformanceSummary?.totalEmployees || 0,
          change: 'Tốt'
        },
        {
          label: 'Tỷ lệ hoàn thành TB',
          value: exportUtils.formatPercentage(teamPerformanceSummary?.averageCompletionRate || 0),
          change: '+5.1%'
        }
      ]
    },
    {
      title: 'Thông tin Khách hàng',
      description: 'Phân tích hành vi khách hàng',
      icon: Users,
      color: 'bg-purple-500',
      href: '/analytics/customers',
      metrics: [
        {
          label: 'Tổng khách hàng',
          value: customerData?.totalCustomers || 0,
          change: '+5.2%'
        },
        {
          label: 'KH hoạt động',
          value: customerData?.activeCustomers || 0,
          change: 'Tốt'
        }
      ]
    },
    {
      title: 'Báo cáo Vận hành',
      description: 'Hiệu suất và chỉ số vận hành',
      icon: PieChart,
      color: 'bg-orange-500',
      href: '/analytics/operations',
      metrics: [
        {
          label: 'Tỷ lệ hoàn thành',
          value: exportUtils.formatPercentage(operationalData?.completionRate || 0),
          change: '+3.2%'
        },
        {
          label: 'Thời gian TB',
          value: operationalData?.averageProcessingTime ? 
            `${operationalData.averageProcessingTime.toFixed(1)} ngày` : '0 ngày',
          change: '-8%'
        }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích & Báo cáo</h1>
          <p className="text-gray-600 mt-1">Tổng quan về hiệu suất kinh doanh</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="1year">1 năm qua</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {exportUtils.formatCurrency(salesData?.totalRevenue || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+12.5% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {salesData?.totalOrders || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+8.2% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {customerData?.activeCustomers || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+5.2% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">
                {exportUtils.formatPercentage(operationalData?.completionRate || 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 ml-1">+3.2% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analyticsCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 ${card.color} rounded-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                </div>
                <Link
                  to={card.href}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {card.metrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-green-600">{metric.change}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/analytics/sales"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Phân tích bán hàng</p>
                <p className="text-sm text-gray-600">Xu hướng & dự báo</p>
              </div>
            </Link>
            
            <Link
              to="/analytics/performance"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Activity className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Hiệu suất nhân viên</p>
                <p className="text-sm text-gray-600">Đánh giá & theo dõi</p>
              </div>
            </Link>
            
            <Link
              to="/analytics/customers"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Thông tin khách hàng</p>
                <p className="text-sm text-gray-600">Hành vi & phân khúc</p>
              </div>
            </Link>
            
            <Link
              to="/analytics/operations"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <PieChart className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Báo cáo vận hành</p>
                <p className="text-sm text-gray-600">Hiệu suất & chỉ số</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;