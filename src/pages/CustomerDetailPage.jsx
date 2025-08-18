import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Car,
  FileText,
  Clock,
  Eye,
  ExternalLink
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../components/common';
import { customerService } from '../services/customers';
import { orderService } from '../services/orderService';
import { useCustomerVehicles } from '../hooks/useVehicles';
import { format } from 'date-fns';

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get customer data
  const { data: customer, isLoading: isCustomerLoading, error: customerError } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });

  // Get customer vehicles
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useQuery({
    queryKey: ['customerVehicles', id],
    queryFn: () => customerService.getCustomerVehiclesByCustomerId(id),
    enabled: !!id,
    select: (data) => {
      return Array.isArray(data) ? data : data?.items || [];
    }
  });

  // Get customer orders
  const { data: allOrders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
    enabled: !!id,
    select: (data) => {
      const orders = Array.isArray(data) ? data : data?.items || [];
      // Filter orders by customer ID (compare as string)
      return orders.filter(order => order.customerID === id);
    }
  });

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await customerService.deleteCustomer(id);
        toast.success('Xóa khách hàng thành công!');
        navigate('/customers');
      } catch (error) {
        console.error('Error deleting customer:', error);
        toast.error('Có lỗi xảy ra khi xóa khách hàng');
      }
    }
  };

  // Calculate statistics
  const totalOrders = allOrders.length;
  const totalSpent = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const latestOrder = allOrders.length > 0 ? allOrders[0] : null;

  // Debug logs
  console.log('Customer ID:', id);
  console.log('All Orders:', allOrders);
  console.log('Filtered Orders:', allOrders.filter(order => order.customerID === id));
  console.log('Vehicles:', vehicles);

  if (isCustomerLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (customerError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải thông tin khách hàng</p>
          <Button onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không tìm thấy khách hàng</p>
          <Button onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { variant: 'warning', label: 'Chờ xử lý' },
      'Processing': { variant: 'info', label: 'Đang xử lý' },
      'Completed': { variant: 'success', label: 'Hoàn thành' },
      'Cancelled': { variant: 'danger', label: 'Đã hủy' },
      'OnHold': { variant: 'warning', label: 'Tạm dừng' }
    };

    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customers')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết khách hàng</h1>
            <p className="text-gray-600">Thông tin chi tiết về khách hàng</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link to={`/customers/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Thông tin cơ bản
              </h3>
              <Badge variant="success" size="sm">
                {customer.accountRoleName}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div key="fullName">
                <label className="text-sm font-medium text-gray-500">Họ tên</label>
                <p className="text-gray-900 font-medium">{customer.customerFullName}</p>
              </div>

              <div key="customerId">
                <label className="text-sm font-medium text-gray-500">Mã khách hàng</label>
                <p className="text-gray-900 font-medium">{customer.customerID}</p>
              </div>

              {customer.gender && (
                <div key="gender">
                  <label className="text-sm font-medium text-gray-500">Giới tính</label>
                  <p className="text-gray-900">
                    {customer.gender === 'Male' ? 'Nam' :
                      customer.gender === 'Female' ? 'Nữ' : 'Khác'}
                  </p>
                </div>
              )}

              {customer.dateOfBirth && (
                <div key="dateOfBirth">
                  <label className="text-sm font-medium text-gray-500">Ngày sinh</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(customer.dateOfBirth)}
                  </p>
                </div>
              )}

              {customer.identityCard && (
                <div key="identityCard">
                  <label className="text-sm font-medium text-gray-500">Số CMND/CCCD</label>
                  <p className="text-gray-900 flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    {customer.identityCard}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Thông tin liên hệ
            </h3>

            <div className="space-y-4">
              <div key="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                  <p className="text-gray-900">{customer.phoneNumber}</p>
                </div>
              </div>

              {customer.email && (
                <div key="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                </div>
              )}

              <div key="address" className="flex items-start">
                <MapPin className="h-4 w-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                <div>
                  <label className="text-sm font-medium text-gray-500">Địa chỉ</label>
                  <p className="text-gray-900">{customer.address}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Đơn hàng gần đây
              </h3>
              {allOrders.length > 0 && (
                <Link to={`/orders?customerId=${id}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Xem tất cả
                  </Button>
                </Link>
              )}
            </div>

            {isOrdersLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner size="md" />
                <p className="text-gray-500 mt-2">Đang tải đơn hàng...</p>
              </div>
            ) : allOrders.length > 0 ? (
              <div className="space-y-4">
                {allOrders.slice(0, 5).map((order) => (
                  <div key={order.orderID} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">#{order.orderID}</span>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <Link to={`/orders/${order.orderID}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div key="amount">
                        <span className="text-gray-500">Tổng tiền:</span>
                        <span className="ml-2 font-medium">{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <div key="date">
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="ml-2">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>

                    {order.serviceName && (
                      <div className="mt-2 text-sm text-gray-600">
                        Dịch vụ: {order.serviceName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Chưa có đơn hàng nào</p>
                <p className="text-sm text-gray-400">Đơn hàng sẽ hiển thị ở đây khi khách hàng đặt hàng</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Vehicles */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Phương tiện
              </h3>
              {vehicles.length > 0 && (
                <Link to={`/vehicles?customerId=${id}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Xem tất cả
                  </Button>
                </Link>
              )}
            </div>

            {isVehiclesLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner size="md" />
                <p className="text-gray-500 mt-2">Đang tải phương tiện...</p>
              </div>
            ) : vehicles.length > 0 ? (
              <div className="space-y-3">
                {vehicles.slice(0, 3).map((vehicle) => (
                  <div key={vehicle.vehicleID} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{vehicle.licensePlate}</span>
                      <Link to={`/vehicles/${vehicle.vehicleID}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {vehicle.vehicleBrandName && vehicle.vehicleModelName && (
                        <div key="brandModel">{vehicle.vehicleBrandName} {vehicle.vehicleModelName}</div>
                      )}
                      {vehicle.color && (
                        <div key="color">Màu: {vehicle.color}</div>
                      )}
                      {vehicle.year && (
                        <div key="year">Năm: {vehicle.year}</div>
                      )}
                    </div>
                  </div>
                ))}

                {vehicles.length > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                      Và {vehicles.length - 3} phương tiện khác...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Chưa có phương tiện</p>
                <p className="text-sm text-gray-400">Thông tin xe sẽ hiển thị ở đây</p>
              </div>
            )}
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h3>

            <div className="space-y-4">
              <div key="totalOrders" className="flex justify-between items-center">
                <span className="text-gray-600">Tổng đơn hàng</span>
                <span className="font-semibold text-gray-900">{totalOrders}</span>
              </div>

              <div key="totalSpent" className="flex justify-between items-center">
                <span className="text-gray-600">Tổng chi tiêu</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalSpent)}</span>
              </div>

              <div key="latestOrder" className="flex justify-between items-center">
                <span className="text-gray-600">Đơn hàng gần nhất</span>
                <span className="text-gray-500">
                  {latestOrder ? formatDate(latestOrder.createdAt) : 'Chưa có'}
                </span>
              </div>

              <div key="vehicleCount" className="flex justify-between items-center">
                <span className="text-gray-600">Số phương tiện</span>
                <span className="font-semibold text-gray-900">{vehicles.length}</span>
              </div>

              <div key="status" className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái</span>
                <Badge variant="success" size="sm">Hoạt động</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;