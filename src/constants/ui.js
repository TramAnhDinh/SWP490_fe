export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    900: '#064e3b',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    900: '#78350f',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const SIDEBAR_WIDTH = {
  collapsed: '64px',
  expanded: '256px',
};

export const ORDER_STAGES = {
  SURVEY: {
    value: 1,
    label: 'Khảo sát',
    description: 'Tiếp nhận yêu cầu và khảo sát xe',
    color: 'bg-blue-100 text-blue-800',
    progress: 25,
  },
  DESIGNING: {
    value: 2,
    label: 'Thiết kế',
    description: 'Lên ý tưởng và thiết kế mẫu decal',
    color: 'bg-yellow-100 text-yellow-800',
    progress: 50,
  },
  PRODUCTION_AND_INSTALLATION: {
    value: 3,
    label: 'Chốt và thi công',
    description: 'Khách hàng chốt mẫu và bắt đầu thi công',
    color: 'bg-orange-100 text-orange-800',
    progress: 75,
  },
  ACCEPTANCE_AND_DELIVERY: {
    value: 4,
    label: 'Nghiệm thu và nhận hàng',
    description: 'Hoàn thành, nghiệm thu và bàn giao',
    color: 'bg-green-100 text-green-800',
    progress: 100,
  },
};

export const ORDER_PRIORITIES = {
  LOW: {
    value: 'Low',
    label: 'Thấp',
    color: 'bg-gray-100 text-gray-800',
  },
  MEDIUM: {
    value: 'Medium',
    label: 'Trung bình',
    color: 'bg-blue-100 text-blue-800',
  },
  HIGH: {
    value: 'High',
    label: 'Cao',
    color: 'bg-red-100 text-red-800',
  },
  URGENT: {
    value: 'Urgent',
    label: 'Khẩn cấp',
    color: 'bg-red-200 text-red-900',
  },
};

// User roles configuration
export const USER_ROLES = {
  ADMIN: {
    value: 'Admin',
    label: 'Quản trị viên',
    permissions: ['all'],
    description: 'Quản lý tài khoản người dùng, bảo trì hệ thống, phân tích hệ thống, quản lý chuỗi cửa hàng (không bao gồm lắp đặt, thiết kế, thông báo, tài chính, bảo hành và báo cáo)',
  },
  MANAGER: {
    value: 'Manager',
    label: 'Quản lý',
    permissions: [
      'decal_services', 'staff_management', 'order_management',
      'revenue_reports', 'store_operations', 'service_catalog'
    ],
    description: 'Quản lý thông tin dịch vụ decal, kiểm soát nhân viên, theo dõi đơn hàng, báo cáo doanh thu',
  },
  SALES: {
    value: 'Sales',
    label: 'Nhân viên bán hàng',
    permissions: [
      'customer_consultation', 'order_creation', 'service_introduction',
      'sales_tracking', 'customer_guidance'
    ],
    description: 'Tư vấn khách hàng, nhận yêu cầu, giới thiệu dịch vụ, theo dõi bán hàng',
  },
  DESIGNER: {
    value: 'Designer',
    label: 'Thiết kế viên',
    permissions: [
      'design_creation', 'template_management', 'customer_approval',
      'design_transfer'
    ],
    description: 'Nhận yêu cầu thiết kế, tạo chỉnh sửa decal, xác nhận với khách hàng, quản lý mẫu',
  },
  TECHNICIAN: {
    value: 'Technician',
    label: 'Kỹ thuật viên',
    permissions: [
      'installation_work', 'quality_control', 'product_handover',
      'adjustments_repairs'
    ],
    description: 'Lắp đặt decal, kiểm tra chất lượng, bàn giao sản phẩm, điều chỉnh sửa chữa',
  },
  CUSTOMER: {
    value: 'Customer',
    label: 'Khách hàng',
    permissions: [
      'order_placement', 'design_requests', 'progress_tracking',
      'payment_receipt'
    ],
    description: 'Đặt đơn hàng, yêu cầu thiết kế, theo dõi tiến độ, thanh toán nhận hàng',
  },
};

// Granular permissions for specific actions based on functional requirements
export const PERMISSIONS = {
  // Admin permissions
  ACCOUNT_MANAGE: 'account_manage',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  COMPREHENSIVE_REPORTS: 'comprehensive_reports',
  STORE_CHAIN_MANAGE: 'store_chain_manage',

  // Manager permissions
  DECAL_SERVICE_MANAGE: 'decal_service_manage',
  STAFF_CONTROL: 'staff_control',
  ORDER_TRACKING: 'order_tracking',
  REVENUE_MONITORING: 'revenue_monitoring',
  SERVICE_CATALOG_MANAGE: 'service_catalog_manage',

  // Sales permissions
  CUSTOMER_CONSULTATION: 'customer_consultation',
  ORDER_CREATION: 'order_creation',
  SERVICE_INTRODUCTION: 'service_introduction',
  SALES_TRACKING: 'sales_tracking',
  CUSTOMER_GUIDANCE: 'customer_guidance',

  // Designer permissions
  DESIGN_CREATION: 'design_creation',
  TEMPLATE_MANAGEMENT: 'template_management',
  CUSTOMER_APPROVAL: 'customer_approval',
  DESIGN_TRANSFER: 'design_transfer',

  // Technician permissions
  INSTALLATION_WORK: 'installation_work',
  QUALITY_CONTROL: 'quality_control',
  PRODUCT_HANDOVER: 'product_handover',
  ADJUSTMENTS_REPAIRS: 'adjustments_repairs',

  // Customer permissions
  ORDER_PLACEMENT: 'order_placement',
  DESIGN_REQUESTS: 'design_requests',
  PROGRESS_TRACKING: 'progress_tracking',
  PAYMENT_RECEIPT: 'payment_receipt',

  // Module-specific permissions
  // Orders
  ORDER_VIEW: 'order_view',
  ORDER_CREATE: 'order_create',
  ORDER_EDIT: 'order_edit',
  ORDER_DELETE: 'order_delete',
  ORDER_ASSIGN: 'order_assign',
  ORDER_APPROVE: 'order_approve',
  ORDER_TRACK: 'order_track',
  ORDER_MANAGE: 'order_manage',
  ORDER_PLACE: 'order_place',
  ORDER_VIEW_OWN: 'order_view_own',
  ORDER_TRACK_PROGRESS: 'order_track_progress',
  ORDER_UPDATE_DESIGN_STATUS: 'order_update_design_status',
  ORDER_UPDATE_INSTALLATION_STATUS: 'order_update_installation_status',

  // Customers
  CUSTOMER_VIEW: 'customer_view',
  CUSTOMER_CREATE: 'customer_create',
  CUSTOMER_EDIT: 'customer_edit',
  CUSTOMER_DELETE: 'customer_delete',
  CUSTOMER_CONSULT: 'customer_consult',
  CUSTOMER_CONFIRM_DESIGNS: 'customer_confirm_designs',
  CUSTOMER_HANDOVER_PRODUCT: 'customer_handover_product',
  CUSTOMER_VIEW_OWN: 'customer_view_own',

  // Employees
  EMPLOYEE_VIEW: 'employee_view',
  EMPLOYEE_CREATE: 'employee_create',
  EMPLOYEE_EDIT: 'employee_edit',
  EMPLOYEE_DELETE: 'employee_delete',
  EMPLOYEE_ASSIGN_ROLES: 'employee_assign_roles',
  EMPLOYEE_ASSIGN_TASKS: 'employee_assign_tasks',
  EMPLOYEE_CONTROL_ACTIVITIES: 'employee_control_activities',

  // Stores
  STORE_VIEW: 'store_view',
  STORE_CREATE: 'store_create',
  STORE_EDIT: 'store_edit',
  STORE_DELETE: 'store_delete',
  STORE_MONITOR_ALL: 'store_monitor_all',
  STORE_MANAGE: 'store_manage',

  // Accounts
  ACCOUNT_VIEW: 'account_view',
  ACCOUNT_CREATE: 'account_create',
  ACCOUNT_EDIT: 'account_edit',
  ACCOUNT_DELETE: 'account_delete',
  ACCOUNT_ASSIGN_PERMISSIONS: 'account_assign_permissions',

  // Services
  SERVICE_VIEW: 'service_view',
  SERVICE_CREATE: 'service_create',
  SERVICE_EDIT: 'service_edit',
  SERVICE_DELETE: 'service_delete',
  SERVICE_MANAGE_TYPES: 'service_manage_types',
  SERVICE_INTRODUCE: 'service_introduce',
  SERVICE_BROWSE: 'service_browse',

  // Designs
  DESIGN_VIEW: 'design_view',
  DESIGN_CREATE: 'design_create',
  DESIGN_EDIT: 'design_edit',
  DESIGN_DELETE: 'design_delete',
  DESIGN_APPROVE: 'design_approve',
  DESIGN_MANAGE: 'design_manage',
  DESIGN_RECEIVE_REQUESTS: 'design_receive_requests',
  DESIGN_TRANSMIT_REQUESTS: 'design_transmit_requests',
  DESIGN_RECEIVE_APPROVED: 'design_receive_approved',
  DESIGN_VIEW_OWN: 'design_view_own',
  DESIGN_REQUEST_CUSTOMIZATION: 'design_request_customization',

  // Templates
  TEMPLATE_VIEW: 'template_view',
  TEMPLATE_CREATE: 'template_create',
  TEMPLATE_EDIT: 'template_edit',
  TEMPLATE_DELETE: 'template_delete',
  TEMPLATE_MANAGE_CATALOG: 'template_manage_catalog',
  TEMPLATE_MANAGE_COMPLETED: 'template_manage_completed',
  TEMPLATE_SHOW_AVAILABLE: 'template_show_available',
  TEMPLATE_BROWSE: 'template_browse',

  // Installations
  INSTALLATION_VIEW: 'installation_view',
  INSTALLATION_CREATE: 'installation_create',
  INSTALLATION_EDIT: 'installation_edit',
  INSTALLATION_DELETE: 'installation_delete',
  INSTALLATION_ASSIGN: 'installation_assign',
  INSTALLATION_TRACK: 'installation_track',
  INSTALLATION_APPLY_DECALS: 'installation_apply_decals',
  INSTALLATION_TRANSFER_DESIGNS: 'installation_transfer_designs',

  // Quality Control
  QUALITY_CONTROL_VIEW: 'quality_control_view',
  QUALITY_CONTROL_CHECK: 'quality_control_check',
  QUALITY_CONTROL_PROTECT: 'quality_control_protect',

  // Notifications
  NOTIFICATION_VIEW: 'notification_view',
  NOTIFICATION_CREATE: 'notification_create',
  NOTIFICATION_SEND: 'notification_send',
  NOTIFICATION_MANAGE_ALL: 'notification_manage_all',
  NOTIFICATION_SEND_CUSTOMER: 'notification_send_customer',
  NOTIFICATION_DESIGN: 'notification_design',
  NOTIFICATION_INSTALLATION: 'notification_installation',
  NOTIFICATION_VIEW_OWN: 'notification_view_own',
  NOTIFICATION_RECEIVE: 'notification_receive',

  // Payments
  PAYMENT_VIEW: 'payment_view',
  PAYMENT_PROCESS: 'payment_process',
  PAYMENT_REFUND: 'payment_refund',
  PAYMENT_ALL: 'payment_all',
  PAYMENT_VIEW_OWN: 'payment_view_own',
  PAYMENT_PAY: 'payment_pay',

  // Reports
  REPORT_VIEW: 'report_view',
  REPORT_EXPORT: 'report_export',
  REPORT_SYSTEM_PERFORMANCE: 'report_system_performance',
  REPORT_ALL: 'report_all',
  REPORT_REVENUE: 'report_revenue',
  REPORT_BUSINESS_PERFORMANCE: 'report_business_performance',
  REPORT_SALES_PERFORMANCE: 'report_sales_performance',

  // Analytics
  ANALYTICS_VIEW: 'analytics_view',
  ANALYTICS_EXPORT: 'analytics_export',
  ANALYTICS_SYSTEM: 'analytics_system',
  ANALYTICS_STORE: 'analytics_store',

  // Settings
  SETTINGS_VIEW: 'settings_view',
  SETTINGS_EDIT: 'settings_edit',
  SETTINGS_SYSTEM_MAINTENANCE: 'settings_system_maintenance',
  SETTINGS_UPDATE_PARAMETERS: 'settings_update_parameters',

  // Vehicles
  VEHICLE_VIEW: 'vehicle_view',
  VEHICLE_CREATE: 'vehicle_create',
  VEHICLE_EDIT: 'vehicle_edit',
  VEHICLE_DELETE: 'vehicle_delete',
  VEHICLE_VIEW_OWN: 'vehicle_view_own',
  VEHICLE_ADD: 'vehicle_add',
  VEHICLE_EDIT_INSTALLATION_NOTES: 'vehicle_edit_installation_notes',

  // Warranty
  WARRANTY_VIEW: 'warranty_view',
  WARRANTY_CREATE: 'warranty_create',
  WARRANTY_EDIT: 'warranty_edit',
  WARRANTY_DELETE: 'warranty_delete',
  WARRANTY_PERFORM_REPAIRS: 'warranty_perform_repairs',

  // Design Data
  DESIGN_DATA_VIEW: 'design_data_view',
  DESIGN_DATA_STORE: 'design_data_store',
  DESIGN_DATA_MANAGE: 'design_data_manage',
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
};