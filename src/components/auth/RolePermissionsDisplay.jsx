import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES, PERMISSIONS } from '../../constants/ui';
import { ROLE_PERMISSIONS } from '../../constants/permissions';
import {
    Shield, Check, X, Eye, Edit, Plus, Trash, Users, Store,
    FileText, Palette, Wrench, ShoppingCart, Settings,
    BarChart3, Bell, CreditCard, Car, FileCheck, Database
} from 'lucide-react';

const RolePermissionsDisplay = () => {
    const { getUserRole, getAvailableModules, getAvailableActions } = useAuth();
    const currentRole = getUserRole();
    const availableModules = getAvailableModules();

    // Get role data
    const roleData = Object.values(USER_ROLES).find(role => role.value === currentRole);

    // Module label mapping
    const getModuleLabel = (module) => {
        const moduleLabels = {
            accounts: 'Tài khoản người dùng',
            employees: 'Nhân viên',
            settings: 'Cài đặt hệ thống',
            reports: 'Báo cáo',
            analytics: 'Phân tích',
            stores: 'Cửa hàng',
            orders: 'Đơn hàng',
            customers: 'Khách hàng',
            services: 'Dịch vụ',
            designs: 'Thiết kế',
            installations: 'Lắp đặt',
            notifications: 'Thông báo',
            payments: 'Thanh toán',
            warranty: 'Bảo hành',
            vehicles: 'Phương tiện',
            templates: 'Mẫu thiết kế',
            decal_types: 'Loại decal',
            quality_control: 'Kiểm soát chất lượng',
            design_data: 'Dữ liệu thiết kế',
        };
        return moduleLabels[module] || module;
    };

    // Action label mapping
    const getActionLabel = (action) => {
        const actionLabels = {
            // View actions
            view: 'Xem',
            view_own: 'Xem của mình',

            // Create actions
            create: 'Tạo mới',

            // Edit actions
            edit: 'Chỉnh sửa',

            // Delete actions
            delete: 'Xóa',

            // Order actions
            assign: 'Phân công',
            approve: 'Phê duyệt',
            track: 'Theo dõi',
            manage: 'Quản lý',
            place: 'Đặt hàng',
            track_progress: 'Theo dõi tiến độ',
            update_design_status: 'Cập nhật trạng thái thiết kế',
            update_installation_status: 'Cập nhật trạng thái lắp đặt',

            // Customer actions
            consult: 'Tư vấn',
            confirm_designs: 'Xác nhận thiết kế',
            handover_product: 'Bàn giao sản phẩm',

            // Employee actions
            assign_roles: 'Phân quyền',
            assign_tasks: 'Phân công công việc',
            control_activities: 'Kiểm soát hoạt động',

            // Store actions
            monitor_all: 'Giám sát tất cả',
            manage_store: 'Quản lý cửa hàng',

            // Account actions
            assign_permissions: 'Phân quyền',

            // Service actions
            manage_types: 'Quản lý loại',
            introduce: 'Giới thiệu',
            browse: 'Duyệt',

            // Design actions
            receive_requests: 'Nhận yêu cầu',
            transmit_requests: 'Chuyển yêu cầu',
            receive_approved: 'Nhận thiết kế đã duyệt',
            request_customization: 'Yêu cầu tùy chỉnh',

            // Template actions
            manage_catalog: 'Quản lý danh mục',
            manage_completed: 'Quản lý hoàn thành',
            show_available: 'Hiển thị có sẵn',
            browse_templates: 'Duyệt mẫu',

            // Installation actions
            apply_decals: 'Áp dụng decal',
            transfer_designs: 'Chuyển thiết kế',

            // Quality control actions
            check_quality: 'Kiểm tra chất lượng',
            protect_decals: 'Bảo vệ decal',

            // Notification actions
            send: 'Gửi',
            manage_all: 'Quản lý tất cả',
            send_customer: 'Gửi khách hàng',
            design_notifications: 'Thông báo thiết kế',
            installation_notifications: 'Thông báo lắp đặt',
            receive_notifications: 'Nhận thông báo',

            // Payment actions
            process: 'Xử lý',
            refund: 'Hoàn tiền',
            all_payments: 'Tất cả thanh toán',
            pay: 'Thanh toán',

            // Report actions
            export: 'Xuất báo cáo',
            system_performance: 'Hiệu suất hệ thống',
            all_reports: 'Tất cả báo cáo',
            revenue_reports: 'Báo cáo doanh thu',
            business_performance: 'Hiệu suất kinh doanh',
            sales_performance: 'Hiệu suất bán hàng',

            // Analytics actions
            system_analytics: 'Phân tích hệ thống',
            store_analytics: 'Phân tích cửa hàng',

            // Settings actions
            system_maintenance: 'Bảo trì hệ thống',
            update_parameters: 'Cập nhật tham số',

            // Vehicle actions
            add_vehicle: 'Thêm phương tiện',
            edit_installation_notes: 'Sửa ghi chú lắp đặt',

            // Warranty actions
            perform_repairs: 'Thực hiện sửa chữa',

            // Design data actions
            store: 'Lưu trữ',
        };
        return actionLabels[action] || action;
    };

    // Get icon for action
    const getActionIcon = (action) => {
        if (action.includes('view')) return <Eye className="w-4 h-4 text-blue-500" />;
        if (action.includes('create') || action.includes('add')) return <Plus className="w-4 h-4 text-green-500" />;
        if (action.includes('edit')) return <Edit className="w-4 h-4 text-yellow-500" />;
        if (action.includes('delete')) return <Trash className="w-4 h-4 text-red-500" />;
        if (action.includes('approve') || action.includes('confirm')) return <Check className="w-4 h-4 text-green-600" />;
        if (action.includes('assign') || action.includes('transfer')) return <Users className="w-4 h-4 text-purple-500" />;
        if (action.includes('track') || action.includes('monitor')) return <BarChart3 className="w-4 h-4 text-blue-600" />;
        if (action.includes('send') || action.includes('notify')) return <Bell className="w-4 h-4 text-orange-500" />;
        if (action.includes('pay') || action.includes('payment')) return <CreditCard className="w-4 h-4 text-green-600" />;
        if (action.includes('quality') || action.includes('check')) return <FileCheck className="w-4 h-4 text-indigo-500" />;
        if (action.includes('store') || action.includes('manage')) return <Database className="w-4 h-4 text-gray-600" />;
        return <Check className="w-4 h-4 text-gray-500" />;
    };

    // Get icon for module
    const getModuleIcon = (module) => {
        const moduleIcons = {
            accounts: <Users className="w-5 h-5 text-blue-600" />,
            employees: <Users className="w-5 h-5 text-green-600" />,
            settings: <Settings className="w-5 h-5 text-gray-600" />,
            reports: <FileText className="w-5 h-5 text-purple-600" />,
            analytics: <BarChart3 className="w-5 h-5 text-indigo-600" />,
            stores: <Store className="w-5 h-5 text-orange-600" />,
            orders: <ShoppingCart className="w-5 h-5 text-blue-600" />,
            customers: <Users className="w-5 h-5 text-teal-600" />,
            services: <FileText className="w-5 h-5 text-green-600" />,
            designs: <Palette className="w-5 h-5 text-pink-600" />,
            installations: <Wrench className="w-5 h-5 text-yellow-600" />,
            notifications: <Bell className="w-5 h-5 text-red-600" />,
            payments: <CreditCard className="w-5 h-5 text-green-600" />,
            warranty: <FileCheck className="w-5 h-5 text-indigo-600" />,
            vehicles: <Car className="w-5 h-5 text-gray-600" />,
            templates: <Palette className="w-5 h-5 text-purple-600" />,
            decal_types: <FileText className="w-5 h-5 text-blue-600" />,
            quality_control: <FileCheck className="w-5 h-5 text-green-600" />,
            design_data: <Database className="w-5 h-5 text-gray-600" />,
        };
        return moduleIcons[module] || <FileText className="w-5 h-5 text-gray-600" />;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Quyền hạn: {roleData?.label || currentRole}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {roleData?.description || 'Mô tả vai trò'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {availableModules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableModules.map((module) => {
                            const actions = getAvailableActions(module);
                            return (
                                <div key={module} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        {getModuleIcon(module)}
                                        <h4 className="font-medium text-gray-900">{getModuleLabel(module)}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {actions.map((action) => (
                                            <div key={action} className="flex items-center gap-2">
                                                {getActionIcon(action)}
                                                <span className="text-sm text-gray-700">
                                                    {getActionLabel(action)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Không có quyền hạn nào được cấp cho vai trò này</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RolePermissionsDisplay;
