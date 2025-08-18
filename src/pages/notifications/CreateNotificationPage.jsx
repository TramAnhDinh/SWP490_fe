import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Bell,
    ArrowLeft,
    Save,
    Send,
    Users,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus,
    Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge, LoadingSpinner } from '../../components/common';
import { notificationService } from '../../services/notificationService';
import { employeeService } from '../../services/employeeService';
import { customerService } from '../../services/customerService';

const CreateNotificationPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'System',
        priority: 'medium',
        recipientType: 'all',
        recipientIds: [],
        scheduledAt: '',
        expiresAt: ''
    });

    const [isBulkMode, setIsBulkMode] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [showRecipientSelector, setShowRecipientSelector] = useState(false);

    // Mock data for employees and customers
    const employees = [
        { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' },
        { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com' },
        { id: '3', name: 'Lê Văn C', email: 'levanc@example.com' }
    ];

    const customers = [
        { id: '1', name: 'Khách hàng A', email: 'customerA@example.com' },
        { id: '2', name: 'Khách hàng B', email: 'customerB@example.com' },
        { id: '3', name: 'Khách hàng C', email: 'customerC@example.com' }
    ];

    // Mock mutations - no API calls
    const createNotificationMutation = {
        mutate: (data) => {
            console.log('Create notification disabled - using mock data');
            toast.success('Thông báo đã được tạo thành công!');
            navigate('/notifications');
        },
        isPending: false
    };

    const sendBulkNotificationMutation = {
        mutate: (data) => {
            console.log('Send bulk notification disabled - using mock data');
            toast.success('Thông báo hàng loạt đã được gửi thành công!');
            navigate('/notifications');
        },
        isPending: false
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRecipientTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            recipientType: type,
            recipientIds: []
        }));
        setSelectedRecipients([]);
    };

    const handleRecipientSelection = (recipientId, checked) => {
        if (checked) {
            setSelectedRecipients(prev => [...prev, recipientId]);
        } else {
            setSelectedRecipients(prev => prev.filter(id => id !== recipientId));
        }
    };

    const handleSelectAllRecipients = (checked) => {
        const allRecipients = formData.recipientType === 'employees'
            ? employees.map(emp => emp.employeeID)
            : customers.map(cust => cust.customerID);

        if (checked) {
            setSelectedRecipients(allRecipients);
        } else {
            setSelectedRecipients([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề thông báo');
            return;
        }

        if (!formData.message.trim()) {
            toast.error('Vui lòng nhập nội dung thông báo');
            return;
        }

        if (formData.recipientType !== 'all' && selectedRecipients.length === 0) {
            toast.error('Vui lòng chọn ít nhất một người nhận');
            return;
        }

        try {
            if (isBulkMode) {
                // Send bulk notification
                await sendBulkNotificationMutation.mutateAsync({
                    title: formData.title,
                    message: formData.message,
                    type: formData.type,
                    priority: formData.priority,
                    recipientIds: selectedRecipients,
                    recipientType: formData.recipientType,
                    scheduledAt: formData.scheduledAt || undefined
                });
            } else {
                // Create single notification
                await createNotificationMutation.mutateAsync({
                    title: formData.title,
                    message: formData.message,
                    type: formData.type,
                    priority: formData.priority,
                    recipientId: formData.recipientType === 'all' ? null : selectedRecipients[0],
                    recipientType: formData.recipientType,
                    scheduledAt: formData.scheduledAt || undefined,
                    expiresAt: formData.expiresAt || undefined
                });
            }
        } catch (error) {
            console.error('Error submitting notification:', error);
        }
    };

    const getNotificationTypeIcon = (type) => {
        switch (type) {
            case 'Order':
                return '📦';
            case 'Installation':
                return '🔧';
            case 'Design':
                return '🎨';
            case 'Customer':
                return '👤';
            case 'System':
                return '⚙️';
            default:
                return '📢';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRecipientDisplayName = (recipientId) => {
        if (formData.recipientType === 'employees') {
            const employee = employees.find(emp => emp.employeeID === recipientId);
            return employee ? `${employee.firstName} ${employee.lastName}` : recipientId;
        } else {
            const customer = customers.find(cust => cust.customerID === recipientId);
            return customer ? customer.fullName : recipientId;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => navigate('/notifications')}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isBulkMode ? 'Gửi thông báo hàng loạt' : 'Tạo thông báo mới'}
                        </h1>
                        <p className="text-gray-600">
                            {isBulkMode
                                ? 'Gửi thông báo cho nhiều người dùng cùng lúc'
                                : 'Tạo và gửi thông báo mới trong hệ thống'
                            }
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsBulkMode(!isBulkMode)}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        {isBulkMode ? <Bell className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        {isBulkMode ? 'Chế độ đơn lẻ' : 'Chế độ hàng loạt'}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề thông báo *
                            </label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Nhập tiêu đề thông báo..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại thông báo
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="System">Hệ thống</option>
                                <option value="Order">Đơn hàng</option>
                                <option value="Installation">Lắp đặt</option>
                                <option value="Design">Thiết kế</option>
                                <option value="Customer">Khách hàng</option>
                            </select>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung thông báo *
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Nhập nội dung thông báo..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Priority and Scheduling */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mức độ ưu tiên
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lên lịch gửi (tùy chọn)
                            </label>
                            <input
                                type="datetime-local"
                                name="scheduledAt"
                                value={formData.scheduledAt}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hết hạn (tùy chọn)
                            </label>
                            <input
                                type="datetime-local"
                                name="expiresAt"
                                value={formData.expiresAt}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Recipients */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Người nhận
                        </label>
                        <div className="space-y-4">
                            {/* Recipient Type Selection */}
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="recipientType"
                                        value="all"
                                        checked={formData.recipientType === 'all'}
                                        onChange={(e) => handleRecipientTypeChange(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Tất cả người dùng</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="recipientType"
                                        value="employees"
                                        checked={formData.recipientType === 'employees'}
                                        onChange={(e) => handleRecipientTypeChange(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Nhân viên</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="recipientType"
                                        value="customers"
                                        checked={formData.recipientType === 'customers'}
                                        onChange={(e) => handleRecipientTypeChange(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">Khách hàng</span>
                                </label>
                            </div>

                            {/* Recipient Selection */}
                            {formData.recipientType !== 'all' && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">
                                            {formData.recipientType === 'employees' ? 'Chọn nhân viên:' : 'Chọn khách hàng:'}
                                        </span>
                                        <Button
                                            type="button"
                                            onClick={() => setShowRecipientSelector(!showRecipientSelector)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {showRecipientSelector ? 'Ẩn danh sách' : 'Hiển thị danh sách'}
                                        </Button>
                                    </div>

                                    {showRecipientSelector && (
                                        <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                                            <div className="mb-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRecipients.length === (formData.recipientType === 'employees' ? employees.length : customers.length)}
                                                        onChange={(e) => handleSelectAllRecipients(e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm font-medium">Chọn tất cả</span>
                                                </label>
                                            </div>
                                            <div className="space-y-2">
                                                {(formData.recipientType === 'employees' ? employees : customers).map((recipient) => (
                                                    <label key={recipient.employeeID || recipient.customerID} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRecipients.includes(recipient.employeeID || recipient.customerID)}
                                                            onChange={(e) => handleRecipientSelection(recipient.employeeID || recipient.customerID, e.target.checked)}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">
                                                            {formData.recipientType === 'employees'
                                                                ? `${recipient.firstName} ${recipient.lastName}`
                                                                : recipient.fullName
                                                            }
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Selected Recipients Display */}
                                    {selectedRecipients.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Đã chọn {selectedRecipients.length} người nhận:
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRecipients.slice(0, 5).map((recipientId) => (
                                                    <Badge key={recipientId} className="bg-blue-100 text-blue-800">
                                                        {getRecipientDisplayName(recipientId)}
                                                    </Badge>
                                                ))}
                                                {selectedRecipients.length > 5 && (
                                                    <Badge className="bg-gray-100 text-gray-800">
                                                        +{selectedRecipients.length - 5} khác
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Xem trước thông báo:</h3>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 text-2xl">
                                    {getNotificationTypeIcon(formData.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-medium text-gray-900">
                                            {formData.title || 'Tiêu đề thông báo'}
                                        </h4>
                                        <Badge className={getPriorityColor(formData.priority)}>
                                            {formData.priority === 'high' ? 'Cao' : formData.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {formData.message || 'Nội dung thông báo sẽ hiển thị ở đây...'}
                                    </p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        Gửi cho: {formData.recipientType === 'all'
                                            ? 'Tất cả người dùng'
                                            : `${selectedRecipients.length} ${formData.recipientType === 'employees' ? 'nhân viên' : 'khách hàng'}`
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            onClick={() => navigate('/notifications')}
                            variant="outline"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={createNotificationMutation.isLoading || sendBulkNotificationMutation.isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {createNotificationMutation.isLoading || sendBulkNotificationMutation.isLoading ? (
                                <LoadingSpinner className="w-4 h-4 mr-2" />
                            ) : isBulkMode ? (
                                <Send className="w-4 h-4 mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {isBulkMode ? 'Gửi thông báo hàng loạt' : 'Tạo thông báo'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateNotificationPage;
