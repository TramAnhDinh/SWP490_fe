import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Calendar, Clock, Award, TrendingUp,
    Edit, Trash2, Download, Share, Star, CheckCircle, XCircle, AlertTriangle,
    Building, Users, Car, Palette, DollarSign, FileText, Settings,
    ChevronRight, ChevronDown, Plus, Eye, Activity, BarChart3, PieChart, ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { employeeService } from '../../services/employeeService';
import { orderService } from '../../services/orderService';
import { getRoleInfo } from '../../utils/roleUtils';

const EmployeeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState('overview');

    // Fetch employee details
    const { data: employee, isLoading: employeeLoading } = useQuery({
        queryKey: ['employee', id],
        queryFn: () => employeeService.getEmployeeById(id)
    });

    // Fetch employee's orders
    const { data: employeeOrders = [] } = useQuery({
        queryKey: ['employeeOrders', id],
        queryFn: () => orderService.getOrders({ employeeId: id }),
        enabled: !!id
    });

    // Fetch employee's installations (sử dụng Orders thay thế)
    const { data: employeeInstallations = [] } = useQuery({
        queryKey: ['employeeInstallations', id],
        queryFn: () => orderService.getOrders({ employeeId: id, status: 'completed' }), // Sử dụng Orders đã hoàn thành thay thế
        enabled: !!id
    });

    // Mutations
    const deleteEmployeeMutation = useMutation({
        mutationFn: () => employeeService.deleteEmployee(id),
        onSuccess: () => {
            toast.success('Đã xóa nhân viên');
            navigate('/employees');
        }
    });

    const updateEmployeeStatusMutation = useMutation({
        mutationFn: ({ employeeId, status }) => employeeService.updateEmployeeStatus(employeeId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['employee', id]);
            toast.success('Đã cập nhật trạng thái nhân viên');
        }
    });

    // Calculate performance metrics
    const performanceMetrics = {
        totalOrders: employeeOrders.length,
        completedOrders: employeeOrders.filter(order => order.orderStatus === 'completed').length,
        totalInstallations: employeeInstallations.length,
        completedInstallations: employeeInstallations.filter(inst => inst.orderStatus === 'completed').length,
        averageRating: employeeOrders.length > 0
            ? (employeeOrders.reduce((sum, order) => sum + (order.rating || 0), 0) / employeeOrders.length).toFixed(1)
            : 0,
        completionRate: employeeOrders.length > 0
            ? ((employeeOrders.filter(order => order.orderStatus === 'completed').length / employeeOrders.length) * 100).toFixed(1)
            : 0
    };



    // Get status info
    const getStatusInfo = (status) => {
        const statusConfig = {
            'active': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Đang làm việc' },
            'inactive': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Không hoạt động' },
            'on_leave': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, text: 'Nghỉ phép' }
        };
        return statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Không xác định' };
    };

    if (employeeLoading) return <LoadingSpinner />;
    if (!employee) return <div className="text-center py-8">Không tìm thấy nhân viên</div>;

    // Debug logging
    console.log('Employee data in detail page:', employee);
    console.log('Employee address:', employee.address);

    // Lấy role từ accountRoleName hoặc roles array
    const employeeRole = employee.accountRoleName || employee.roles?.[0]?.roleName || 'Unknown';
    const roleInfo = getRoleInfo(employeeRole);
    const statusInfo = getStatusInfo(employee.status);

    // Lấy icon component từ tên icon
    const getIconComponent = (iconName) => {
        const iconMap = {
            'Settings': Settings,
            'Users': Users,
            'DollarSign': DollarSign,
            'Palette': Palette,
            'Car': Car,
            'User': User
        };
        return iconMap[iconName] || User;
    };

    const RoleIcon = getIconComponent(roleInfo.icon);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chi tiết nhân viên</h1>
                        <p className="text-gray-600">Thông tin chi tiết và hiệu suất làm việc</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Xuất PDF
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Share className="w-4 h-4" />
                        Chia sẻ
                    </Button>
                    <Button
                        onClick={() => navigate(`/employees/${id}/edit`)}
                        className="flex items-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                    </Button>
                    <Button
                        onClick={() => {
                            if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
                                deleteEmployeeMutation.mutate();
                            }
                        }}
                        variant="outline"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                    </Button>
                </div>
            </div>

            {/* Employee Overview Card */}
            <Card className="p-6">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {employee.firstName} {employee.lastName}
                            </h2>
                            <Badge className={roleInfo.color}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {roleInfo.name}
                            </Badge>
                            <Badge className={statusInfo.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.text}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.address || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{employee.storeName}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalOrders}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đơn hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.completedOrders}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Star className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
                            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.averageRating}/5</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.completionRate}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <Card className="p-6">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'overview', name: 'Tổng quan', icon: Eye },
                            { id: 'orders', name: 'Đơn hàng', icon: FileText },
                            { id: 'installations', name: 'Đã hoàn thành', icon: Car },
                            { id: 'performance', name: 'Hiệu suất', icon: BarChart3 },
                            { id: 'documents', name: 'Tài liệu', icon: FileText }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Họ và tên:</span>
                                            <span className="font-medium">{employee.firstName} {employee.lastName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium">{employee.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Số điện thoại:</span>
                                            <span className="font-medium">{employee.phoneNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Work Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công việc</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Vai trò:</span>
                                            <Badge className={roleInfo.color}>
                                                <RoleIcon className="w-3 h-3 mr-1" />
                                                {roleInfo.name}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Trạng thái:</span>
                                            <Badge className={employee.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }>
                                                {employee.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cửa hàng:</span>
                                            <span className="font-medium">{employee.storeName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Mã nhân viên:</span>
                                            <span className="font-medium">{employee.employeeID}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Lịch sử đơn hàng</h3>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo đơn hàng
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mã đơn hàng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Khách hàng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Dịch vụ
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày tạo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Đánh giá
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employeeOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.orderID}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.customerFullName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.description || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={
                                                        order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.orderStatus === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }>
                                                        {order.orderStatus === 'completed' ? 'Hoàn thành' :
                                                            order.orderStatus === 'in_progress' ? 'Đang xử lý' : 'Chờ xử lý'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.rating ? `${order.rating}/5` : 'Chưa đánh giá'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'installations' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Đơn hàng đã hoàn thành</h3>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo đơn hàng
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Mã đơn hàng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Khách hàng
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Loại xe
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ngày tạo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tổng tiền
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employeeInstallations.map((order) => (
                                            <tr key={order.orderID} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.orderID}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.customerFullName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.vehicleModelName || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={
                                                        order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.orderStatus === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }>
                                                        {order.orderStatus === 'completed' ? 'Hoàn thành' :
                                                            order.orderStatus === 'in_progress' ? 'Đang xử lý' : 'Chờ xử lý'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.totalAmount ? `${order.totalAmount.toLocaleString('vi-VN')} VNĐ` : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Performance Chart */}
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Biểu đồ hiệu suất</h3>
                                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500">Biểu đồ hiệu suất sẽ được hiển thị ở đây</p>
                                    </div>
                                </Card>

                                {/* Performance Stats */}
                                <Card className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê hiệu suất</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Tổng đơn hàng xử lý:</span>
                                            <span className="font-semibold">{performanceMetrics.totalOrders}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Tỷ lệ hoàn thành:</span>
                                            <span className="font-semibold">{performanceMetrics.completionRate}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Đánh giá trung bình:</span>
                                            <span className="font-semibold">{performanceMetrics.averageRating}/5</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Lắp đặt hoàn thành:</span>
                                            <span className="font-semibold">{performanceMetrics.completedInstallations}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Tài liệu nhân viên</h3>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm tài liệu
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Mock documents */}
                                <Card className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Hợp đồng lao động</h4>
                                            <p className="text-sm text-gray-500">PDF • 2.3 MB</p>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                                <Card className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Sơ yếu lý lịch</h4>
                                            <p className="text-sm text-gray-500">PDF • 1.1 MB</p>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                                <Card className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Chứng chỉ nghề</h4>
                                            <p className="text-sm text-gray-500">PDF • 3.7 MB</p>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default EmployeeDetailPage;
