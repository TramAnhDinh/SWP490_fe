import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    Shield,
    User,
    Mail,
    Eye,
    EyeOff,
    ArrowLeft,
    Save
} from 'lucide-react';
import { accountService } from '../../services/accountService';
import { employeeService } from '../../services/employeeService';
import { roleService } from '../../services/roleService';

const AddAccountPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        roleID: '',
        isActive: true
    });

    // Get roles data
    const { data: roles = [], isLoading: rolesLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: () => roleService.getRoles(),
    });

    // Create account mutation
    const createAccountMutation = useMutation({
        mutationFn: accountService.createAccount,
        onSuccess: async (createdAccount) => {
            toast.success('Tài khoản đã được tạo thành công!');

            // Tự động tạo Employee với Account vừa tạo
            try {
                const employeeData = {
                    firstName: formData.username, // Tạm thời dùng username làm firstName
                    lastName: '', // Để trống, employee sẽ cập nhật sau
                    email: formData.email || null,
                    phoneNumber: '', // Để trống, employee sẽ cập nhật sau
                    address: '', // Để trống, employee sẽ cập nhật sau
                    storeID: '', // Để trống, employee sẽ cập nhật sau
                    accountID: createdAccount.accountID, // Liên kết với account vừa tạo
                    isActive: formData.isActive
                };

                await employeeService.createEmployee(employeeData);
                toast.success('Nhân viên đã được tạo tự động!');
                queryClient.invalidateQueries(['employees']);
            } catch (employeeError) {
                toast.error('Tạo tài khoản thành công nhưng lỗi khi tạo nhân viên: ' + employeeError.message);
            }

            queryClient.invalidateQueries(['accounts']);
            navigate('/accounts');
        },
        onError: (error) => {
            toast.error('Lỗi khi tạo tài khoản: ' + (error.response?.data?.message || error.message));
        },
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.username || !formData.password || !formData.roleID) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        try {
            await createAccountMutation.mutateAsync({
                Username: formData.username,
                PasswordHash: formData.password, // Lưu password đúng như user nhập
                Email: formData.email || null,
                RoleID: formData.roleID,
                IsActive: formData.isActive
            });
        } catch (error) {
            // Error đã được xử lý trong onError của mutation
        }
    };

    const handleGenerateUsername = () => {
        const username = `user${Date.now().toString().slice(-6)}`;
        setFormData(prev => ({
            ...prev,
            username: username
        }));
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/accounts')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thêm tài khoản mới</h1>
                    <p className="text-gray-600 mt-1">Tạo tài khoản và tự động tạo hồ sơ nhân viên</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        Thông tin tài khoản
                    </h2>
                    <p className="text-sm text-blue-600 mb-4 bg-blue-50 p-3 rounded-lg">
                        💡 <strong>Lưu ý:</strong> Sau khi tạo tài khoản, hệ thống sẽ tự động tạo hồ sơ nhân viên.
                        Nhân viên có thể đăng nhập và cập nhật thông tin cá nhân sau.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateUsername}
                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                    Tự động
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập mật khẩu"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vai trò <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="roleID"
                                value={formData.roleID}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={rolesLoading}
                                required
                            >
                                <option value="">Chọn vai trò</option>
                                {roles.map(role => (
                                    <option key={role.roleID} value={role.roleID}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">
                                Tài khoản hoạt động
                            </label>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/accounts')}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={createAccountMutation.isPending || rolesLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {createAccountMutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAccountPage;
