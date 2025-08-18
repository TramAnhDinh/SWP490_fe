import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Building,
    MapPin,
    Phone,
    Mail,
    Users,
    Edit,
    ArrowLeft,
    UserCheck,
    UserX
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { employeeService } from '../../services/employeeService';

const StoreDetailPage = () => {
    const { storeId } = useParams();
    const navigate = useNavigate();

    // Get store details
    const { data: store, isLoading: storeLoading, error: storeError } = useQuery({
        queryKey: ['store', storeId],
        queryFn: () => storeService.getStoreById(storeId),
        enabled: !!storeId,
    });

    // Get all employees and filter by storeID
    const { data: allEmployees = [], isLoading: employeesLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: () => employeeService.getEmployees(),
    });

    // Filter employees by storeID and exclude Admin
    const storeEmployees = allEmployees.filter(employee =>
        employee.storeID === storeId &&
        !employee.roles?.some(role => role.roleName === 'Admin')
    );

    if (storeLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (storeError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Lỗi: {storeError.message}</div>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600">Không tìm thấy cửa hàng</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/stores')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
                    <p className="text-gray-600 mt-1">Chi tiết cửa hàng</p>
                </div>
                <button
                    onClick={() => navigate(`/stores/${storeId}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Store Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building className="w-5 h-5 text-blue-600" />
                            Thông tin cửa hàng
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                                <p className="text-gray-900">{store.storeName}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID cửa hàng</label>
                                <p className="text-gray-900">{store.storeID}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <p className="text-gray-900">{store.address || 'Chưa có địa chỉ'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Store Employees */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-600" />
                            Nhân viên ({storeEmployees.length})
                        </h2>

                        {employeesLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Đang tải nhân viên...</p>
                            </div>
                        ) : storeEmployees.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p className="text-gray-500">Chưa có nhân viên nào trong cửa hàng này</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-3">Nhân viên</th>
                                            <th className="text-left p-3">Vai trò</th>
                                            <th className="text-left p-3">Liên hệ</th>
                                            <th className="text-left p-3">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storeEmployees.map((employee) => (
                                            <tr key={employee.employeeID} className="border-b hover:bg-gray-50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {employee.firstName?.[0]}{employee.lastName?.[0]}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {employee.firstName} {employee.lastName}
                                                            </p>
                                                            <p className="text-sm text-gray-500">ID: {employee.employeeID}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {employee.roles?.map(role => (
                                                            <span
                                                                key={role.roleID}
                                                                className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                                                            >
                                                                {role.roleName}
                                                            </span>
                                                        )) || <span className="text-gray-500">Chưa phân quyền</span>}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm space-y-1">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3 text-gray-400" />
                                                            <span>{employee.email || 'Chưa có'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-gray-400" />
                                                            <span>{employee.phoneNumber || 'Chưa có'}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-1">
                                                        {employee.isActive ? (
                                                            <UserCheck className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <UserX className="w-4 h-4 text-red-600" />
                                                        )}
                                                        <span className={`text-xs font-medium ${employee.isActive ? 'text-green-800' : 'text-red-800'
                                                            }`}>
                                                            {employee.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Store Stats */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Tổng nhân viên</span>
                                <span className="font-semibold">{storeEmployees.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Nhân viên hoạt động</span>
                                <span className="font-semibold text-green-600">
                                    {storeEmployees.filter(emp => emp.isActive).length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Nhân viên tạm dừng</span>
                                <span className="font-semibold text-red-600">
                                    {storeEmployees.filter(emp => !emp.isActive).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/employees/add')}
                                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                Thêm nhân viên
                            </button>
                            <button
                                onClick={() => navigate(`/stores/${storeId}/edit`)}
                                className="w-full flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Chỉnh sửa thông tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetailPage;
