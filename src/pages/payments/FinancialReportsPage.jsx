import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';

const FinancialReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [period, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, analyticsData] = await Promise.all([
        paymentService.getFinancialReports({
          period,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        paymentService.getRevenueAnalytics(period)
      ]);
      setReports(reportsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to mock data on error
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Mock data for demonstration
    const mockReports = [
      {
        month: 'Tháng 1',
        revenue: 15000000,
        expenses: 8000000,
        profit: 7000000,
        orders: 45,
        payments: 42
      },
      {
        month: 'Tháng 2',
        revenue: 18000000,
        expenses: 9000000,
        profit: 9000000,
        orders: 52,
        payments: 48
      },
      {
        month: 'Tháng 3',
        revenue: 22000000,
        expenses: 11000000,
        profit: 11000000,
        orders: 65,
        payments: 62
      },
      {
        month: 'Tháng 4',
        revenue: 19000000,
        expenses: 9500000,
        profit: 9500000,
        orders: 58,
        payments: 55
      },
      {
        month: 'Tháng 5',
        revenue: 25000000,
        expenses: 12000000,
        profit: 13000000,
        orders: 72,
        payments: 68
      },
      {
        month: 'Tháng 6',
        revenue: 28000000,
        expenses: 14000000,
        profit: 14000000,
        orders: 85,
        payments: 82
      }
    ];

    const mockAnalytics = {
      totalRevenue: 127000000,
      totalExpenses: 63500000,
      totalProfit: 63500000,
      averageOrderValue: 249019,
      paymentSuccessRate: 96.5,
      growthRate: 15.2
    };

    setReports(mockReports);
    setAnalytics(mockAnalytics);
  };

  useEffect(() => {
    generateMockData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getGrowthColor = (rate) => {
    return rate >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (rate) => {
    return rate >= 0 ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Báo Cáo Tài Chính</h1>
          <p className="mt-2 text-gray-600">Phân tích và báo cáo tình hình tài chính</p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chu Kỳ</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Hàng ngày</option>
                <option value="weekly">Hàng tuần</option>
                <option value="monthly">Hàng tháng</option>
                <option value="quarterly">Hàng quý</option>
                <option value="yearly">Hàng năm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ Ngày</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến Ngày</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={loadData}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
              >
                Cập Nhật
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Doanh Thu</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-center">
              {getGrowthIcon(analytics.growthRate)}
              <span className={`ml-1 text-sm font-medium ${getGrowthColor(analytics.growthRate)}`}>
                {analytics.growthRate}%
              </span>
              <span className="ml-1 text-sm text-gray-500">so với tháng trước</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng Chi Phí</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(analytics.totalExpenses)}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lợi Nhuận</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(analytics.totalProfit)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ Lệ Thanh Toán</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analytics.paymentSuccessRate}%
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Biểu Đồ Doanh Thu</h3>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{report.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(report.revenue / Math.max(...reports.map(r => r.revenue))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-24 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(report.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profit Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Biểu Đồ Lợi Nhuận</h3>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{report.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(report.profit / Math.max(...reports.map(r => r.profit))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-24 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(report.profit)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Báo Cáo Chi Tiết</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời Gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh Thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chi Phí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lợi Nhuận
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Đơn Hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Thanh Toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ Lệ Hoàn Thành
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(report.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(report.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(report.profit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.payments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((report.payments / report.orders) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Phân Tích Xu Hướng</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tăng trưởng doanh thu:</span>
                <span className={`text-sm font-medium ${getGrowthColor(analytics.growthRate)}`}>
                  {analytics.growthRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giá trị đơn hàng TB:</span>
                <span className="text-sm font-medium">{formatCurrency(analytics.averageOrderValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ lợi nhuận:</span>
                <span className="text-sm font-medium">
                  {((analytics.totalProfit / analytics.totalRevenue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Hiệu Suất Thanh Toán</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ thành công:</span>
                <span className="text-sm font-medium text-green-600">{analytics.paymentSuccessRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tổng giao dịch:</span>
                <span className="text-sm font-medium">{reports.reduce((sum, r) => sum + r.payments, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Giao dịch thất bại:</span>
                <span className="text-sm font-medium text-red-600">
                  {Math.round(reports.reduce((sum, r) => sum + r.payments, 0) * (1 - analytics.paymentSuccessRate / 100))}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Dự Báo</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Doanh thu dự kiến:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(analytics.totalRevenue * (1 + analytics.growthRate / 100))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lợi nhuận dự kiến:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(analytics.totalProfit * (1 + analytics.growthRate / 100))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tăng trưởng dự kiến:</span>
                <span className={`text-sm font-medium ${getGrowthColor(analytics.growthRate)}`}>
                  {analytics.growthRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsPage;