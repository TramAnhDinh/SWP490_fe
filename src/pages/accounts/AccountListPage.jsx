import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, Shield, User, Mail, Building } from 'lucide-react';
import { accountService } from '../../services/accountService';
import { Link } from 'react-router-dom';

const AccountListPage = () => {
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState({});

    // Get accounts data
    const { data: accounts = [], isLoading, error } = useQuery({
        queryKey: ['accounts'],
        queryFn: accountService.getAccounts,
    });

    // Lọc bỏ Admin khỏi danh sách accounts
    const nonAdminAccounts = accounts.filter(account =>
        account.roleName !== 'Admin'
    );

    // Delete account mutation
    const deleteMutation = useMutation({
        mutationFn: accountService.deleteAccount,
        onSuccess: () => {
            toast.success('Xóa tài khoản thành công!');
            queryClient.invalidateQueries(['accounts']);
        },
        onError: (error) => {
            toast.error('Lỗi khi xóa tài khoản: ' + (error.response?.data?.message || error.message));
        },
    });

    // Toggle account status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: accountService.updateAccountStatus,
        onSuccess: () => {
            toast.success('Cập nhật trạng thái thành công!');
            queryClient.invalidateQueries(['accounts']);
        },
        onError: (error) => {
            toast.error('Lỗi khi cập nhật trạng thái: ' + (error.response?.data?.message || error.message));
        },
    });

    const handleDelete = (id, roleName) => {
        if (roleName === 'Admin') {
            toast.error('Không được phép xóa tài khoản Admin!');
            return;
        }
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleToggleStatus = (id, currentStatus, roleName) => {
        if (roleName === 'Admin') {
            toast.error('Không được phép thay đổi trạng thái tài khoản Admin!');
            return;
        }
        toggleStatusMutation.mutate({ id, isActive: !currentStatus });
    };

    const togglePasswordVisibility = (accountId) => {
        setShowPassword(prev => ({
            ...prev,
            [accountId]: !prev[accountId]
        }));
    };

    const getAccountType = (account) => {
        if (account.employee) return { type: 'Employee', color: 'bg-blue-100 text-blue-800' };
        if (account.customer) return { type: 'Customer', color: 'bg-green-100 text-green-800' };
        return { type: 'Unassigned', color: 'bg-gray-100 text-gray-800' };
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Lỗi: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý tài khoản</h1>
                    <p className="text-gray-600 mt-1">Quản lý tất cả tài khoản trong hệ thống</p>
                </div>

            </div>

            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tài khoản
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thông tin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Loại
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
                            {nonAdminAccounts.map((account) => {
                                const accountType = getAccountType(account);
                                return (
                                    <tr key={account.accountID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <User className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {account.username}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {account.accountID}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    {account.email || 'Không có email'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                        {account.roleName || 'Không có vai trò'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {account.roleName || 'Không có vai trò'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${accountType.color}`}>
                                                {accountType.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleStatus(account.accountID, account.isActive, account.roleName)}
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${account.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                            >
                                                {account.isActive ? 'Hoạt động' : 'Khóa'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/accounts/${account.accountID}/edit`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(account.accountID, account.roleName)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {nonAdminAccounts.length === 0 && (
                <div className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Không có tài khoản nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Chưa có tài khoản nào trong hệ thống.</p>
                </div>
            )}
        </div>
    );
};

export default AccountListPage;
