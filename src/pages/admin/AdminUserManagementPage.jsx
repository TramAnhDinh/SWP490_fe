import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    Shield,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Calendar,
    MapPin
} from 'lucide-react';
import { Card, Button, Badge, LoadingSpinner, Input, Modal } from '../../components/common';
import { accountService } from '../../services/accountService';
import { roleService } from '../../services/roleService';
import toast from 'react-hot-toast';

const AdminUserManagementPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Get all accounts
    const { data: accounts = [], isLoading: loadingAccounts } = useQuery({
        queryKey: ['admin-accounts'],
        queryFn: () => accountService.getAccounts(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Get all roles
    const { data: roles = [], isLoading: loadingRoles } = useQuery({
        queryKey: ['admin-roles'],
        queryFn: () => roleService.getRoles(),
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    // Delete account mutation
    const deleteAccountMutation = useMutation({
        mutationFn: (id) => accountService.deleteAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-accounts']);
            toast.success('Xóa tài khoản thành công');
            setShowDeleteModal(false);
            setUserToDelete(null);
        },
        onError: (error) => {
            toast.error('Lỗi khi xóa tài khoản: ' + error.message);
        }
    });

    // Change account status mutation
    const changeStatusMutation = useMutation({
        mutationFn: ({ id, status }) => accountService.changeAccountStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-accounts']);
            toast.success('Cập nhật trạng thái thành công');
        },
        onError: (error) => {
            toast.error('Lỗi khi cập nhật trạng thái: ' + error.message);
        }
    });

    // Filter accounts based on search and filters
    const filteredAccounts = accounts.filter(account => {
        const matchesSearch = account.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !filterRole || account.role === filterRole;
        const matchesStatus = !filterStatus || account.status === filterStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-red-100 text-red-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Suspended': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Admin': return 'bg-red-100 text-red-800';
            case 'Store Manager': return 'bg-blue-100 text-blue-800';
            case 'Designer': return 'bg-purple-100 text-purple-800';
            case 'Sales Staff': return 'bg-green-100 text-green-800';
            case 'Installation Tech': return 'bg-orange-100 text-orange-800';
            case 'Customer': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleEditUser = (userId) => {
        navigate(`/admin/users/${userId}/edit`);
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            deleteAccountMutation.mutate(userToDelete.id);
        }
    };

    const handleStatusChange = (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        changeStatusMutation.mutate({ id: userId, status: newStatus });
    };

    if (loadingAccounts || loadingRoles) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                    <p className="text-gray-600">Quản lý tài khoản và quyền truy cập hệ thống</p>
                </div>

                <Button
                    onClick={() => navigate('/admin/users/add')}
                    className="flex items-center space-x-2"
                >
                    <Plus className="h-4 w-4" />
                    <span>Thêm người dùng mới</span>
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả vai trò</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Active">Hoạt động</option>
                        <option value="Inactive">Không hoạt động</option>
                        <option value="Pending">Chờ duyệt</option>
                        <option value="Suspended">Tạm khóa</option>
                    </select>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm('');
                            setFilterRole('');
                            setFilterStatus('');
                        }}
                        className="flex items-center space-x-2"
                    >
                        <Filter className="h-4 w-4" />
                        <span>Xóa bộ lọc</span>
                    </Button>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đăng nhập cuối
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAccounts.map((account) => (
                                <tr key={account.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-gray-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {account.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {account.email}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    @{account.username}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={getRoleColor(account.role)}>
                                            {account.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge className={getStatusColor(account.status)}>
                                            {account.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {account.lastLogin ? formatDate(account.lastLogin) : 'Chưa đăng nhập'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleViewUser(account)}
                                                className="flex items-center space-x-1"
                                            >
                                                <Eye className="h-3 w-3" />
                                                <span>Xem</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEditUser(account.id)}
                                                className="flex items-center space-x-1"
                                            >
                                                <Edit3 className="h-3 w-3" />
                                                <span>Sửa</span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleStatusChange(account.id, account.status)}
                                                className={`flex items-center space-x-1 ${account.status === 'Active'
                                                    ? 'text-red-600 hover:text-red-700'
                                                    : 'text-green-600 hover:text-green-700'
                                                    }`}
                                            >
                                                {account.status === 'Active' ? (
                                                    <UserX className="h-3 w-3" />
                                                ) : (
                                                    <UserCheck className="h-3 w-3" />
                                                )}
                                                <span>
                                                    {account.status === 'Active' ? 'Khóa' : 'Kích hoạt'}
                                                </span>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteUser(account)}
                                                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                <span>Xóa</span>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAccounts.length === 0 && (
                    <div className="text-center py-8">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy người dùng</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterRole || filterStatus
                                ? 'Thử thay đổi bộ lọc tìm kiếm'
                                : 'Bắt đầu bằng cách thêm người dùng mới'
                            }
                        </p>
                    </div>
                )}
            </Card>

            {/* User Detail Modal */}
            <Modal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                title="Chi tiết người dùng"
            >
                {selectedUser && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users className="h-8 w-8 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {selectedUser.fullName}
                                </h3>
                                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                <p className="text-xs text-gray-400">@{selectedUser.username}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Vai trò</label>
                                <div className="mt-1">
                                    <Badge className={getRoleColor(selectedUser.role)}>
                                        {selectedUser.role}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                                <div className="mt-1">
                                    <Badge className={getStatusColor(selectedUser.status)}>
                                        {selectedUser.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Đăng nhập cuối</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Chưa đăng nhập'}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Ngày tạo</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {formatDate(selectedUser.createdAt)}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa người dùng"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.fullName}</strong> không?
                    </p>
                    <p className="text-xs text-red-600">
                        Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tài khoản này.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={confirmDeleteUser}
                            disabled={deleteAccountMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteAccountMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUserManagementPage;
