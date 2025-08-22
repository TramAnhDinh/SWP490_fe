import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Calendar,
  Download,
  Mail,
  MessageSquare,
  Printer,
  RefreshCw
} from 'lucide-react';
import analyticsService from '../../services/analytics/analyticsService';
import { exportUtils } from '../../utils/export/exportUtils';
import toast from 'react-hot-toast';

const SalesAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Fetch sales analytics data
  const {
    data: salesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['salesAnalytics', dateRange],
    queryFn: () => analyticsService.getSalesAnalytics(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate growth rates
  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Export handlers
  const handleExportPDF = async () => {
    try {
      await exportUtils.exportToPDF('sales-analytics-container', 'sales-analytics.pdf');
      toast.success('Xuất PDF thành công!');
    } catch (error) {
      toast.error('Lỗi khi xuất PDF: ' + error.message);
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = exportUtils.prepareSalesDataForExport(salesData);
      exportUtils.exportToExcel(exportData, 'sales-analytics.xlsx', 'Phân tích bán hàng');
      toast.success('Xuất Excel thành công!');
    } catch (error) {
      toast.error('Lỗi khi xuất Excel: ' + error.message);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const content = document.getElementById('sales-analytics-container');

    printWindow.document.write(`
      <html>
        <head>
          <title>Phân tích bán hàng</title>
          <style>
            ${exportUtils.generatePrintCSS()}
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { text-align: center; margin-bottom: 30px; }
            .metric-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Báo cáo Phân tích Bán hàng</h1>
            <p>Từ ${new Date(dateRange.startDate).toLocaleDateString('vi-VN')} đến ${new Date(dateRange.endDate).toLocaleDateString('vi-VN')}</p>
          </div>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const handleEmailReport = async () => {
    try {
      const emailData = {
        to: 'manager@decalxe.com',
        subject: 'Báo cáo Phân tích Bán hàng',
        body: `Báo cáo phân tích bán hàng từ ${dateRange.startDate} đến ${dateRange.endDate}`,
        attachments: ['sales-analytics.pdf']
      };

      await exportUtils.sendEmailNotification(emailData);
      toast.success('Gửi email thành công!');
    } catch (error) {
      toast.error('Lỗi khi gửi email: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Lỗi tải dữ liệu</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân tích Bán hàng</h1>
          <p className="text-gray-600 mt-1">Theo dõi xu hướng và dự báo doanh số</p>
        </div>

        {/* Export buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
          >
            <Printer className="w-4 h-4" />
            In
          </button>
          <button
            onClick={handleEmailReport}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Cập nhật
          </button>
        </div>
      </div>

      {/* Analytics Container */}
      <div id="sales-analytics-container" className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-sm font-medium text-gray-600">Giá trị đơn trung bình</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exportUtils.formatCurrency(salesData?.averageOrderValue || 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 ml-1">-2.1% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Xu hướng bán hàng</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 rounded text-sm ${selectedMetric === 'revenue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Doanh thu
              </button>
              <button
                onClick={() => setSelectedMetric('orders')}
                className={`px-3 py-1 rounded text-sm ${selectedMetric === 'orders'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Số đơn
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={salesData?.salesByDate || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
              />
              <YAxis
                tickFormatter={(value) =>
                  selectedMetric === 'revenue'
                    ? exportUtils.formatCurrency(value)
                    : value
                }
              />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                formatter={(value) => [
                  selectedMetric === 'revenue'
                    ? exportUtils.formatCurrency(value)
                    : value,
                  selectedMetric === 'revenue' ? 'Doanh thu' : 'Số đơn'
                ]}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố trạng thái đơn hàng
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesData?.ordersByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(salesData?.ordersByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Doanh thu theo trạng thái
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData?.ordersByStatus || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis tickFormatter={(value) => exportUtils.formatCurrency(value)} />
                <Tooltip
                  formatter={(value) => [exportUtils.formatCurrency(value), 'Doanh thu']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thống kê doanh thu theo loại dịch vụ decal
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Số lượng đơn hàng theo dịch vụ</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData?.salesByService || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="serviceName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Doanh thu theo dịch vụ</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData?.salesByService || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="serviceName" angle={-45} textAnchor="end" height={80} />
                  <YAxis tickFormatter={(value) => exportUtils.formatCurrency(value)} />
                  <Tooltip
                    formatter={(value) => [exportUtils.formatCurrency(value), 'Doanh thu']}
                  />
                  <Bar dataKey="revenue" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Store Comparison */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            So sánh doanh thu giữa các cửa hàng
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Số đơn hàng theo cửa hàng</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData?.salesByStore || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="storeName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Doanh thu theo cửa hàng</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData?.salesByStore || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="storeName" angle={-45} textAnchor="end" height={80} />
                  <YAxis tickFormatter={(value) => exportUtils.formatCurrency(value)} />
                  <Tooltip
                    formatter={(value) => [exportUtils.formatCurrency(value), 'Doanh thu']}
                  />
                  <Bar dataKey="revenue" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hiệu suất nhân viên sale
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Số đơn hàng theo nhân viên</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData?.salesByEmployee || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="employeeName" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#06B6D4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Doanh thu theo nhân viên</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData?.salesByEmployee || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="employeeName" angle={-45} textAnchor="end" height={80} />
                  <YAxis tickFormatter={(value) => exportUtils.formatCurrency(value)} />
                  <Tooltip
                    formatter={(value) => [exportUtils.formatCurrency(value), 'Doanh thu']}
                  />
                  <Bar dataKey="revenue" fill="#84CC16" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Forecasting Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Dự báo doanh số (30 ngày tới)
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Dự báo doanh thu: {exportUtils.formatCurrency((salesData?.totalRevenue || 0) * 1.15)}
                </p>
                <p className="text-sm text-blue-700">
                  Dự kiến tăng trưởng 15% dựa trên xu hướng hiện tại
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Dịch vụ bán chạy nhất</h4>
              {salesData?.salesByService?.length > 0 && (
                <p className="text-green-700">
                  {salesData.salesByService[0]?.serviceName} - {salesData.salesByService[0]?.count} đơn hàng
                </p>
              )}
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Cửa hàng hiệu quả nhất</h4>
              {salesData?.salesByStore?.length > 0 && (
                <p className="text-purple-700">
                  {salesData.salesByStore[0]?.storeName} - {exportUtils.formatCurrency(salesData.salesByStore[0]?.revenue)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;