import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Users,
  Car,
  Palette,
  DollarSign,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Package,
  Shield,
  MessageSquare,
  HelpCircle,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Building,
  Wrench,
  Bell
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../constants/ui';

const navigation = [
  {
    name: 'Tổng quan',
    href: '/dashboard',
    icon: Home,
    roles: ['Admin', 'Manager', 'Sales', 'Technician', 'Customer'],
  },
  {
    name: 'Đơn hàng',
    icon: ShoppingCart,
    roles: ['Admin', 'Manager', 'Sales', 'Technician'],
    children: [
      { name: 'Danh sách đơn hàng', href: '/orders' },
      { name: 'Tạo đơn hàng mới', href: '/orders/create' },
      { name: 'Theo dõi tiến độ', href: '/orders/tracking' },
    ],
  },
  {
    name: 'Lắp đặt',
    icon: Wrench,
    roles: ['Admin', 'Technician'],
    children: [
      { name: 'Hàng đợi lắp đặt', href: '/installations/queue' },
      { name: 'Theo dõi lắp đặt', href: '/installations/tracking' },
      { name: 'Kiểm soát chất lượng', href: '/installations/quality' },
    ],
  },
  {
    name: 'Khách hàng',
    icon: Users,
    roles: ['Admin', 'Manager', 'Sales'],
    children: [
      { name: 'Danh sách khách hàng', href: '/customers' },
      // { name: 'Thêm khách hàng', href: '/customers/create' },
    ],
  },
  {
    name: 'Phương tiện',
    icon: Car,
    roles: ['Admin'],
    children: [
      { name: 'Danh sách xe', href: '/vehicles' },
      // { name: 'Thêm thương hiệu', href: '/vehicles/brands/create' },
      // { name: 'Thêm mẫu xe', href: '/vehicles/models/create' },
    ],
  },
  {
    name: 'Thiết kế',
    icon: Palette,
    roles: ['Admin', 'Manager', 'Designer'],
    children: [
      { name: 'Thư viện thiết kế', href: '/designs' },
      { name: 'Soạn thảo thiết kế', href: '/designs/editor' },
      { name: 'Thư viện mẫu', href: '/templates' },
      { name: 'Duyệt thiết kế', href: '/designs/approval' },
    ],
  },
  {
    name: 'Nhân viên',
    icon: Users,
    roles: ['Admin', 'Manager'],
    children: [
      { name: 'Danh sách nhân viên', href: '/employees' },
      { name: 'Theo dõi hiệu suất', href: '/performance' },
    ],
  },
  {
    name: 'Cửa hàng',
    icon: Building,
    roles: ['Admin'],
    children: [
      { name: 'Danh sách cửa hàng', href: '/stores' },
      // { name: 'Thêm cửa hàng', href: '/stores/add' },
    ],
  },
  {
    name: 'Quản lý tài khoản',
    icon: Shield,
    roles: ['Admin'],
    children: [
      { name: 'Danh sách tài khoản', href: '/accounts' },
    ],
  },
  {
    name: 'Hệ thống thông báo',
    icon: Bell,
    roles: ['Admin', 'Sales', 'Technician'],
    children: [
      { name: 'Danh sách thông báo', href: '/notifications' },
      { name: 'Tạo thông báo mới', href: '/notifications/create' },
    ],
  },
  {
    name: 'Hệ thống tin nhắn',
    icon: MessageSquare,
    roles: ['Admin', 'Designer'],
    children: [
      { name: 'Trung tâm thông báo', href: '/notifications/center' },
      { name: 'Hệ thống tin nhắn', href: '/notifications/messages' },
    ],
  },
  {
    name: 'Dịch vụ & Kho',
    icon: Package,
    roles: ['Admin', 'Manager', 'Sales'],
    children: [
      // { name: 'Quản lý dịch vụ', href: '/services' },
      { name: 'Quản lí dịch vụ', href: '/services/list' },
      { name: 'Quản lý loại decal', href: '/decal-types' },
      // { name: 'Quản lý giá', href: '/pricing' },
      // { name: 'Theo dõi kho', href: '/inventory' },
    ],
  },
  {
    name: 'Tài chính',
    icon: DollarSign,
    roles: ['Admin', 'Manager'],
    children: [
      { name: 'Xử lý thanh toán', href: '/payments/processing' },
      { name: 'Quản lý hóa đơn', href: '/payments/invoices' },
      { name: 'Báo cáo tài chính', href: '/payments/reports' },
      { name: 'Theo dõi đặt cọc', href: '/payments/deposits' },
    ],
  },
  {
    name: 'Bảo hành & Hỗ trợ',
    icon: Shield,
    roles: ['Admin', 'Manager', 'Sales', 'Technician'],
    children: [
      { name: 'Quản lý bảo hành', href: '/warranty/management' },
      { name: 'Hệ thống phản hồi', href: '/feedback' },
      { name: 'Ticket hỗ trợ', href: '/support/tickets' },
    ],
  },
  {
    name: 'Phân tích & Báo cáo',
    icon: BarChart3,
    roles: ['Admin', 'Manager'],
    children: [
      { name: 'Phân tích bán hàng', href: '/analytics/sales', icon: TrendingUp },
      { name: 'Hiệu suất nhân viên', href: '/analytics/performance', icon: Activity },
      { name: 'Thông tin khách hàng', href: '/analytics/customers', icon: Users },
      { name: 'Báo cáo vận hành', href: '/analytics/operations', icon: PieChart },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { getUserRole, hasModulePermission } = useAuth();
  const [expandedItems, setExpandedItems] = useState({});

  const userRole = getUserRole();

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isParentActive = (children) => {
    return children?.some(child => isActive(child.href));
  };

  // Check if user has access to a module
  const hasModuleAccess = (moduleName) => {
    // Map navigation names to module names
    const moduleMapping = {
      'Tổng quan': 'dashboard',
      'Đơn hàng': 'orders',
      'Lắp đặt': 'installations',
      'Khách hàng': 'customers',
      'Phương tiện': 'vehicles',
      'Thiết kế': 'designs',
      'Nhân viên': 'employees',
      'Cửa hàng': 'stores',
      'Quản lý tài khoản': 'accounts',
      'Hệ thống thông báo': 'notifications',
      'Hệ thống tin nhắn': 'notifications',
      'Cài đặt hệ thống': 'settings',
      'Dịch vụ & Kho': 'services',
      'Tài chính': 'payments',
      'Bảo hành & Hỗ trợ': 'warranty',
      'Phân tích & Báo cáo': 'analytics',
    };

    const moduleKey = moduleMapping[moduleName];
    if (!moduleKey) {
      console.log(`🔍 No mapping found for module: ${moduleName}, allowing access`);
      return true; // Allow access if no mapping found
    }

    const hasPermission = hasModulePermission(moduleKey, 'view');
    console.log(`🔍 Module: ${moduleName} -> ${moduleKey}, hasPermission: ${hasPermission}`);
    return hasPermission;
  };

  const filteredNavigation = navigation.filter(item => {
    // First check if user role is in the allowed roles
    const hasRoleAccess = item.roles.includes(userRole);

    // Then check if user has module permission
    const hasAccess = hasModuleAccess(item.name);

    return hasRoleAccess && hasAccess;
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform lg:translate-x-0 lg:static lg:inset-0',
        'transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="DecalXe"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center h-8 w-8 bg-primary-600 rounded text-white font-bold text-sm">
                DX
              </div>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">DecalXe</span>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredNavigation.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.name];
            const isItemActive = item.href ? isActive(item.href) : isParentActive(item.children);

            if (!hasChildren) {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    isItemActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            }

            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    'group w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                    isItemActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          'group flex items-center pl-11 pr-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                          isActive(child.href)
                            ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                      >
                        {child.icon && <child.icon className="mr-2 h-4 w-4 flex-shrink-0" />}
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;