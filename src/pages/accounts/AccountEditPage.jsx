import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Shield, User } from 'lucide-react';
import { accountService } from '../../services/accountService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchableSelect from '../../components/ui/SearchableSelect';

const AccountEditPage = () => {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        roleID: '',
        isActive: true,
    });

    const [errors, setErrors] = useState({});

    // Get account data
    const { data: account, isLoading: isAccountLoading, error: accountError } = useQuery({
        queryKey: ['accounts', accountId],
        queryFn: () => accountService.getAccountById(accountId),
        enabled: !!accountId,
    });

    // Get roles data
    const { data: roles = [], isLoading: isRolesLoading } = useQuery({
        queryKey: ['roles'],
        queryFn: () => accountService.getRoles?.() || Promise.resolve([]),
    });

    // Update account mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => accountService.updateAccount(id, data),
        onSuccess: () => {
            toast.success('Cập nhật tài khoản thành công!');
            queryClient.invalidateQueries(['accounts']);
            navigate('/accounts');
        },
        onError: (error) => {
            toast.error('Lỗi khi cập nhật: ' + (error.response?.data?.message || error.message));
        },
    });

    // Load account data into form
    useEffect(() => {
        if (account) {
            setFormData({
                roleID: account.roleID || '',
                isActive: account.isActive ?? true,
            });
        }
    }, [account]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.roleID) {
            newErrors.roleID = 'Vai trò là bắt buộc';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
            return;
        }

        const updateData = {
            roleID: formData.roleID,
            isActive: formData.isActive,
        };

        updateMutation.mutate({ id: accountId, data: updateData });
    };

    if (isAccountLoading || isRolesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (accountError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải dữ liệu</h3>
                    <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
                    <Button onClick={() => navigate('/accounts')}>
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/accounts')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tài khoản</h1>
                        <p className="text-gray-600 mt-1">Cập nhật vai trò và trạng thái hoạt động của tài khoản</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Information */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Thông Tin Tài Khoản</h2>
                            </div>

                            <div className="space-y-4">
                                <SearchableSelect
                                    label="Vai trò"
                                    value={formData.roleID}
                                    onChange={(value) => handleInputChange('roleID', value)}
                                    options={roles}
                                    getOptionLabel={(role) => role.roleName}
                                    getOptionValue={(role) => role.roleID}
                                    placeholder="Chọn vai trò..."
                                    error={errors.roleID}
                                    required
                                />

                                <div className="flex items-center gap-2 mt-6">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                        Tài khoản hoạt động
                                    </label>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Buttons */}
                        <Card className="p-4">
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? (
                                        <div className="flex items-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            Đang cập nhật...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Lưu thay đổi
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/accounts')}
                                    disabled={updateMutation.isPending}
                                >
                                    Hủy bỏ
                                </Button>
                            </div>
                        </Card>

                        {/* Current Account Info */}
                        {account && (
                            <Card className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    Thông Tin Hiện Tại
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tài khoản:</span>
                                        <span className="font-medium">{account.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="font-medium">{account.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Vai trò:</span>
                                        <span className="font-medium">{account.roleName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Trạng thái:</span>
                                        <span className={`font-medium ${account.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {account.isActive ? 'Hoạt động' : 'Khóa'}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Help Card */}
                        <Card className="p-4 bg-blue-50 border-blue-200">
                            <div className="flex items-start gap-2">
                                <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Lưu ý:</p>
                                    <ul className="space-y-1 text-blue-700">
                                        <li>• Chỉ có thể thay đổi vai trò và trạng thái</li>
                                        <li>• Thông tin cá nhân cần chỉnh sửa ở trang nhân viên</li>
                                        <li>• Thay đổi sẽ có hiệu lực ngay lập tức</li>
                                        <li>• Tài khoản bị khóa sẽ không thể đăng nhập</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AccountEditPage;
