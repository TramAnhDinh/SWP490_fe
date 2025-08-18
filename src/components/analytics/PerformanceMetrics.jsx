import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  Users, 
  Award, 
  Target, 
  TrendingUp,
  Star,
  Clock,
  DollarSign,
  Activity,
  Download,
  Mail,
  Printer,
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';
import analyticsService from '../../services/analytics/analyticsService';
import { exportUtils } from '../../utils/export/exportUtils';
import toast from 'react-hot-toast';

const PerformanceMetrics = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortBy, setSortBy] = useState('totalRevenue');
  const [filterRole, setFilterRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employee performance data
  const { 
    data: performanceData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['employeePerformance'],
    queryFn: () => analyticsService.getEmployeePerformance(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter and sort data
  const filteredAndSortedData = React.useMemo(() => {
    if (!performanceData) return [];
    
    let filtered = performanceData.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeID.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || 
        employee.accountRoleName?.toLowerCase() === filterRole.toLowerCase();
      
      return matchesSearch && matchesRole && employee.isActive;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'totalRevenue':
          return b.totalRevenue - a.totalRevenue;
        case 'totalOrders':
          return b.totalOrders - a.totalOrders;
        case 'completionRate':
          return b.completionRate - a.completionRate;
        case 'averageOrderValue':
          return b.averageOrderValue - a.averageOrderValue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [performanceData, sortBy, filterRole, searchTerm]);

  // Get top performers
  const topPerformers = React.useMemo(() => {
    if (!filteredAndSortedData.length) return [];
    return filteredAndSortedData.slice(0, 5);
  }, [filteredAndSortedData]);

  // Calculate team statistics
  const teamStats = React.useMemo(() => {
    if (!performanceData) return {};
    
    const activeEmployees = performanceData.filter(emp => emp.isActive);
    const totalRevenue = activeEmployees.reduce((sum, emp) => sum + emp.totalRevenue, 0);
    const totalOrders = activeEmployees.reduce((sum, emp) => sum + emp.totalOrders, 0);
    const averageCompletionRate = activeEmployees.reduce((sum, emp) => sum + emp.completionRate, 0) / activeEmployees.length;
    
    return {
      totalEmployees: activeEmployees.length,
      totalRevenue,
      totalOrders,
      averageCompletionRate: averageCompletionRate || 0,
      averageRevenuePerEmployee: totalRevenue / activeEmployees.length || 0
    };
  }, [performanceData]);

  // Export handlers
  const handleExportPDF = async () => {
    try {
      await exportUtils.exportToPDF('performance-metrics-container', 'employee-performance.pdf');
      toast.success('Xuất PDF thành công!');
    } catch (error) {
      toast.error('Lỗi khi xuất PDF: ' + error.message);
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = exportUtils.prepareEmployeeDataForExport(filteredAndSortedData);
      exportUtils.exportToExcel(exportData, 'employee-performance.xlsx', 'Hiệu suất nhân viên');
      toast.success('Xuất Excel thành công!');
    } catch (error) {
      toast.error('Lỗi khi xuất Excel: ' + error.message);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const content = document.getElementById('performance-metrics-container');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Báo cáo Hiệu suất Nhân viên</title>
          <style>
            ${exportUtils.generatePrintCSS()}
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { text-align: center; margin-bottom: 30px; }
            .metric-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Báo cáo Hiệu suất Nhân viên</h1>
            <p>Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          ${content.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
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
          <h1 className="text-2xl font-bold text-gray-900">Hiệu suất Nhân viên</h1>
          <p className="text-gray-600 mt-1">Theo dõi và đánh giá hiệu suất làm việc</p>
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
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm nhân viên
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hoặc mã nhân viên..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="sales">Sales</option>
              <option value="technician">Technician</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp theo
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="totalRevenue">Doanh thu</option>
              <option value="totalOrders">Số đơn hàng</option>
              <option value="completionRate">Tỷ lệ hoàn thành</option>
              <option value="averageOrderValue">Giá trị đơn TB</option>
            </select>
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

      {/* Performance Container */}
      <div id="performance-metrics-container" className="space-y-6">
        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamStats.totalEmployees || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exportUtils.formatCurrency(teamStats.totalRevenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teamStats.totalOrders || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exportUtils.formatPercentage(teamStats.averageCompletionRate || 0)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Nhân viên xuất sắc
          </h3>
          <div className="space-y-4">
            {topPerformers.map((employee, index) => (
              <div 
                key={employee.employeeID}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedEmployee(employee)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {employee.accountRoleName} - {employee.storeName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {exportUtils.formatCurrency(employee.totalRevenue)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {employee.totalOrders} đơn hàng ({exportUtils.formatPercentage(employee.completionRate)})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Employee */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Doanh thu theo nhân viên
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPerformers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="firstName" 
                  tickFormatter={(value, index) => 
                    topPerformers[index] ? `${value} ${topPerformers[index].lastName}` : value
                  }
                />
                <YAxis tickFormatter={(value) => exportUtils.formatCurrency(value)} />
                <Tooltip 
                  formatter={(value) => [exportUtils.formatCurrency(value), 'Doanh thu']}
                  labelFormatter={(label, payload) => 
                    payload?.[0]?.payload ? 
                      `${payload[0].payload.firstName} ${payload[0].payload.lastName}` : 
                      label
                  }
                />
                <Bar dataKey="totalRevenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate vs Orders */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tỷ lệ hoàn thành vs Số đơn hàng
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={filteredAndSortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="totalOrders" 
                  name="Số đơn hàng"
                />
                <YAxis 
                  type="number" 
                  dataKey="completionRate" 
                  name="Tỷ lệ hoàn thành"
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    name === 'completionRate' ? `${value.toFixed(1)}%` : value,
                    name === 'completionRate' ? 'Tỷ lệ hoàn thành' : 'Số đơn hàng'
                  ]}
                  labelFormatter={(label, payload) => 
                    payload?.[0]?.payload ? 
                      `${payload[0].payload.firstName} ${payload[0].payload.lastName}` : 
                      label
                  }
                />
                <Scatter dataKey="completionRate" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Performance Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Chi tiết hiệu suất nhân viên
            </h3>
          </div>
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
                    Tổng đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hoàn thành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ hoàn thành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị đơn TB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedData.map((employee) => (
                  <tr key={employee.employeeID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.employeeID}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {employee.accountRoleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.completedOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${employee.completionRate}%` }}
                          ></div>
                        </div>
                        <span>{exportUtils.formatPercentage(employee.completionRate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exportUtils.formatCurrency(employee.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exportUtils.formatCurrency(employee.averageOrderValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {employee.completionRate >= 90 ? (
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        ) : employee.completionRate >= 75 ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <Activity className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="ml-1">
                          {employee.completionRate >= 90 ? 'Xuất sắc' : 
                           employee.completionRate >= 75 ? 'Tốt' : 'Trung bình'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;