import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award, 
  Target,
  Calendar,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { formatUtils } from '../../utils/formatUtils';

const PerformanceTrackingPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedStore, setSelectedStore] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Get data
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getEmployees(),
  });

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: employeeService.getStores,
  });

  const { data: performanceData = [], isLoading: performanceLoading } = useQuery({
    queryKey: ['employeePerformance', selectedPeriod],
    queryFn: () => employeeService.getEmployeeStats({ period: selectedPeriod }),
  });

  // Filter employees based on search and store
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStore = selectedStore === '' || employee.storeID === selectedStore;
      
      return matchesSearch && matchesStore && employee.isActive;
    });
  }, [employees, searchTerm, selectedStore]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!performanceData || performanceData.length === 0) {
      return {
        totalEmployees: filteredEmployees.length,
        averagePerformance: 0,
        topPerformers: 0,
        improvementNeeded: 0
      };
    }

    const activeEmployees = performanceData.filter(emp => emp.isActive);
    const totalScore = activeEmployees.reduce((sum, emp) => sum + (emp.performanceScore || 0), 0);
    const averageScore = activeEmployees.length > 0 ? totalScore / activeEmployees.length : 0;
    
    return {
      totalEmployees: activeEmployees.length,
      averagePerformance: averageScore,
      topPerformers: activeEmployees.filter(emp => (emp.performanceScore || 0) >= 80).length,
      improvementNeeded: activeEmployees.filter(emp => (emp.performanceScore || 0) < 60).length
    };
  }, [performanceData, filteredEmployees]);

  // Mock performance data for demonstration
  const mockPerformanceData = useMemo(() => {
    return filteredEmployees.map(employee => {
      const baseScore = Math.random() * 40 + 50; // 50-90
      const ordersCompleted = Math.floor(Math.random() * 50) + 10;
      const customerRating = Math.random() * 2 + 3; // 3-5
      const onTimeDelivery = Math.random() * 30 + 70; // 70-100%
      
      return {
        ...employee,
        performanceScore: Math.round(baseScore),
        ordersCompleted,
        customerRating: Math.round(customerRating * 10) / 10,
        onTimeDelivery: Math.round(onTimeDelivery),
        revenue: ordersCompleted * (Math.random() * 200000 + 100000),
        productivity: Math.round(Math.random() * 30 + 70),
        quality: Math.round(Math.random() * 20 + 75),
        improvement: Math.round((Math.random() - 0.5) * 20) // -10 to +10
      };
    });
  }, [filteredEmployees, selectedPeriod]);

  // Performance trends data
  const trendData = [
    { period: 'T1', score: 72 },
    { period: 'T2', score: 75 },
    { period: 'T3', score: 78 },
    { period: 'T4', score: 82 },
    { period: 'T5', score: 79 },
    { period: 'T6', score: 85 }
  ];

  const handleExportPerformance = () => {
    // Mock export functionality
    const csvContent = [
      ['Tên nhân viên', 'Điểm hiệu suất', 'Đơn hoàn thành', 'Đánh giá KH', 'Doanh thu', 'Năng suất'].join(','),
      ...mockPerformanceData.map(emp => [
        `${emp.firstName} ${emp.lastName}`,
        emp.performanceScore,
        emp.ordersCompleted,
        emp.customerRating,
        formatUtils.formatCurrency(emp.revenue),
        `${emp.productivity}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi hiệu suất nhân viên</h1>
          <p className="text-gray-600 mt-1">Phân tích và đánh giá hiệu suất làm việc của nhân viên</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExportPerformance}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="min-w-48">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={storesLoading}
            >
              <option value="">Tất cả cửa hàng</option>
              {stores.map(store => (
                <option key={store.storeID} value={store.storeID}>
                  {store.storeName}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-32">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm này</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Đang hoạt động</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Điểm TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(performanceMetrics.averagePerformance)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+5.2%</span>
            <span className="text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Xuất sắc</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.topPerformers}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Điểm ≥ 80</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cần cải thiện</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.improvementNeeded}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Điểm &lt; 60</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Xu hướng hiệu suất</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Simple trend visualization */}
          <div className="space-y-4">
            {trendData.map((data, index) => (
              <div key={data.period} className="flex items-center gap-4">
                <div className="w-8 text-sm text-gray-600">{data.period}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${data.score}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900">{data.score}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Điểm hiệu suất trung bình theo thời gian (%)
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top nhân viên</h3>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {mockPerformanceData
              .sort((a, b) => b.performanceScore - a.performanceScore)
              .slice(0, 5)
              .map((employee, index) => (
                <div key={employee.employeeID} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {employee.ordersCompleted} đơn hoàn thành
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {employee.performanceScore}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chi tiết hiệu suất nhân viên</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm hiệu suất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hoàn thành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá KH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Năng suất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xu hướng
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeesLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Đang tải dữ liệu hiệu suất...</p>
                  </td>
                </tr>
              ) : mockPerformanceData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu hiệu suất
                  </td>
                </tr>
              ) : (
                mockPerformanceData.map(employee => (
                  <tr key={employee.employeeID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {stores.find(s => s.storeID === employee.storeID)?.storeName || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-bold text-gray-900 mr-2">
                          {employee.performanceScore}
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.performanceScore >= 80 
                            ? 'bg-green-100 text-green-800' 
                            : employee.performanceScore >= 60 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.performanceScore >= 80 ? 'Xuất sắc' : 
                           employee.performanceScore >= 60 ? 'Tốt' : 'Cần cải thiện'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-900">{employee.ordersCompleted}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{employee.customerRating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatUtils.formatCurrency(employee.revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${employee.productivity}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{employee.productivity}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center text-sm ${
                        employee.improvement > 0 ? 'text-green-600' : 
                        employee.improvement < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {employee.improvement > 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : employee.improvement < 0 ? (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        ) : (
                          <Activity className="w-4 h-4 mr-1" />
                        )}
                        {employee.improvement > 0 ? '+' : ''}{employee.improvement}%
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Điểm hiệu suất cao nhất:</span>
              <span className="font-medium text-gray-900">
                {Math.max(...mockPerformanceData.map(e => e.performanceScore))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Điểm hiệu suất thấp nhất:</span>
              <span className="font-medium text-gray-900">
                {Math.min(...mockPerformanceData.map(e => e.performanceScore))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng đơn hàng hoàn thành:</span>
              <span className="font-medium text-gray-900">
                {mockPerformanceData.reduce((sum, e) => sum + e.ordersCompleted, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng doanh thu:</span>
              <span className="font-medium text-gray-900">
                {formatUtils.formatCurrency(mockPerformanceData.reduce((sum, e) => sum + e.revenue, 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Khuyến nghị</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <span>Tổ chức đào tạo kỹ năng cho {performanceMetrics.improvementNeeded} nhân viên có điểm thấp</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <span>Thiết lập chương trình mentor cho nhân viên mới</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <span>Khen thưởng {performanceMetrics.topPerformers} nhân viên xuất sắc để động viên</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <span>Xem xét điều chỉnh mục tiêu và KPI cho từng vị trí</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrackingPage;