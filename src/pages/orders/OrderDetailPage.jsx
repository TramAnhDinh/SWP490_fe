import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Car,
  DollarSign,
} from "lucide-react";
import {
  useOrder,
  useDeleteOrder,
  useUpdateOrderStatus,
} from "../../hooks/useOrders";
import {
  useOrderStageHistories,
  useCreateOrderStageHistory,
  useUpdateOrderCurrentStage,
} from "../../hooks/useOrderStageHistories";
import OrderStageChangeModal from "../../components/ui/OrderStageChangeModal";
import { Button, Card, Badge, LoadingSpinner } from "../../components/common";
import { ORDER_STAGES, ORDER_PRIORITIES } from "../../constants/ui";
import { format } from "date-fns";
import OrderStageTimeline from "../../components/ui/OrderStageTimeline";

const ORDER_STAGES_LIST = [
  { value: "New", label: "Mới", stage: 1 },
  { value: "In Progress", label: "Đang xử lý", stage: 2 },
  { value: "Completed", label: "Hoàn thành", stage: 4 },
  { value: "Cancel", label: "Đã hủy" },
];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useOrder(id);
  const deleteOrderMutation = useDeleteOrder();
  const updateStatusMutation = useUpdateOrderStatus();
  const { data: stageHistories = [], isLoading: isStagesLoading } =
    useOrderStageHistories(id);
  const createStageMutation = useCreateOrderStageHistory();
  const updateCurrentStageMutation = useUpdateOrderCurrentStage();
  const [showStageModal, setShowStageModal] = React.useState(false);
  const [selectedStage, setSelectedStage] = React.useState(null);

  // Lấy trạng thái hiện tại từ order hoặc stageHistories
  const currentStage =
    order?.currentStage ||
    (stageHistories.length
      ? stageHistories[stageHistories.length - 1].stageName
      : "");

  // Khi click vào trạng thái
  const handleStageClick = (stage) => {
    setSelectedStage(stage);
    setShowStageModal(true);
  };

  // Khi xác nhận chuyển trạng thái
  const handleConfirmStage = async (
    notes,
    stageOverride,
    completionOverride
  ) => {
    setShowStageModal(false);
    if (!selectedStage || !order) return;
    const userDataString = localStorage.getItem("userData");
    let changedByEmployeeID = "SYSTEM"; // Giá trị mặc định nếu không tìm thấy employeeID

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // Lấy employeeID từ userData nếu tồn tại
        if (userData.employeeID) {
          changedByEmployeeID = userData.employeeID;
        } else {
          // Tùy chọn: Xử lý trường hợp userData có nhưng không có employeeID
          console.warn(
            "userData found but no employeeID. This might be a customer account."
          );
          // Bạn có thể log thêm thông tin userData.accountID nếu muốn
          // changedByEmployeeID = userData.accountID || 'SYSTEM'; // Sử dụng accountID hoặc giá trị mặc định khác
        }
      } catch (e) {
        console.error("Failed to parse userData from localStorage:", e);
        // Xử lý lỗi khi phân tích JSON nếu cần
      }
    } else {
      console.warn(
        "userData not found in localStorage. Using default 'SYSTEM'."
      );
    }

    // Nếu là In Progress, nhận stage và completionPercentage từ modal
    let stage = selectedStage.stage;
    let completionPercentage = undefined;
    if (
      selectedStage.value === "In Progress" &&
      stageOverride &&
      completionOverride !== undefined
    ) {
      stage = stageOverride;
      completionPercentage = completionOverride;
    }
    await createStageMutation.mutateAsync({
      stageName: selectedStage.value,
      orderID: order.orderID,

      changedByEmployeeID,
      notes,
      stage,
      ...(completionPercentage !== undefined ? { completionPercentage } : {}),
    });
  };

  const handleDeleteOrder = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      deleteOrderMutation.mutate(id, {
        onSuccess: () => {
          navigate("/orders");
        },
      });
    }
  };

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "primary";
      case "In Progress":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    return (
      ORDER_PRIORITIES[priority?.toUpperCase()]?.color ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getStageInfo = (stageName) => {
    return (
      Object.values(ORDER_STAGES).find(
        (stage) =>
          stage.label === stageName || stage.description.includes(stageName)
      ) || ORDER_STAGES.SURVEY
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // TODO: Fetch real stage history from API when available
  const stageHistory = [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <AlertCircle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy đơn hàng
        </h3>
        <p className="text-gray-600 mb-6">
          Đơn hàng với ID "{id}" không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/orders">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const stageInfo = getStageInfo(order.currentStage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {order.orderID}
            </h1>
            <p className="text-gray-600">
              Tạo ngày {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={getStatusColor(order.orderStatus)}>
            {order.orderStatus}
          </Badge>
          <Badge className={getPriorityColor(order.priority)}>
            {order.priority}
          </Badge>
          <Link to={`/orders/${order.orderID}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={handleDeleteOrder}
            disabled={deleteOrderMutation.isPending}>
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stepper trạng thái */}
          <Card>
            <Card.Header>
              <Card.Title>Trạng thái đơn hàng</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex gap-4 items-center">
                {ORDER_STAGES_LIST.map((stage, idx) => (
                  <button
                    key={stage.value}
                    className={`flex flex-col items-center px-3 py-2 rounded transition border-2 ${
                      currentStage === stage.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white"
                    } ${
                      createStageMutation.isPending ||
                      updateCurrentStageMutation.isPending
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }`}
                    onClick={() => handleStageClick(stage)}>
                    <span
                      className={`font-semibold ${
                        currentStage === stage.value
                          ? "text-blue-700"
                          : "text-gray-700"
                      }`}>
                      {stage.label}
                    </span>
                    <span className="text-xs text-gray-400">{stage.value}</span>
                  </button>
                ))}
              </div>
            </Card.Content>
          </Card>
          {/* Modal nhập notes khi chuyển trạng thái */}
          <OrderStageChangeModal
            isOpen={showStageModal}
            onClose={() => setShowStageModal(false)}
            onSubmit={handleConfirmStage}
            stageName={selectedStage?.label || ""}
          />

          {/* Customer Info */}
          {order.customerFullName && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Thông tin khách hàng
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tên khách hàng:</span>
                      <span className="font-medium">
                        {order.customerFullName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="font-mono">
                        {order.customerPhoneNumber}
                      </span>
                    </div>
                    {order.customerEmail && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{order.customerEmail}</span>
                      </div>
                    )}
                    {order.customerAddress && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Địa chỉ:</span>
                        <span className="text-right">
                          {order.customerAddress}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {order.accountCreated && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            Đã tạo
                          </span>
                        </div>
                      </div>
                    )}
                    {order.accountUsername && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Username:</span>
                        <span className="font-mono">
                          {order.accountUsername}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Mã khách hàng:</span>
                      <span className="font-mono">{order.customerID}</span>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Order Info */}
          <Card>
            <Card.Header>
              <Card.Title>Thông tin đơn hàng</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Chi tiết cơ bản
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-mono">{order.orderID}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span>
                        {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <Badge
                        variant={getStatusColor(order.orderStatus)}
                        size="sm">
                        {order.orderStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Độ ưu tiên:</span>
                      <Badge
                        className={getPriorityColor(order.priority)}
                        size="sm">
                        {order.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="text-lg font-semibold text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    {order.description && (
                      <div className="flex items-start justify-between">
                        <span className="text-gray-600">Mô tả:</span>
                        <span className="text-right max-w-xs">
                          {order.description}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Thời gian</h4>
                  <div className="space-y-3">
                    {order.expectedArrivalTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dự kiến đến:</span>
                        <span>
                          {format(
                            new Date(order.expectedArrivalTime),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                      </div>
                    )}

                    {order.isCustomDecal && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Loại:</span>
                        <Badge variant="warning" size="sm">
                          Decal tùy chỉnh
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Thông tin phương tiện
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Xe</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">
                        {order.vehicleModelName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Hãng:</span>
                      <span>{order.vehicleBrandName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Số khung:</span>
                      <span className="font-mono text-sm">
                        {order.chassisNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">ID phương tiện:</span>
                      <span className="font-mono text-sm">
                        {order.vehicleID}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Progress Timeline */}
          <Card>
            <Card.Header>
              <Card.Title>Tiến độ thực hiện</Card.Title>
            </Card.Header>
            <Card.Content>
              {isStagesLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="animate-spin h-4 w-4" /> Đang tải tiến độ...
                </div>
              ) : (
                <OrderStageTimeline histories={stageHistories} />
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Employee */}
          {order.assignedEmployeeFullName && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Nhân viên phụ trách
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {order.assignedEmployeeFullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.assignedEmployeeID}
                  </p>

                  <div className="mt-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Gọi điện
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Gửi email
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Hành động nhanh</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Xem chi tiết đơn hàng
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Phân công nhân viên
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Cập nhật lịch trình
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Xem thanh toán
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
