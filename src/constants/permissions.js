// Role-based permissions configuration based on functional requirements
export const ROLE_PERMISSIONS = {
  Admin: {
    // System Administrator - Limited control (removed installations, designs, notifications, payments, warranty, reports)
    permissions: [
      'user_management', 'system_maintenance', 'store_management',
      'account_management', 'employee_management', 'system_analytics'
    ],
    modules: {
      // User accounts and access permissions
      accounts: ['view', 'create', 'edit', 'delete', 'assign_permissions'],
      employees: ['view', 'create', 'edit', 'delete', 'assign_roles'],

      // System maintenance and parameters
      settings: ['view', 'edit', 'system_maintenance', 'update_parameters'],

      // Analytics only (removed reports)
      analytics: ['view', 'export', 'system_analytics'],

      // Store chain management
      stores: ['view', 'create', 'edit', 'delete', 'monitor_all'],

      // Limited modules for Admin
      orders: ['view', 'create', 'edit', 'delete', 'assign', 'approve'],
      customers: ['view', 'create', 'edit', 'delete'],
      services: ['view', 'create', 'edit', 'delete'],
      vehicles: ['view', 'create', 'edit', 'delete'],
      templates: ['view', 'create', 'edit', 'delete'],
    }
  },

  Manager: {
    // Store Manager - Store-level control (removed installations, vehicles, stores, notifications)
    permissions: [
      'decal_services', 'staff_management', 'order_management',
      'revenue_reports', 'service_catalog'
    ],
    modules: {
      // Decal service information and types
      services: ['view', 'create', 'edit', 'manage_types'],
      decal_types: ['view', 'create', 'edit', 'manage'],
      templates: ['view', 'create', 'edit', 'manage_catalog'],

      // Staff activities and task assignment
      employees: ['view', 'assign_tasks', 'control_activities'],

      // Order tracking and management
      orders: ['view', 'create', 'edit', 'track', 'manage'],

      // Revenue reports and business performance
      analytics: ['view', 'store_analytics'],

      // Customer management
      customers: ['view', 'create', 'edit'],

      // Payments
      payments: ['view', 'process'],

      // Designs
      designs: ['view', 'approve', 'manage'],

      // Warranty
      warranty: ['view', 'create', 'edit'],
    }
  },

  Sales: {
    // Sales Staff - Customer interaction and order creation
    permissions: [
      'customer_consultation', 'order_creation', 'service_introduction',
      'sales_tracking', 'customer_guidance'
    ],
    modules: {
      // Customer consultation and requests
      customers: ['view', 'create', 'edit', 'consult'],

      // Order information and creation
      orders: ['view', 'create', 'edit', 'track'],

      // Service introduction and templates
      services: ['view', 'introduce'],
      templates: ['view', 'show_available'],

      // Sales performance tracking
      analytics: ['view', 'sales_performance'],

      // Vehicle information
      vehicles: ['view', 'create', 'edit'],

      // Notifications for customers
      notifications: ['view', 'create', 'send_customer'],

      // Payment processing
      payments: ['view', 'process'],

      // Warranty information
      warranty: ['view'],

      // Design requests transmission
      designs: ['view', 'transmit_requests'],
    }
  },

  Designer: {
    // Designer - Design creation and management
    permissions: [
      'design_creation', 'template_management', 'customer_approval',
      'design_transfer'
    ],
    modules: {
      // Design requests from customers
      designs: ['view', 'create', 'edit', 'receive_requests'],

      // Template management
      templates: ['view', 'create', 'edit', 'manage_completed'],

      // Customer approval process
      customers: ['view', 'confirm_designs'],

      // Order tracking for design status
      orders: ['view', 'update_design_status'],

      // Transfer designs to installation
      installations: ['view', 'transfer_designs'],

      // Notifications
      notifications: ['view', 'create', 'design_notifications'],

      // Design data storage
      design_data: ['view', 'store', 'manage'],
    }
  },

  Technician: {
    // Installation Technician - Installation and quality control
    permissions: [
      'installation_work', 'quality_control', 'product_handover',
      'adjustments_repairs'
    ],
    modules: {
      // Installation work
      installations: ['view', 'create', 'edit', 'apply_decals'],

      // Quality control
      quality_control: ['view', 'check_quality', 'protect_decals'],

      // Order tracking
      orders: ['view', 'update_installation_status'],

      // Design approval for installation
      designs: ['view', 'receive_approved'],

      // Product handover
      customers: ['view', 'handover_product'],

      // Notifications
      notifications: ['view', 'create', 'installation_notifications'],

      // Warranty and repairs
      warranty: ['view', 'create', 'perform_repairs'],

      // Vehicle information
      vehicles: ['view', 'edit_installation_notes'],
    }
  },

  Customer: {
    // Customer - Order placement and tracking
    permissions: [
      'order_placement', 'design_requests', 'progress_tracking',
      'payment_receipt'
    ],
    modules: {
      // Order placement
      orders: ['view_own', 'place_orders', 'track_progress'],

      // Design customization requests
      designs: ['view_own', 'request_customization'],

      // Service information
      services: ['view', 'browse_services'],

      // Template browsing
      templates: ['view', 'browse_templates'],

      // Payment
      payments: ['view_own', 'pay'],

      // Notifications
      notifications: ['view_own', 'receive_notifications'],

      // Vehicle information
      vehicles: ['view_own', 'add_vehicle'],
    }
  }
};

// Permission check helper
export const checkPermission = (userRole, module, action) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const modulePermissions = rolePermissions.modules[module];
  if (!modulePermissions) return false;

  return modulePermissions.includes(action);
};

// Get available modules for a role
export const getAvailableModules = (userRole) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return [];

  return Object.keys(rolePermissions.modules);
};

// Get available actions for a role and module
export const getAvailableActions = (userRole, module) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return [];

  return rolePermissions.modules[module] || [];
};
