import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export const employeeService = {
  // Get all employees with optional filters
  getEmployees: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
    if (params.storeId) queryParams.append('storeId', params.storeId);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BASE}?${queryParams}`);
    return response.data;
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    return response.data;
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES.BASE, employeeData);
    return response.data;
  },

  // Create new employee with account
  createEmployeeWithAccount: async (employeeData) => {
    const response = await apiClient.post(API_ENDPOINTS.EMPLOYEES.WITH_ACCOUNT, employeeData);
    return response.data;
  },

  // Create new account
  createAccount: async (accountData) => {
    const response = await apiClient.post(API_ENDPOINTS.ACCOUNTS.BASE, accountData);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    console.log('EmployeeService - Updating employee:', { id, employeeData });
    const response = await apiClient.put(API_ENDPOINTS.EMPLOYEES.BY_ID(id), employeeData);
    console.log('EmployeeService - Update response:', response.data);
    return response.data;
  },

  // Update employee with PATCH method (alternative)
  updateEmployeePatch: async (id, employeeData) => {
    console.log('EmployeeService - Patching employee:', { id, employeeData });
    const response = await apiClient.patch(API_ENDPOINTS.EMPLOYEES.BY_ID(id), employeeData);
    console.log('EmployeeService - Patch response:', response.data);
    return response.data;
  },

  // Update employee status (activate/deactivate)
  updateEmployeeStatus: async (id, isActive) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.EMPLOYEES.BY_ID(id)}/status`, { isActive });
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
    return response.data;
  },

  // Get all roles
  getRoles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ROLES.BASE);
    return response.data;
  },

  // Get all stores
  getStores: async () => {
    const response = await apiClient.get(API_ENDPOINTS.STORES.BASE);
    return response.data;
  },

  // Assign role to employee
  assignRole: async (employeeId, roleId) => {
    const response = await apiClient.post(`${API_ENDPOINTS.EMPLOYEES.BY_ID(employeeId)}/roles`, { roleId });
    return response.data;
  },

  // Remove role from employee
  removeRole: async (employeeId, roleId) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.EMPLOYEES.BY_ID(employeeId)}/roles/${roleId}`);
    return response.data;
  },

  // Update employee roles
  updateEmployeeRoles: async (employeeId, roleIds) => {
    const response = await apiClient.put(`${API_ENDPOINTS.EMPLOYEES.BY_ID(employeeId)}/roles`, { roleIds });
    return response.data;
  },

  // Get employee performance metrics
  getEmployeePerformance: async (employeeId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.period) queryParams.append('period', params.period);

    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BY_ID(employeeId)}/performance?${queryParams}`);
    return response.data;
  },

  // Get employee work assignments
  getEmployeeAssignments: async (employeeId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BY_ID(employeeId)}/assignments?${queryParams}`);
    return response.data;
  },

  // Create work assignment
  createAssignment: async (assignmentData) => {
    const response = await apiClient.post('/employee-assignments', assignmentData);
    return response.data;
  },

  // Update assignment status
  updateAssignmentStatus: async (assignmentId, status) => {
    const response = await apiClient.patch(`/employee-assignments/${assignmentId}/status`, { status });
    return response.data;
  },

  // Get employee attendance
  getEmployeeAttendance: async (employeeId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.month) queryParams.append('month', params.month);
    if (params.year) queryParams.append('year', params.year);

    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BY_ID(employeeId)}/attendance?${queryParams}`);
    return response.data;
  },

  // Record attendance
  recordAttendance: async (attendanceData) => {
    const response = await apiClient.post('/employee-attendance', attendanceData);
    return response.data;
  },

  // Get employee statistics
  getEmployeeStats: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.storeId) queryParams.append('storeId', params.storeId);
    if (params.period) queryParams.append('period', params.period);

    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BASE}/statistics?${queryParams}`);
    return response.data;
  },

  // Export employees data
  exportEmployees: async (format = 'excel', params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);
    if (params.storeId) queryParams.append('storeId', params.storeId);

    queryParams.append('format', format);

    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BASE}/export?${queryParams}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Bulk update employees
  bulkUpdateEmployees: async (employeeIds, updateData) => {
    const response = await apiClient.patch(`${API_ENDPOINTS.EMPLOYEES.BASE}/bulk-update`, {
      employeeIds,
      updateData
    });
    return response.data;
  },

  // Get employee hierarchy
  getEmployeeHierarchy: async (storeId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.EMPLOYEES.BASE}/hierarchy${storeId ? `?storeId=${storeId}` : ''}`);
    return response.data;
  },

  // Get role permissions
  getRolePermissions: async (roleId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.ROLES.BY_ID(roleId)}/permissions`);
    return response.data;
  },

  // Update role permissions
  updateRolePermissions: async (roleId, permissions) => {
    const response = await apiClient.put(`${API_ENDPOINTS.ROLES.BY_ID(roleId)}/permissions`, { permissions });
    return response.data;
  },

  // Create new role
  createRole: async (roleData) => {
    const response = await apiClient.post(API_ENDPOINTS.ROLES.BASE, roleData);
    return response.data;
  },

  // Update role
  updateRole: async (roleId, roleData) => {
    const response = await apiClient.put(API_ENDPOINTS.ROLES.BY_ID(roleId), roleData);
    return response.data;
  },

  // Delete role
  deleteRole: async (roleId) => {
    const response = await apiClient.delete(API_ENDPOINTS.ROLES.BY_ID(roleId));
    return response.data;
  },
};