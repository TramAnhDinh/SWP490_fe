import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
} from "recharts";
import {
  Users,
  Heart,
  ShoppingBag,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  Printer,
  RefreshCw,
  Filter,
  Search,
  Award,
  Clock,
} from "lucide-react";
import analyticsService from "../../services/analytics/analyticsService";
import { exportUtils } from "../../utils/export/exportUtils";
import toast from "react-hot-toast";

const CustomerInsights = () => {
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("all");

  // Fetch customer insights data
  const {
    data: customerData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customerInsights"],
    queryFn: () => analyticsService.getCustomerInsights(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter customers based on search and segment
  const filteredCustomers = React.useMemo(() => {
    if (!customerData?.topCustomers) return [];

    let filtered = customerData.topCustomers.filter((customer) => {
      const matchesSearch =
        searchTerm === "" ||
        `${customer.firstName} ${customer.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        customer.customerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesSegment = true;
      if (selectedSegment !== "all") {
        const segment = getCustomerSegment(customer.totalSpent);
        matchesSegment =
          segment.toLowerCase() === selectedSegment.toLowerCase();
      }

      return matchesSearch && matchesSegment;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "totalSpent":
          return b.totalSpent - a.totalSpent;
        case "totalOrders":
          return b.totalOrders - a.totalOrders;
        case "averageOrderValue":
          return b.averageOrderValue - a.averageOrderValue;
        case "lastOrderDate":
          return (
            new Date(b.lastOrderDate || 0) - new Date(a.lastOrderDate || 0)
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [customerData, searchTerm, selectedSegment, sortBy]);

  // Get customer segment based on spending
  const getCustomerSegment = (totalSpent) => {
    if (totalSpent > 10000000) return "High Value";
    if (totalSpent > 3000000) return "Medium Value";
    if (totalSpent > 0) return "Low Value";
    return "Inactive";
  };

  // Get segment color
  const getSegmentColor = (segment) => {
    switch (segment) {
      case "High Value":
        return "bg-green-100 text-green-800";
      case "Medium Value":
        return "bg-blue-100 text-blue-800";
      case "Low Value":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  // Export handlers
  const handleExportPDF = async () => {
    try {
      await exportUtils.exportToPDF(
        "customer-insights-container",
        "customer-insights.pdf"
      );
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      toast.error("Lỗi khi xuất PDF: " + error.message);
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = exportUtils.prepareCustomerDataForExport(customerData);
      exportUtils.exportToExcel(
        exportData,
        "customer-insights.xlsx",
        "Phân tích khách hàng"
      );
      toast.success("Xuất Excel thành công!");
    } catch (error) {
      toast.error("Lỗi khi xuất Excel: " + error.message);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const content = document.getElementById("customer-insights-container");

    printWindow.document.write(`
      <html>
        <head>
          <title>Báo cáo Phân tích Khách hàng</title>
          <style>
            ${exportUtils.generatePrintCSS()}
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Báo cáo Phân tích Khách hàng</h1>
            <p>Ngày tạo: ${new Date().toLocaleDateString("vi-VN")}</p>
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
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
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
          <h1 className="text-2xl font-bold text-gray-900">
            Phân tích Khách hàng
          </h1>
          <p className="text-gray-600 mt-1">
            Hiểu rõ hành vi và giá trị khách hàng
          </p>
        </div>

        {/* Export buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            <Download className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
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
              Tìm kiếm khách hàng
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, mã KH hoặc email..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân khúc
            </label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Tất cả phân khúc</option>
              <option value="high value">Giá trị cao</option>
              <option value="medium value">Giá trị trung bình</option>
              <option value="low value">Giá trị thấp</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp theo
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="totalSpent">Tổng chi tiêu</option>
              <option value="totalOrders">Số đơn hàng</option>
              <option value="averageOrderValue">Giá trị đơn TB</option>
              <option value="lastOrderDate">Đơn hàng gần nhất</option>
            </select>
          </div>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="w-4 h-4" />
            Cập nhật
          </button>
        </div>
      </div>

      {/* Customer Insights Container */}
      <div id="customer-insights-container" className="space-y-6">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng khách hàng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerData?.totalCustomers || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                +5.2% tháng này
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  KH hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {customerData?.activeCustomers || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                {customerData?.totalCustomers > 0
                  ? exportUtils.formatPercentage(
                      (customerData.activeCustomers /
                        customerData.totalCustomers) *
                        100
                    )
                  : "0%"}{" "}
                tỷ lệ hoạt động
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Giá trị KH TB
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {exportUtils.formatCurrency(
                    customerData?.averageCustomerValue || 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                +8.7% so với tháng trước
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top 10 KH</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exportUtils.formatCurrency(
                    customerData?.topCustomers
                      ?.slice(0, 10)
                      .reduce((sum, c) => sum + c.totalSpent, 0) || 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 ml-1">
                Khách hàng VIP
              </span>
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân khúc khách hàng
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerData?.customerSegments || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, count, totalValue }) =>
                    `${segment}: ${count} (${exportUtils.formatCurrency(
                      totalValue
                    )})`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count">
                  {(customerData?.customerSegments || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} khách hàng (${exportUtils.formatCurrency(
                      props.payload.totalValue
                    )})`,
                    "Số lượng",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Giá trị theo phân khúc
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerData?.customerSegments || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis
                  tickFormatter={(value) => exportUtils.formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value) => [
                    exportUtils.formatCurrency(value),
                    "Giá trị trung bình",
                  ]}
                />
                <Bar dataKey="averageValue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top khách hàng có giá trị cao
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customerData?.topCustomers?.slice(0, 6).map((customer, index) => (
              <div
                key={customer.customerID}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {customer.customerID}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(
                      getCustomerSegment(customer.totalSpent)
                    )}`}>
                    {getCustomerSegment(customer.totalSpent)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tổng chi tiêu:</span>
                    <span className="font-medium text-gray-900">
                      {exportUtils.formatCurrency(customer.totalSpent)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số đơn hàng:</span>
                    <span className="font-medium text-gray-900">
                      {customer.totalOrders}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đơn hàng TB:</span>
                    <span className="font-medium text-gray-900">
                      {exportUtils.formatCurrency(customer.averageOrderValue)}
                    </span>
                  </div>
                  {customer.lastOrderDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Đơn cuối:</span>
                      <span className="font-medium text-gray-900">
                        {exportUtils.formatDate(customer.lastOrderDate)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {customer.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.phoneNumber && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{customer.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Behavior Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phân tích hành vi khách hàng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-lg mb-3">
                <Heart className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                Khách hàng trung thành
              </h4>
              <p className="text-2xl font-bold text-green-600 mb-1">
                {customerData?.topCustomers?.filter((c) => c.totalOrders >= 5)
                  .length || 0}
              </p>
              <p className="text-sm text-gray-600">Có từ 5 đơn hàng trở lên</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-blue-50 rounded-lg mb-3">
                <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                Khách hàng thường xuyên
              </h4>
              <p className="text-2xl font-bold text-blue-600 mb-1">
                {customerData?.topCustomers?.filter(
                  (c) => c.totalOrders >= 2 && c.totalOrders < 5
                ).length || 0}
              </p>
              <p className="text-sm text-gray-600">Có từ 2-4 đơn hàng</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-yellow-50 rounded-lg mb-3">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Khách hàng mới</h4>
              <p className="text-2xl font-bold text-yellow-600 mb-1">
                {customerData?.topCustomers?.filter((c) => c.totalOrders === 1)
                  .length || 0}
              </p>
              <p className="text-sm text-gray-600">Chỉ có 1 đơn hàng</p>
            </div>
          </div>
        </div>

        {/* Customer Details Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Chi tiết khách hàng
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phân khúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng chi tiêu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá trị đơn TB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng cuối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.slice(0, 20).map((customer) => (
                  <tr key={customer.customerID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.customerID}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(
                          getCustomerSegment(customer.totalSpent)
                        )}`}>
                        {getCustomerSegment(customer.totalSpent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exportUtils.formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exportUtils.formatCurrency(customer.averageOrderValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.lastOrderDate
                        ? exportUtils.formatDate(customer.lastOrderDate)
                        : "Chưa có"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col gap-1">
                        {customer.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{customer.phoneNumber}</span>
                          </div>
                        )}
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

export default CustomerInsights;
