import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Shield,
  Users,
  MoreVertical,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Input, LoadingSpinner, Badge } from '../../components/common';
import { employeeService } from '../../services/employeeService';

const EmployeeListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get employees data
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees', searchTerm, filterRole, filterStatus],
    queryFn: () => employeeService.getEmployees({
      search: searchTerm,
      role: filterRole !== 'all' ? filterRole : undefined,
      isActive: filterStatus !== 'all' ? filterStatus === 'active' : undefined
    }),
  });

  // Get roles data
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: employeeService.getRoles,
  });

  // Get stores data
  const { data: stores = [] } = useQuery({
    queryKey: ['stores'],
    queryFn: employeeService.getStores,
  });

  // Toggle employee status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ employeeId, isActive }) =>
      employeeService.updateEmployeeStatus(employeeId, isActive),
    onSuccess: () => {
      toast.success('Trạng thái nhân viên đã được cập nhật!');
      queryClient.invalidateQueries(['employees']);
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật trạng thái: ' + error.message);
    },
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      toast.success('Nhân viên đã được xóa thành công!');
      queryClient.invalidateQueries(['employees']);
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa nhân viên: ' + error.message);
    },
  });

  const handleToggleStatus = (employeeId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'kích hoạt' : 'vô hiệu hóa';

    if (window.confirm(`Bạn có chắc chắn muốn ${action} nhân viên này?`)) {
      toggleStatusMutation.mutate({ employeeId, isActive: newStatus });
    }
  };

  const handleDelete = (employeeId, employeeName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${employeeName}"? Hành động này không thể hoàn tác.`)) {
      deleteMutation.mutate(employeeId);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedEmployees.length === 0) {
      toast.error('Vui lòng chọn ít nhất một nhân viên!');
      return;
    }

    const confirmMessage = action === 'activate'
      ? `Kích hoạt ${selectedEmployees.length} nhân viên đã chọn?`
      : action === 'deactivate'
        ? `Vô hiệu hóa ${selectedEmployees.length} nhân viên đã chọn?`
        : `Xóa ${selectedEmployees.length} nhân viên đã chọn?`;

    if (window.confirm(confirmMessage)) {
      // Handle bulk actions
      selectedEmployees.forEach(employeeId => {
        if (action === 'delete') {
          deleteMutation.mutate(employeeId);
        } else {
          toggleStatusMutation.mutate({
            employeeId,
            isActive: action === 'activate'
          });
        }
      });
      setSelectedEmployees([]);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'sales': return 'bg-green-100 text-green-800';
      case 'technician': return 'bg-orange-100 text-orange-800';
      case 'designer': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Lọc bỏ Admin khỏi danh sách employees
  const nonAdminEmployees = employees.filter(employee =>
    !employee.roles?.some(role => role.roleName === 'Admin')
  );

  const filteredEmployees = nonAdminEmployees.filter(employee => {
    const matchesSearch =
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phoneNumber?.includes(searchTerm);

    const matchesRole = filterRole === 'all' ||
      employee.roles?.some(role => role.roleName?.toLowerCase() === filterRole.toLowerCase());

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && employee.isActive) ||
      (filterStatus === 'inactive' && !employee.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhân viên</h1>
          <p className="text-gray-600">Quản lý thông tin và quyền hạn nhân viên</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleBulkAction('export')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </Button>
          <Link
            to="/employees/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm nhân viên
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng nhân viên</p>
              <p className="text-xl font-semibold">{nonAdminEmployees.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang hoạt động</p>
              <p className="text-xl font-semibold">
                {nonAdminEmployees.filter(emp => emp.isActive).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tạm dừng</p>
              <p className="text-xl font-semibold">
                {nonAdminEmployees.filter(emp => !emp.isActive).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Quản lý</p>
              <p className="text-xl font-semibold">
                {nonAdminEmployees.filter(emp =>
                  emp.roles?.some(role => role.roleName === 'Manager')
                ).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              {roles
                .filter(role => role.roleName !== 'Admin') // Lọc bỏ Admin khỏi dropdown
                .map(role => (
                  <option key={role.roleID} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEmployees.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              Đã chọn {selectedEmployees.length} nhân viên
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('activate')}
              >
                Kích hoạt
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('deactivate')}
              >
                Vô hiệu hóa
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('delete')}
                className="text-red-600 hover:text-red-700"
              >
                Xóa
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Employee Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees(filteredEmployees.map(emp => emp.employeeID));
                      } else {
                        setSelectedEmployees([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4">Nhân viên</th>
                <th className="text-left p-4">Vai trò</th>
                <th className="text-left p-4">Cửa hàng</th>
                <th className="text-left p-4">Liên hệ</th>
                <th className="text-left p-4">Trạng thái</th>
                <th className="text-left p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.employeeID} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.employeeID)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmployees([...selectedEmployees, employee.employeeID]);
                        } else {
                          setSelectedEmployees(selectedEmployees.filter(id => id !== employee.employeeID));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{employee.employeeID}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {employee.roles?.map(role => (
                        <Badge key={role.roleID} className={getRoleBadgeColor(role.roleName)}>
                          {role.roleName}
                        </Badge>
                      )) || <Badge className="bg-gray-100 text-gray-800">Chưa phân quyền</Badge>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {employee.storeName || 'Chưa phân công'}
                    </span>
                  </td>
                  <td className="p-4">
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
                  <td className="p-4">
                    <Badge className={employee.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }>
                      {employee.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/employees/${employee.employeeID}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/employees/${employee.employeeID}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(employee.employeeID, employee.isActive)}
                        className={employee.isActive
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-green-600 hover:text-green-700'
                        }
                      >
                        {employee.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(employee.employeeID, `${employee.firstName} ${employee.lastName}`)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Không tìm thấy nhân viên nào phù hợp với bộ lọc</p>
          </div>
        )}
      </Card>

      {/* Create Employee Modal */}
      {/* The create employee modal is removed as per the edit hint. */}
    </div>
  );
};

export default EmployeeListPage;