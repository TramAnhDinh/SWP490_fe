import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Settings, Save, RefreshCw, Eye, EyeOff, Globe, Bell, Shield,
    Palette, Database, Users, Lock, Key, Monitor, Smartphone,
    CheckCircle, AlertTriangle, Info, ChevronRight, Download, Upload
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';

const SystemSettingsPage = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('general');
    const [showPassword, setShowPassword] = useState(false);

    // Mock system settings data
    const [systemSettings, setSystemSettings] = useState({
        general: {
            companyName: 'DecalXe',
            systemTitle: 'DecalXe Management System',
            timezone: 'Asia/Ho_Chi_Minh',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            language: 'vi',
            currency: 'VND'
        },
        appearance: {
            theme: 'light',
            primaryColor: '#3B82F6',
            sidebarCollapsed: false,
            compactMode: false,
            showAnimations: true
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            orderUpdates: true,
            systemAlerts: true,
            marketingEmails: false,
            notificationSound: true
        },
        security: {
            sessionTimeout: 30,
            requirePasswordChange: 90,
            maxLoginAttempts: 5,
            twoFactorAuth: false,
            ipWhitelist: [],
            auditLogging: true
        },
        backup: {
            autoBackup: true,
            backupFrequency: 'daily',
            backupRetention: 30,
            backupLocation: 'local',
            lastBackup: '2024-01-15 02:00:00'
        }
    });

    // Mock mutations
    const updateSettingsMutation = useMutation({
        mutationFn: async (settings) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return settings;
        },
        onSuccess: () => {
            toast.success('Đã cập nhật cài đặt hệ thống');
            queryClient.invalidateQueries(['systemSettings']);
        },
        onError: () => {
            toast.error('Lỗi khi cập nhật cài đặt');
        }
    });

    const backupSystemMutation = useMutation({
        mutationFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { success: true, timestamp: new Date().toISOString() };
        },
        onSuccess: () => {
            toast.success('Đã tạo backup hệ thống thành công');
        },
        onError: () => {
            toast.error('Lỗi khi tạo backup');
        }
    });

    const handleSettingChange = (category, key, value) => {
        setSystemSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSaveSettings = () => {
        updateSettingsMutation.mutate(systemSettings);
    };

    const handleBackup = () => {
        backupSystemMutation.mutate();
    };

    const tabs = [
        { id: 'general', name: 'Cài đặt chung', icon: Settings },
        { id: 'appearance', name: 'Giao diện', icon: Palette },
        { id: 'notifications', name: 'Thông báo', icon: Bell },
        { id: 'security', name: 'Bảo mật', icon: Shield },
        { id: 'backup', name: 'Sao lưu', icon: Database }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
                    <p className="text-gray-600">Quản lý cấu hình và thiết lập hệ thống</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleBackup}
                        disabled={backupSystemMutation.isPending}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        {backupSystemMutation.isPending ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Sao lưu hệ thống
                    </Button>
                    <Button
                        onClick={handleSaveSettings}
                        disabled={updateSettingsMutation.isPending}
                        className="flex items-center gap-2"
                    >
                        {updateSettingsMutation.isPending ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Lưu cài đặt
                    </Button>
                </div>
            </div>

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
                <div className="min-h-[500px]">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Company Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin công ty</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tên công ty
                                            </label>
                                            <input
                                                type="text"
                                                value={systemSettings.general.companyName}
                                                onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tiêu đề hệ thống
                                            </label>
                                            <input
                                                type="text"
                                                value={systemSettings.general.systemTitle}
                                                onChange={(e) => handleSettingChange('general', 'systemTitle', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Regional Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt khu vực</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Múi giờ
                                            </label>
                                            <select
                                                value={systemSettings.general.timezone}
                                                onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                                                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                                                <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngôn ngữ
                                            </label>
                                            <select
                                                value={systemSettings.general.language}
                                                onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="vi">Tiếng Việt</option>
                                                <option value="en">English</option>
                                                <option value="zh">中文</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Theme Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Giao diện</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Chủ đề
                                            </label>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleSettingChange('appearance', 'theme', 'light')}
                                                    className={`p-3 border-2 rounded-lg ${systemSettings.appearance.theme === 'light'
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-8 h-6 bg-white border border-gray-300 rounded"></div>
                                                    <span className="text-xs mt-1">Sáng</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('appearance', 'theme', 'dark')}
                                                    className={`p-3 border-2 rounded-lg ${systemSettings.appearance.theme === 'dark'
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-8 h-6 bg-gray-800 border border-gray-600 rounded"></div>
                                                    <span className="text-xs mt-1">Tối</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('appearance', 'theme', 'auto')}
                                                    className={`p-3 border-2 rounded-lg ${systemSettings.appearance.theme === 'auto'
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-8 h-6 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded"></div>
                                                    <span className="text-xs mt-1">Tự động</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Layout Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bố cục</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Thu gọn sidebar</p>
                                                <p className="text-xs text-gray-500">Tự động thu gọn sidebar khi màn hình nhỏ</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={systemSettings.appearance.sidebarCollapsed}
                                                    onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
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

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Email Notifications */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo email</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Thông báo email</p>
                                                <p className="text-xs text-gray-500">Nhận thông báo qua email</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={systemSettings.notifications.emailNotifications}
                                                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Push Notifications */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo đẩy</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Thông báo đẩy</p>
                                                <p className="text-xs text-gray-500">Nhận thông báo trên trình duyệt</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={systemSettings.notifications.pushNotifications}
                                                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
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

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Session Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Phiên làm việc</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Thời gian timeout (phút)
                                            </label>
                                            <input
                                                type="number"
                                                min="5"
                                                max="480"
                                                value={systemSettings.security.sessionTimeout}
                                                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Security */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật nâng cao</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Xác thực 2 yếu tố</p>
                                                <p className="text-xs text-gray-500">Yêu cầu mã xác thực khi đăng nhập</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={systemSettings.security.twoFactorAuth}
                                                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
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

                    {activeTab === 'backup' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Backup Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt sao lưu</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Sao lưu tự động</p>
                                                <p className="text-xs text-gray-500">Tự động tạo backup theo lịch trình</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={systemSettings.backup.autoBackup}
                                                    onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Backup Status */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái sao lưu</h3>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Lần sao lưu cuối</span>
                                                <Badge className="bg-green-100 text-green-800">Thành công</Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{systemSettings.backup.lastBackup}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SystemSettingsPage;
