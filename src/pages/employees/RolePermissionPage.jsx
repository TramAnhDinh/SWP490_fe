import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  Shield,
  Users,
  Plus,
  Edit3,
  Trash2,
  Settings,
  UserCheck,
  UserX,
  Search,
  Filter,
  Save,
  X
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';

const RolePermissionPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('roles');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showAssignRoleModal, setShowAssignRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Initial form data for new role
  const [newRoleData, setNewRoleData] = useState({
    roleName: '',
    description: '',
    permissions: []
  });

  // Get data
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: employeeService.getRoles,
  });

  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getEmployees(),
  });

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: employeeService.getStores,
  });

  // Available permissions
  const availablePermissions = [
    { id: 'orders.view', name: 'Xem đơn hàng', category: 'Đơn hàng' },
    { id: 'orders.create', name: 'Tạo đơn hàng', category: 'Đơn hàng' },
    { id: 'orders.edit', name: 'Chỉnh sửa đơn hàng', category: 'Đơn hàng' },
    { id: 'orders.delete', name: 'Xóa đơn hàng', category: 'Đơn hàng' },
    { id: 'customers.view', name: 'Xem khách hàng', category: 'Khách hàng' },
    { id: 'customers.create', name: 'Tạo khách hàng', category: 'Khách hàng' },
    { id: 'customers.edit', name: 'Chỉnh sửa khách hàng', category: 'Khách hàng' },
    { id: 'customers.delete', name: 'Xóa khách hàng', category: 'Khách hàng' },
    { id: 'employees.view', name: 'Xem nhân viên', category: 'Nhân viên' },
    { id: 'employees.create', name: 'Tạo nhân viên', category: 'Nhân viên' },
    { id: 'employees.edit', name: 'Chỉnh sửa nhân viên', category: 'Nhân viên' },
    { id: 'employees.delete', name: 'Xóa nhân viên', category: 'Nhân viên' },
    { id: 'designs.view', name: 'Xem thiết kế', category: 'Thiết kế' },
    { id: 'designs.create', name: 'Tạo thiết kế', category: 'Thiết kế' },
    { id: 'designs.edit', name: 'Chỉnh sửa thiết kế', category: 'Thiết kế' },
    { id: 'designs.approve', name: 'Phê duyệt thiết kế', category: 'Thiết kế' },
    { id: 'reports.view', name: 'Xem báo cáo', category: 'Báo cáo' },
    { id: 'reports.export', name: 'Xuất báo cáo', category: 'Báo cáo' },
    { id: 'settings.manage', name: 'Quản lý cài đặt', category: 'Hệ thống' },
    { id: 'roles.manage', name: 'Quản lý vai trò', category: 'Hệ thống' }
  ];

  // Mutations
  const createRoleMutation = useMutation({
    mutationFn: employeeService.createRole,
    onSuccess: () => {
      toast.success('Vai trò đã được tạo thành công!');
      queryClient.invalidateQueries(['roles']);
      setShowCreateRoleModal(false);
      setNewRoleData({ roleName: '', description: '', permissions: [] });
    },
    onError: (error) => {
      toast.error('Lỗi khi tạo vai trò: ' + (error.response?.data?.message || error.message));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, data }) => employeeService.updateRole(roleId, data),
    onSuccess: () => {
      toast.success('Vai trò đã được cập nhật thành công!');
      queryClient.invalidateQueries(['roles']);
      setShowEditRoleModal(false);
      setSelectedRole(null);
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật vai trò: ' + (error.response?.data?.message || error.message));
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: employeeService.deleteRole,
    onSuccess: () => {
      toast.success('Vai trò đã được xóa thành công!');
      queryClient.invalidateQueries(['roles']);
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa vai trò: ' + (error.response?.data?.message || error.message));
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: ({ employeeId, roleIds }) => employeeService.updateEmployeeRoles(employeeId, roleIds),
    onSuccess: () => {
      toast.success('Vai trò đã được gán thành công!');
      queryClient.invalidateQueries(['employees']);
      setShowAssignRoleModal(false);
      setSelectedEmployee(null);
    },
    onError: (error) => {
      toast.error('Lỗi khi gán vai trò: ' + (error.response?.data?.message || error.message));
    },
  });

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' ||
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStore = filterStore === '' || employee.storeID === filterStore;

    return matchesSearch && matchesStore;
  });

  // Handle role creation
  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleData.roleName.trim()) {
      toast.error('Vui lòng nhập tên vai trò!');
      return;
    }
    if (newRoleData.roleName.trim().toLowerCase() === 'admin') {
      toast.error('Không được phép tạo vai trò Admin!');
      return;
    }
    createRoleMutation.mutate(newRoleData);
  };

  // Handle role update
  const handleUpdateRole = (e) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (selectedRole.roleName.trim().toLowerCase() === 'admin') {
      toast.error('Không được phép đổi tên vai trò thành Admin!');
      return;
    }
    updateRoleMutation.mutate({
      roleId: selectedRole.roleID,
      data: selectedRole
    });
  };

  // Handle role deletion
  const handleDeleteRole = (role) => {
    if (role.roleName === 'Admin') {
      toast.error('Không được phép xóa vai trò Admin!');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa vai trò "${role.roleName}"?`)) {
      deleteRoleMutation.mutate(role.roleID);
    }
  };

  // Handle permission change
  const handlePermissionChange = (permissionId, isSelected, targetData, setTargetData) => {
    const newPermissions = isSelected
      ? [...targetData.permissions, permissionId]
      : targetData.permissions.filter(p => p !== permissionId);

    setTargetData(prev => ({
      ...prev,
      permissions: newPermissions
    }));
  };

  // Handle role assignment
  const handleAssignRole = (employee) => {
    setSelectedEmployee({
      ...employee,
      roleIds: employee.roles?.map(r => r.roleID) || []
    });
    setShowAssignRoleModal(true);
  };

  const handleEmployeeRoleChange = (roleId) => {
    if (!selectedEmployee) return;

    const newRoleIds = selectedEmployee.roleIds.includes(roleId)
      ? selectedEmployee.roleIds.filter(id => id !== roleId)
      : [...selectedEmployee.roleIds, roleId];

    setSelectedEmployee(prev => ({
      ...prev,
      roleIds: newRoleIds
    }));
  };

  const handleSaveEmployeeRoles = () => {
    if (!selectedEmployee) return;
    assignRoleMutation.mutate({
      employeeId: selectedEmployee.employeeID,
      roleIds: selectedEmployee.roleIds
    });
  };

  // Group permissions by category
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phân quyền & Vai trò</h1>
          <p className="text-gray-600 mt-1">Quản lý vai trò, quyền hạn và phân quyền cho nhân viên</p>
        </div>
        <button
          onClick={() => setShowCreateRoleModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo vai trò mới
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'roles'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Shield className="w-4 h-4" />
          Quản lý vai trò
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'assignments'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Users className="w-4 h-4" />
          Phân quyền nhân viên
        </button>
      </div>

      {/* Role Management Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rolesLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải vai trò...</p>
              </div>
            ) : (
              roles
                .filter(role => role.roleName !== 'Admin') // Lọc bỏ Admin role
                .map(role => (
                  <div key={role.roleID} className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{role.roleName}</h3>
                        <p className="text-sm text-gray-600 mt-1">{role.description || 'Không có mô tả'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setShowEditRoleModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Quyền hạn: {role.permissions?.length || 0} quyền</p>
                      <p>Được sử dụng: {employees.filter(emp => emp.roles?.some(r => r.roleID === role.roleID)).length} nhân viên</p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Employee Role Assignment Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="min-w-48">
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={storesLoading}
                >
                  <option value="">Tất cả cửa hàng</option>
                  {stores.map(store => (
                    <option key={store.storeID} value={store.storeID}>
                      {store.storeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Employee List */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cửa hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò hiện tại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeesLoading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Đang tải nhân viên...</p>
                      </td>
                    </tr>
                  ) : filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Không có nhân viên nào phù hợp
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map(employee => (
                      <tr key={employee.employeeID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {employee.firstName?.[0]}{employee.lastName?.[0]}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {employee.firstName} {employee.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {stores.find(s => s.storeID === employee.storeID)?.storeName || 'Chưa chỉ định'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {employee.roles?.filter(role => role.roleName !== 'Admin').length > 0 ? (
                              employee.roles
                                .filter(role => role.roleName !== 'Admin') // Lọc bỏ Admin role
                                .map(role => (
                                  <span
                                    key={role.roleID}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {role.roleName}
                                  </span>
                                ))
                            ) : (
                              <span className="text-sm text-gray-500">Chưa có vai trò</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {employee.isActive ? (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Hoạt động
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 mr-1" />
                                Không hoạt động
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleAssignRole(employee)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Settings className="w-4 h-4" />
                            Phân quyền
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tạo vai trò mới</h2>
              <button
                onClick={() => setShowCreateRoleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên vai trò <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRoleData.roleName}
                  onChange={(e) => setNewRoleData(prev => ({ ...prev, roleName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên vai trò"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={newRoleData.description}
                  onChange={(e) => setNewRoleData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả vai trò"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Quyền hạn
                </label>
                <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="space-y-2 ml-4">
                        {permissions.map(permission => (
                          <label key={permission.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newRoleData.permissions.includes(permission.id)}
                              onChange={(e) => handlePermissionChange(
                                permission.id,
                                e.target.checked,
                                newRoleData,
                                setNewRoleData
                              )}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateRoleModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createRoleMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createRoleMutation.isPending ? 'Đang tạo...' : 'Tạo vai trò'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa vai trò</h2>
              <button
                onClick={() => {
                  setShowEditRoleModal(false);
                  setSelectedRole(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên vai trò <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={selectedRole.roleName}
                  onChange={(e) => setSelectedRole(prev => ({ ...prev, roleName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên vai trò"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={selectedRole.description || ''}
                  onChange={(e) => setSelectedRole(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả vai trò"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Quyền hạn
                </label>
                <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category}>
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="space-y-2 ml-4">
                        {permissions.map(permission => (
                          <label key={permission.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={(selectedRole.permissions || []).includes(permission.id)}
                              onChange={(e) => handlePermissionChange(
                                permission.id,
                                e.target.checked,
                                selectedRole,
                                setSelectedRole
                              )}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditRoleModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={updateRoleMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {updateRoleMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Role Modal */}
      {showAssignRoleModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Phân quyền nhân viên</h2>
              <button
                onClick={() => {
                  setShowAssignRoleModal(false);
                  setSelectedEmployee(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">
                    {selectedEmployee.firstName?.[0]}{selectedEmployee.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <div className="text-lg font-medium text-gray-900">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{selectedEmployee.email}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Chọn vai trò:
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {roles
                  .filter(role => role.roleName !== 'Admin') // Lọc bỏ Admin role
                  .map(role => (
                    <label key={role.roleID} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployee.roleIds.includes(role.roleID)}
                        onChange={() => handleEmployeeRoleChange(role.roleID)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{role.roleName}</div>
                        {role.description && (
                          <div className="text-xs text-gray-500">{role.description}</div>
                        )}
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <button
                onClick={() => {
                  setShowAssignRoleModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveEmployeeRoles}
                disabled={assignRoleMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {assignRoleMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermissionPage;