import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  BarChart3,
  Activity,
  Calendar,
  Timer,
  Download,
  Mail,
  Printer,
  RefreshCw,
  Filter,
  Settings,
  Zap,
  Gauge,
} from "lucide-react";
import analyticsService from "../../services/analytics/analyticsService";
import { exportUtils } from "../../utils/export/exportUtils";
import toast from "react-hot-toast";

const OperationalReports = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [selectedMetric, setSelectedMetric] = useState("efficiency");
  const [showDetails, setShowDetails] = useState(false);

  // Fetch operational metrics data
  const {
    data: operationalData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["operationalMetrics"],
    queryFn: () => analyticsService.getOperationalMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate efficiency score
  const calculateEfficiencyScore = (data) => {
    if (!data) return 0;

    const completionWeight = 0.4;
    const timeWeight = 0.3;
    const utilizationWeight = 0.3;

    const completionScore = data.completionRate || 0;
    const timeScore =
      data.averageProcessingTime > 0
        ? Math.max(0, 100 - (data.averageProcessingTime - 5) * 5)
        : 100; // Ideal: 5 days
    const utilizationScore =
      data.totalEmployees > 0
        ? (data.activeEmployees / data.totalEmployees) * 100
        : 0;

    return Math.round(
      completionScore * completionWeight +
        timeScore * timeWeight +
        utilizationScore * utilizationWeight
    );
  };

  // Get efficiency color
  const getEfficiencyColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Get stage color
  const getStageColor = (stage) => {
    const stageColors = {
      Pending: "bg-yellow-100 text-yellow-800",
      InProgress: "bg-blue-100 text-blue-800",
      Design: "bg-purple-100 text-purple-800",
      Production: "bg-orange-100 text-orange-800",
      QualityCheck: "bg-indigo-100 text-indigo-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return stageColors[stage] || "bg-gray-100 text-gray-800";
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
        "operational-reports-container",
        "operational-reports.pdf"
      );
      toast.success("Xuất PDF thành công!");
    } catch (error) {
      toast.error("Lỗi khi xuất PDF: " + error.message);
    }
  };

  const handleExportExcel = () => {
    try {
      const exportData = [
        {
          "Chỉ số": "Tổng đơn hàng",
          "Giá trị": operationalData?.totalOrders || 0,
          "Đơn vị": "đơn",
        },
        {
          "Chỉ số": "Đơn hoàn thành",
          "Giá trị": operationalData?.completedOrders || 0,
          "Đơn vị": "đơn",
        },
        {
          "Chỉ số": "Tỷ lệ hoàn thành",
          "Giá trị": operationalData?.completionRate || 0,
          "Đơn vị": "%",
        },
        {
          "Chỉ số": "Thời gian xử lý trung bình",
          "Giá trị": operationalData?.averageProcessingTime || 0,
          "Đơn vị": "ngày",
        },
        {
          "Chỉ số": "Nhân viên hoạt động",
          "Giá trị": operationalData?.activeEmployees || 0,
          "Đơn vị": "người",
        },
        {
          "Chỉ số": "Điểm hiệu suất",
          "Giá trị": calculateEfficiencyScore(operationalData),
          "Đơn vị": "điểm",
        },
      ];

      exportUtils.exportToExcel(
        exportData,
        "operational-reports.xlsx",
        "Báo cáo vận hành"
      );
      toast.success("Xuất Excel thành công!");
    } catch (error) {
      toast.error("Lỗi khi xuất Excel: " + error.message);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const content = document.getElementById("operational-reports-container");

    printWindow.document.write(`
      <html>
        <head>
          <title>Báo cáo Vận hành</title>
          <style>
            ${exportUtils.generatePrintCSS()}
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h1>Báo cáo Vận hành</h1>
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

  const efficiencyScore = calculateEfficiencyScore(operationalData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo Vận hành</h1>
          <p className="text-gray-600 mt-1">
            Theo dõi hiệu suất và chỉ số vận hành
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

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoảng thời gian
            </label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="90days">90 ngày qua</option>
              <option value="1year">1 năm qua</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chỉ số chính
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="efficiency">Hiệu suất tổng thể</option>
              <option value="completion">Tỷ lệ hoàn thành</option>
              <option value="processing_time">Thời gian xử lý</option>
              <option value="utilization">Tỷ lệ sử dụng nhân lực</option>
            </select>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Settings className="w-4 h-4" />
            {showDetails ? "Ẩn chi tiết" : "Hiện chi tiết"}
          </button>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <RefreshCw className="w-4 h-4" />
            Cập nhật
          </button>
        </div>
      </div>

      {/* Operational Reports Container */}
      <div id="operational-reports-container" className="space-y-6">
        {/* Efficiency Score Dashboard */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Bảng điều khiển hiệu suất
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Efficiency Score */}
            <div className="col-span-1 lg:col-span-1">
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getEfficiencyColor(
                    efficiencyScore
                  )} mb-4`}>
                  <Gauge className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Điểm hiệu suất tổng thể
                </h4>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {efficiencyScore}
                </p>
                <p className="text-sm text-gray-600">
                  {efficiencyScore >= 80
                    ? "Xuất sắc"
                    : efficiencyScore >= 60
                    ? "Tốt"
                    : "Cần cải thiện"}
                </p>
              </div>
            </div>

            {/* Efficiency Breakdown */}
            <div className="col-span-1 lg:col-span-2">
              <h5 className="font-medium text-gray-900 mb-4">
                Phân tích chi tiết
              </h5>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tỷ lệ hoàn thành</span>
                    <span className="font-medium">
                      {exportUtils.formatPercentage(
                        operationalData?.completionRate || 0
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${operationalData?.completionRate || 0}%`,
                      }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Hiệu suất thời gian</span>
                    <span className="font-medium">
                      {operationalData?.averageProcessingTime
                        ? `${operationalData.averageProcessingTime.toFixed(
                            1
                          )} ngày`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            (10 -
                              (operationalData?.averageProcessingTime || 0)) *
                              10
                          )
                        )}%`,
                      }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      Tỷ lệ sử dụng nhân lực
                    </span>
                    <span className="font-medium">
                      {operationalData?.totalEmployees > 0
                        ? exportUtils.formatPercentage(
                            (operationalData.activeEmployees /
                              operationalData.totalEmployees) *
                              100
                          )
                        : "0%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${
                          operationalData?.totalEmployees > 0
                            ? (operationalData.activeEmployees /
                                operationalData.totalEmployees) *
                              100
                            : 0
                        }%`,
                      }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng đơn hàng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {operationalData?.totalOrders || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                +12% tháng này
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Đơn hoàn thành
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {operationalData?.completedOrders || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                {exportUtils.formatPercentage(
                  operationalData?.completionRate || 0
                )}{" "}
                tỷ lệ
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-gray-900">
                  {operationalData?.inProgressOrders || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600 ml-1">Đang tiến hành</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Thời gian TB
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {operationalData?.averageProcessingTime
                    ? `${operationalData.averageProcessingTime.toFixed(1)}`
                    : "0"}
                </p>
                <p className="text-xs text-gray-500">ngày</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Timer className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                -8% so với tháng trước
              </span>
            </div>
          </div>
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
                  data={[
                    {
                      name: "Hoàn thành",
                      value: operationalData?.completedOrders || 0,
                      color: "#10B981",
                    },
                    {
                      name: "Đang xử lý",
                      value: operationalData?.inProgressOrders || 0,
                      color: "#F59E0B",
                    },
                    {
                      name: "Chờ xử lý",
                      value: operationalData?.pendingOrders || 0,
                      color: "#EF4444",
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {[
                    {
                      name: "Hoàn thành",
                      value: operationalData?.completedOrders || 0,
                      color: "#10B981",
                    },
                    {
                      name: "Đang xử lý",
                      value: operationalData?.inProgressOrders || 0,
                      color: "#F59E0B",
                    },
                    {
                      name: "Chờ xử lý",
                      value: operationalData?.pendingOrders || 0,
                      color: "#EF4444",
                    },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Đơn hàng theo giai đoạn
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={operationalData?.ordersByStage || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Time Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phân tích thời gian xử lý
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-lg mb-3">
                <Zap className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Xử lý nhanh</h4>
              <p className="text-2xl font-bold text-green-600 mb-1">
                {operationalData?.processingTimes?.filter(
                  (pt) => pt.processingDays && pt.processingDays <= 3
                ).length || 0}
              </p>
              <p className="text-sm text-gray-600">≤ 3 ngày</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-yellow-50 rounded-lg mb-3">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                Xử lý bình thường
              </h4>
              <p className="text-2xl font-bold text-yellow-600 mb-1">
                {operationalData?.processingTimes?.filter(
                  (pt) =>
                    pt.processingDays &&
                    pt.processingDays > 3 &&
                    pt.processingDays <= 7
                ).length || 0}
              </p>
              <p className="text-sm text-gray-600">4-7 ngày</p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-red-50 rounded-lg mb-3">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Xử lý chậm</h4>
              <p className="text-2xl font-bold text-red-600 mb-1">
                {operationalData?.processingTimes?.filter(
                  (pt) => pt.processingDays && pt.processingDays > 7
                ).length || 0}
              </p>
              <p className="text-sm text-gray-600"> 7 ngày</p>
            </div>
          </div>
        </div>

        {/* Team Utilization */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tỷ lệ sử dụng nhân lực
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Nhân viên hoạt động
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {operationalData?.activeEmployees || 0} /{" "}
                  {operationalData?.totalEmployees || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{
                    width: `${
                      operationalData?.totalEmployees > 0
                        ? (operationalData.activeEmployees /
                            operationalData.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}></div>
              </div>
              <p className="text-sm text-gray-600">
                {operationalData?.totalEmployees > 0
                  ? exportUtils.formatPercentage(
                      (operationalData.activeEmployees /
                        operationalData.totalEmployees) *
                        100
                    )
                  : "0%"}{" "}
                tỷ lệ sử dụng
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="p-4 bg-blue-50 rounded-full mb-3 inline-block">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">
                  Hiệu suất nhân lực
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {operationalData?.totalEmployees > 0 &&
                  operationalData?.totalOrders > 0
                    ? `${(
                        operationalData.totalOrders /
                        operationalData.activeEmployees
                      ).toFixed(1)} đơn/người`
                    : "0 đơn/người"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Processing Times Table */}
        {showDetails && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết thời gian xử lý đơn hàng
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày dự kiến
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian xử lý
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giai đoạn
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {operationalData?.processingTimes
                    ?.slice(0, 20)
                    .map((item) => (
                      <tr key={item.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exportUtils.formatDate(item.orderDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.expectedArrival
                            ? exportUtils.formatDate(item.expectedArrival)
                            : "Chưa xác định"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.processingDays
                            ? `${item.processingDays} ngày`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(
                              item.status
                            )}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.currentStage}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Recommendations */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Khuyến nghị cải thiện
          </h3>
          <div className="space-y-4">
            {efficiencyScore < 60 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Hiệu suất thấp</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Cần cải thiện quy trình và tăng cường đào tạo nhân viên để
                    nâng cao hiệu suất.
                  </p>
                </div>
              </div>
            )}

            {operationalData?.averageProcessingTime > 7 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    Thời gian xử lý chậm
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Thời gian xử lý trung bình vượt quá mức khuyến nghị. Cần tối
                    ưu hóa quy trình.
                  </p>
                </div>
              </div>
            )}

            {operationalData?.totalEmployees > 0 &&
              operationalData.activeEmployees / operationalData.totalEmployees <
                0.8 && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">
                      Tỷ lệ sử dụng nhân lực thấp
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Có thể tăng hiệu quả bằng cách phân bổ công việc hợp lý
                      hơn cho nhân viên.
                    </p>
                  </div>
                </div>
              )}

            {efficiencyScore >= 80 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Hiệu suất tốt</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Hệ thống đang hoạt động hiệu quả. Tiếp tục duy trì và cải
                    thiện liên tục.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalReports;
