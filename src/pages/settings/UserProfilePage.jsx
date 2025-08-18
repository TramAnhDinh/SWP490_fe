import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    User, Mail, Phone, MapPin, Calendar, Shield, Eye, EyeOff,
    Camera, Save, Edit, Key, Settings, Bell, Globe, Palette,
    CheckCircle, AlertTriangle, Info, ChevronRight, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import RolePermissionsDisplay from '../../components/auth/RolePermissionsDisplay';

const UserProfilePage = () => {
    const { user, updateUser } = useAuth();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Mock user profile data
    const [profileData, setProfileData] = useState({
        personal: {
            firstName: user?.firstName || 'Nguyễn',
            lastName: user?.lastName || 'Văn A',
            email: user?.email || 'nguyenvana@example.com',
            phone: user?.phone || '0123456789',
            address: user?.address || '123 Đường ABC, Quận 1, TP.HCM',
            dateOfBirth: user?.dateOfBirth || '1990-01-01',
            gender: user?.gender || 'male',
            avatar: user?.avatar || null
        },
        security: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            twoFactorEnabled: false,
            lastPasswordChange: '2024-01-01 10:00:00',
            lastLogin: '2024-01-15 14:30:00'
        },
        preferences: {
            language: 'vi',
            timezone: 'Asia/Ho_Chi_Minh',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            theme: 'light',
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false
        }
    });

    // Mock mutations
    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return data;
        },
        onSuccess: (data) => {
            updateUser(data);
            toast.success('Đã cập nhật thông tin cá nhân');
            queryClient.invalidateQueries(['userProfile']);
        },
        onError: () => {
            toast.error('Lỗi khi cập nhật thông tin');
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (passwordData) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true };
        },
        onSuccess: () => {
            toast.success('Đã đổi mật khẩu thành công');
            setProfileData(prev => ({
                ...prev,
                security: {
                    ...prev.security,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }
            }));
        },
        onError: () => {
            toast.error('Lỗi khi đổi mật khẩu');
        }
    });

    const handleProfileChange = (category, key, value) => {
        setProfileData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSaveProfile = () => {
        updateProfileMutation.mutate(profileData.personal);
    };

    const handleChangePassword = () => {
        if (profileData.security.newPassword !== profileData.security.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }
        if (profileData.security.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        changePasswordMutation.mutate({
            currentPassword: profileData.security.currentPassword,
            newPassword: profileData.security.newPassword
        });
    };

    const handleAvatarUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                handleProfileChange('personal', 'avatar', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const tabs = [
        { id: 'profile', name: 'Thông tin cá nhân', icon: User },
        { id: 'security', name: 'Bảo mật', icon: Shield },
        { id: 'preferences', name: 'Tùy chọn', icon: Settings },
        { id: 'permissions', name: 'Quyền hạn', icon: Shield }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hồ sơ người dùng</h1>
                    <p className="text-gray-600">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
                </div>
                <Button
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center gap-2"
                >
                    {updateProfileMutation.isPending ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Lưu thay đổi
                </Button>
            </div>

            {/* Profile Overview */}
            <Card className="p-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {profileData.personal.avatar ? (
                                <img
                                    src={profileData.personal.avatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-gray-400" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                            <Camera className="w-4 h-4" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {profileData.personal.firstName} {profileData.personal.lastName}
                        </h2>
                        <p className="text-gray-600">{profileData.personal.email}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Hoạt động
                            </Badge>
                            <span className="text-sm text-gray-500">
                                Thành viên từ {new Date(user?.createdAt || '2024-01-01').toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Tabs */}
            <Card className="p-6">
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Họ
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.personal.firstName}
                                                    onChange={(e) => handleProfileChange('personal', 'firstName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tên
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.personal.lastName}
                                                    onChange={(e) => handleProfileChange('personal', 'lastName', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.personal.email}
                                                onChange={(e) => handleProfileChange('personal', 'email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.personal.phone}
                                                onChange={(e) => handleProfileChange('personal', 'phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Địa chỉ
                                            </label>
                                            <textarea
                                                value={profileData.personal.address}
                                                onChange={(e) => handleProfileChange('personal', 'address', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày sinh
                                            </label>
                                            <input
                                                type="date"
                                                value={profileData.personal.dateOfBirth}
                                                onChange={(e) => handleProfileChange('personal', 'dateOfBirth', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Giới tính
                                            </label>
                                            <select
                                                value={profileData.personal.gender}
                                                onChange={(e) => handleProfileChange('personal', 'gender', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Account Statistics */}
                                    <div className="mt-6">
                                        <h4 className="text-md font-medium text-gray-900 mb-3">Thống kê tài khoản</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <p className="text-sm text-blue-600">Đăng nhập lần cuối</p>
                                                <p className="text-sm font-medium text-blue-900">
                                                    {new Date(profileData.security.lastLogin).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-sm text-green-600">Đổi mật khẩu lần cuối</p>
                                                <p className="text-sm font-medium text-green-900">
                                                    {new Date(profileData.security.lastPasswordChange).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Change Password */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={profileData.security.currentPassword}
                                                    onChange={(e) => handleProfileChange('security', 'currentPassword', e.target.value)}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={profileData.security.newPassword}
                                                    onChange={(e) => handleProfileChange('security', 'newPassword', e.target.value)}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={profileData.security.confirmPassword}
                                                    onChange={(e) => handleProfileChange('security', 'confirmPassword', e.target.value)}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleChangePassword}
                                            disabled={changePasswordMutation.isPending}
                                            className="w-full"
                                        >
                                            {changePasswordMutation.isPending ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                                                    Đang đổi mật khẩu...
                                                </>
                                            ) : (
                                                <>
                                                    <Key className="w-4 h-4 mr-2" />
                                                    Đổi mật khẩu
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Security Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt bảo mật</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Xác thực 2 yếu tố</p>
                                                <p className="text-xs text-gray-500">Tăng cường bảo mật tài khoản</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.security.twoFactorEnabled}
                                                    onChange={(e) => handleProfileChange('security', 'twoFactorEnabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Security Tips */}
                                    <div className="mt-6">
                                        <h4 className="text-md font-medium text-gray-900 mb-3">Mẹo bảo mật</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Sử dụng mật khẩu mạnh</p>
                                                    <p className="text-xs text-gray-600">Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Key className="w-5 h-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Bật xác thực 2 yếu tố</p>
                                                    <p className="text-xs text-gray-600">Thêm lớp bảo mật cho tài khoản</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Không chia sẻ thông tin đăng nhập</p>
                                                    <p className="text-xs text-gray-600">Bảo vệ thông tin cá nhân của bạn</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Language & Region */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ngôn ngữ & Khu vực</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngôn ngữ
                                            </label>
                                            <select
                                                value={profileData.preferences.language}
                                                onChange={(e) => handleProfileChange('preferences', 'language', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="vi">Tiếng Việt</option>
                                                <option value="en">English</option>
                                                <option value="zh">中文</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Múi giờ
                                            </label>
                                            <select
                                                value={profileData.preferences.timezone}
                                                onChange={(e) => handleProfileChange('preferences', 'timezone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                                                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                                                <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Định dạng ngày
                                            </label>
                                            <select
                                                value={profileData.preferences.dateFormat}
                                                onChange={(e) => handleProfileChange('preferences', 'dateFormat', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Định dạng giờ
                                            </label>
                                            <select
                                                value={profileData.preferences.timeFormat}
                                                onChange={(e) => handleProfileChange('preferences', 'timeFormat', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="24h">24 giờ</option>
                                                <option value="12h">12 giờ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Appearance & Notifications */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Giao diện & Thông báo</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Chủ đề
                                            </label>
                                            <select
                                                value={profileData.preferences.theme}
                                                onChange={(e) => handleProfileChange('preferences', 'theme', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="light">Sáng</option>
                                                <option value="dark">Tối</option>
                                                <option value="auto">Tự động</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Thông báo email</p>
                                                <p className="text-xs text-gray-500">Nhận thông báo qua email</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.preferences.emailNotifications}
                                                    onChange={(e) => handleProfileChange('preferences', 'emailNotifications', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Thông báo đẩy</p>
                                                <p className="text-xs text-gray-500">Nhận thông báo trên trình duyệt</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.preferences.pushNotifications}
                                                    onChange={(e) => handleProfileChange('preferences', 'pushNotifications', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Email marketing</p>
                                                <p className="text-xs text-gray-500">Nhận thông tin khuyến mãi</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.preferences.marketingEmails}
                                                    onChange={(e) => handleProfileChange('preferences', 'marketingEmails', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Permissions Tab */}
                    {activeTab === 'permissions' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quyền hạn hiện tại</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Dưới đây là danh sách các quyền hạn mà bạn có trong hệ thống
                                </p>
                                <RolePermissionsDisplay />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default UserProfilePage;
