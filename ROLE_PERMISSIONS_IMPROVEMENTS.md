# Cải thiện Role Permissions System

## 🔍 **Phân tích vấn đề ban đầu:**

### **1. Role Hierarchy không đầy đủ:**
- Thiếu role `Designer` và `Accountant` trong hierarchy
- Role `Technician` và `Sales` có cùng level (3) nhưng có thể cần phân biệt
- Không có phân biệt rõ ràng giữa các role

### **2. Permissions quá đơn giản:**
- Chỉ có `['all']`, `['orders', 'employees', 'customers', 'reports']`
- Thiếu granular permissions cho từng action cụ thể
- Không có permission cho các module mới như Installation, Notification, Settings

### **3. Role Mapping không nhất quán:**
- Sidebar có role `Designer` nhưng constants không có
- Sidebar có role `Accountant` nhưng constants không có
- Một số route không có role protection

## 🛠️ **Các cải thiện đã thực hiện:**

### **1. Cập nhật Role Hierarchy:**
```javascript
// Trước:
const roleHierarchy = {
  'Admin': 5,
  'Manager': 4,
  'Sales': 3,
  'Technician': 3,
  'Customer': 1,
};

// Sau:
const roleHierarchy = {
  'Admin': 6,
  'Manager': 5,
  'Sales': 4,
  'Designer': 4,
  'Technician': 4,
  'Accountant': 4,
  'Customer': 1,
};
```

### **2. Mở rộng USER_ROLES với permissions chi tiết:**
```javascript
export const USER_ROLES = {
  Admin: {
    value: 'Admin',
    label: 'Quản trị viên',
    permissions: ['all'],
    description: 'Toàn quyền truy cập hệ thống',
  },
  Manager: {
    value: 'Manager',
    label: 'Quản lý',
    permissions: [
      'orders', 'employees', 'customers', 'reports', 'stores', 'accounts',
      'installations', 'notifications', 'settings', 'analytics', 'payments',
      'warranty', 'services', 'vehicles', 'designs'
    ],
    description: 'Quản lý cửa hàng và nhân viên',
  },
  Sales: {
    value: 'Sales',
    label: 'Nhân viên bán hàng',
    permissions: [
      'orders', 'customers', 'vehicles', 'services', 'notifications',
      'payments', 'warranty'
    ],
    description: 'Tư vấn và bán hàng cho khách hàng',
  },
  Designer: {
    value: 'Designer',
    label: 'Thiết kế viên',
    permissions: [
      'designs', 'templates', 'orders', 'notifications'
    ],
    description: 'Thiết kế decal và mẫu',
  },
  Technician: {
    value: 'Technician',
    label: 'Kỹ thuật viên',
    permissions: [
      'installations', 'orders', 'designs', 'notifications', 'warranty'
    ],
    description: 'Lắp đặt và bảo hành',
  },
  Accountant: {
    value: 'Accountant',
    label: 'Kế toán',
    permissions: [
      'payments', 'reports', 'analytics', 'orders'
    ],
    description: 'Quản lý tài chính và báo cáo',
  },
  Customer: {
    value: 'Customer',
    label: 'Khách hàng',
    permissions: ['view_orders', 'view_services'],
    description: 'Xem thông tin đơn hàng và dịch vụ',
  },
};
```

### **3. Tạo Granular Permissions:**
```javascript
export const PERMISSIONS = {
  // Order permissions
  ORDER_VIEW: 'order_view',
  ORDER_CREATE: 'order_create',
  ORDER_EDIT: 'order_edit',
  ORDER_DELETE: 'order_delete',
  ORDER_ASSIGN: 'order_assign',
  ORDER_APPROVE: 'order_approve',
  
  // Customer permissions
  CUSTOMER_VIEW: 'customer_view',
  CUSTOMER_CREATE: 'customer_create',
  CUSTOMER_EDIT: 'customer_edit',
  CUSTOMER_DELETE: 'customer_delete',
  
  // Employee permissions
  EMPLOYEE_VIEW: 'employee_view',
  EMPLOYEE_CREATE: 'employee_create',
  EMPLOYEE_EDIT: 'employee_edit',
  EMPLOYEE_DELETE: 'employee_delete',
  
  // Store permissions
  STORE_VIEW: 'store_view',
  STORE_CREATE: 'store_create',
  STORE_EDIT: 'store_edit',
  STORE_DELETE: 'store_delete',
  
  // Account permissions
  ACCOUNT_VIEW: 'account_view',
  ACCOUNT_CREATE: 'account_create',
  ACCOUNT_EDIT: 'account_edit',
  ACCOUNT_DELETE: 'account_delete',
  
  // Installation permissions
  INSTALLATION_VIEW: 'installation_view',
  INSTALLATION_CREATE: 'installation_create',
  INSTALLATION_EDIT: 'installation_edit',
  INSTALLATION_ASSIGN: 'installation_assign',
  INSTALLATION_QUALITY: 'installation_quality',
  
  // Design permissions
  DESIGN_VIEW: 'design_view',
  DESIGN_CREATE: 'design_create',
  DESIGN_EDIT: 'design_edit',
  DESIGN_APPROVE: 'design_approve',
  
  // Notification permissions
  NOTIFICATION_VIEW: 'notification_view',
  NOTIFICATION_CREATE: 'notification_create',
  NOTIFICATION_SEND: 'notification_send',
  
  // Payment permissions
  PAYMENT_VIEW: 'payment_view',
  PAYMENT_PROCESS: 'payment_process',
  PAYMENT_REFUND: 'payment_refund',
  
  // Report permissions
  REPORT_VIEW: 'report_view',
  REPORT_EXPORT: 'report_export',
  
  // Settings permissions
  SETTINGS_VIEW: 'settings_view',
  SETTINGS_EDIT: 'settings_edit',
  
  // Analytics permissions
  ANALYTICS_VIEW: 'analytics_view',
  ANALYTICS_EXPORT: 'analytics_export',
};
```

### **4. Tạo Role-based Permissions Configuration:**
- File mới: `src/constants/permissions.js`
- Cấu hình chi tiết permissions cho từng role và module
- Helper functions để check permissions

### **5. Cập nhật Auth Service:**
- Thêm `hasModulePermission(module, action)`
- Thêm `getAvailableModules()`
- Thêm `getAvailableActions(module)`
- Thêm `hasSpecificPermission(permission)`

### **6. Cập nhật useAuth Hook:**
- Export các function mới
- Cung cấp interface để check permissions

### **7. Tạo RolePermissionsDisplay Component:**
- Hiển thị permissions của role hiện tại
- UI trực quan với icons và labels
- Tích hợp vào UserProfilePage

## 📋 **Permissions Matrix:**

| Role | Dashboard | Orders | Customers | Employees | Stores | Accounts | Installations | Designs | Notifications | Payments | Reports | Analytics | Settings | Warranty | Services | Vehicles | Templates |
|------|-----------|--------|-----------|-----------|--------|----------|---------------|---------|---------------|----------|---------|-----------|----------|----------|----------|----------|-----------|
| Admin | ✅ View | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| Manager | ✅ View | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ Process | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All | ✅ All |
| Sales | ✅ View | ✅ View/Create/Edit | ✅ View/Create/Edit | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ View | ✅ View/Process | ❌ | ❌ | ❌ | ✅ View | ✅ View | ✅ View | ❌ |
| Designer | ✅ View | ✅ View | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ All | ✅ View | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ All |
| Technician | ✅ View | ✅ View | ❌ | ❌ | ❌ | ❌ | ✅ View/Edit/Quality | ✅ View | ✅ View | ❌ | ❌ | ❌ | ❌ | ✅ All | ❌ | ❌ | ❌ |
| Accountant | ✅ View | ✅ View | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ All | ✅ All | ✅ All | ❌ | ❌ | ❌ | ❌ | ❌ |
| Customer | ✅ View | ✅ View | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ View | ❌ | ❌ |

## 🎯 **Lợi ích:**

### **1. Bảo mật tốt hơn:**
- Kiểm soát chi tiết quyền truy cập
- Ngăn chặn truy cập trái phép
- Audit trail rõ ràng

### **2. UX tốt hơn:**
- Hiển thị permissions trực quan
- Người dùng biết rõ quyền của mình
- UI/UX nhất quán

### **3. Maintainability:**
- Code dễ maintain
- Dễ thêm/sửa permissions
- Cấu trúc rõ ràng

### **4. Scalability:**
- Dễ mở rộng thêm roles
- Dễ thêm permissions mới
- Flexible architecture

## 🚀 **Cách sử dụng:**

### **1. Check Role Permission:**
```javascript
const { hasPermission } = useAuth();
const canAccessOrders = hasPermission('Manager'); // true if user is Admin or Manager
```

### **2. Check Module Permission:**
```javascript
const { hasModulePermission } = useAuth();
const canCreateOrders = hasModulePermission('orders', 'create');
const canViewCustomers = hasModulePermission('customers', 'view');
```

### **3. Get Available Modules:**
```javascript
const { getAvailableModules } = useAuth();
const modules = getAvailableModules(); // ['dashboard', 'orders', 'customers', ...]
```

### **4. Get Available Actions:**
```javascript
const { getAvailableActions } = useAuth();
const actions = getAvailableActions('orders'); // ['view', 'create', 'edit', ...]
```

### **5. Display Permissions:**
```javascript
import RolePermissionsDisplay from '../components/auth/RolePermissionsDisplay';

// Trong component
<RolePermissionsDisplay />
```

## 📝 **Kết luận:**

Hệ thống permissions đã được cải thiện đáng kể với:
- ✅ Role hierarchy rõ ràng và đầy đủ
- ✅ Granular permissions cho từng action
- ✅ Module-based permissions
- ✅ UI trực quan để hiển thị permissions
- ✅ Helper functions dễ sử dụng
- ✅ Scalable architecture
- ✅ Better security và UX

Hệ thống này sẽ giúp quản lý quyền truy cập hiệu quả hơn và cung cấp trải nghiệm người dùng tốt hơn.
