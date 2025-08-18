import React, { useState } from "react";
import { useOrderTracking } from "../../hooks/useOrders";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Badge from "../../components/common/Badge";

const OrderTrackingPage = () => {
  const [searchParams, setSearchParams] = useState({
    orderId: "",
    customerPhone: "",
    licensePlate: "",
  });

  const {
    data: trackingData,
    isLoading,
    error,
    refetch,
  } = useOrderTracking(
    searchParams.orderId,
    searchParams.customerPhone,
    searchParams.licensePlate
  );

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "on hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStageColor = (stage) => {
    switch (stage?.toLowerCase()) {
      case "new profile":
        return "bg-blue-100 text-blue-800";
      case "design":
        return "bg-purple-100 text-purple-800";
      case "production":
        return "bg-orange-100 text-orange-800";
      case "quality check":
        return "bg-yellow-100 text-yellow-800";
      case "installation":
        return "bg-indigo-100 text-indigo-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Theo dõi đơn hàng
        </h1>
        <p className="text-gray-600">
          Tìm kiếm và theo dõi trạng thái đơn hàng
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tìm kiếm đơn hàng</h2>
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Mã đơn hàng"
              placeholder="Nhập mã đơn hàng"
              value={searchParams.orderId}
              onChange={(e) => handleInputChange("orderId", e.target.value)}
            />
            <Input
              label="Số điện thoại"
              placeholder="Nhập số điện thoại khách hàng"
              value={searchParams.customerPhone}
              onChange={(e) =>
                handleInputChange("customerPhone", e.target.value)
              }
            />
            <Input
              label="Biển số xe"
              placeholder="Nhập biển số xe"
              value={searchParams.licensePlate}
              onChange={(e) =>
                handleInputChange("licensePlate", e.target.value)
              }
            />
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tìm..." : "Tìm kiếm"}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Results */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <Card>
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              Lỗi tìm kiếm
            </h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </Card>
      )}

      {trackingData && trackingData.length === 0 && !isLoading && (
        <Card>
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-gray-500">
              Vui lòng kiểm tra lại thông tin tìm kiếm
            </p>
          </div>
        </Card>
      )}

      {trackingData && trackingData.length > 0 && (
        <div className="space-y-6">
          {trackingData.map((order) => (
            <Card key={order.orderID}>
              <div className="p-6">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Đơn hàng #{order.orderID}
                    </h3>
                    <p className="text-gray-600">
                      Ngày tạo:{" "}
                      {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                    <Badge className={getStageColor(order.currentStage)}>
                      {order.currentStage}
                    </Badge>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Thông tin khách hàng
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Tên:</span>{" "}
                        {order.customerName}
                      </p>
                      <p>
                        <span className="font-medium">SĐT:</span>{" "}
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Thông tin xe
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Biển số:</span>{" "}
                        {order.licensePlate || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Hãng:</span>{" "}
                        {order.vehicleBrand || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Dòng:</span>{" "}
                        {order.vehicleModel || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Thông tin đơn hàng
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Cửa hàng:</span>{" "}
                        {order.storeName || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Nhân viên:</span>{" "}
                        {order.assignedEmployeeName || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Tổng tiền:</span>{" "}
                        {order.totalAmount?.toLocaleString("vi-VN")} VNĐ
                      </p>
                      <p>
                        <span className="font-medium">Đã thanh toán:</span>{" "}
                        {order.paidAmount?.toLocaleString("vi-VN")} VNĐ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage History */}
                {order.stageHistory && order.stageHistory.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Lịch sử tiến độ
                    </h4>
                    <div className="space-y-2">
                      {order.stageHistory
                        .sort(
                          (a, b) =>
                            new Date(b.stageDate) - new Date(a.stageDate)
                        )
                        .map((stage, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {stage.stageName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(stage.stageDate).toLocaleString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                            {stage.notes && (
                              <p className="text-xs text-gray-600">
                                {stage.notes}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Order Details */}
                {order.orderDetails && order.orderDetails.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Chi tiết dịch vụ
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dịch vụ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Số lượng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đơn giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.orderDetails.map((detail, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {detail.decalServiceName ||
                                  detail.decalTypeName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {detail.quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {detail.unitPrice?.toLocaleString("vi-VN")} VNĐ
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {detail.totalPrice?.toLocaleString("vi-VN")} VNĐ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
