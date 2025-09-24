import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Palette,
    Clock,
    CheckCircle,
    AlertCircle,
    Eye,
    Edit3,
    Plus,
    Star,
    MessageSquare,
    Download,
    Upload,
    Car,
    Bike,
    Truck,
    Users,
    Calendar,
    TrendingUp,
    FileText,
    Layers,
    Zap,
    Send,
    CheckSquare,
    FileImage,
    Archive
} from 'lucide-react';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService } from '../../services/analyticsService';
import { designService } from '../../services/designService';
import { orderService } from '../../services/orderService';

const DesignerDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    // Get designer analytics data from API
    const { data: designerAnalytics, isLoading: loadingAnalytics } = useQuery({
        queryKey: ['designer-analytics', user?.userId, selectedPeriod],
        queryFn: () => designService.getDesignAnalytics({
            designerId: user?.userId,
            period: selectedPeriod
        }),
        enabled: !!user?.userId
    });

    // Get designer's pending design requests
    const { data: pendingRequests = [], isLoading: loadingRequests } = useQuery({
        queryKey: ['designer-pending-requests', user?.userId],
        queryFn: () => designService.getPendingDesignRequests({
            designerId: user?.userId
        }),
        enabled: !!user?.userId
    });

    // Get designer's designs in progress
    const { data: inProgressDesigns = [], isLoading: loadingInProgress } = useQuery({
        queryKey: ['designer-in-progress', user?.userId],
        queryFn: () => designService.getDesigns({
            designerId: user?.userId,
            status: 'In Progress',
            limit: 10
        }),
        enabled: !!user?.userId
    });

    // Get completed designs ready for installation
    const { data: readyForInstallation = [], isLoading: loadingReady } = useQuery({
        queryKey: ['designer-ready-installation', user?.userId],
        queryFn: () => designService.getDesigns({
            designerId: user?.userId,
            status: 'Ready for Installation',
            limit: 10
        }),
        enabled: !!user?.userId
    });

    // Get design templates
    const { data: designTemplates = [], isLoading: loadingTemplates } = useQuery({
        queryKey: ['design-templates'],
        queryFn: () => Promise.resolve([
            {
                id: 'TEMP001',
                name: 'Logo công ty cơ bản',
                category: 'Business',
                vehicleType: 'Ô tô',
                complexity: 'Simple',
                usageCount: 15,
                lastUsed: '2024-01-10T09:00:00Z'
            },
            {
                id: 'TEMP002',
                name: 'Decal xe máy thể thao',
                category: 'Personal',
                vehicleType: 'Xe máy',
                complexity: 'Medium',
                usageCount: 8,
                lastUsed: '2024-01-12T11:30:00Z'
            },
            {
                id: 'TEMP003',
                name: 'Bọc xe tải quảng cáo',
                category: 'Business',
                vehicleType: 'Xe tải',
                complexity: 'Complex',
                usageCount: 3,
                lastUsed: '2024-01-08T16:45:00Z'
            }
        ])
    });

    // Fallback mock data for development  
    const mockDesignerAnalytics = {
        totalDesigns: 28,
        completedDesigns: 22,
        pendingDesigns: 4,
        inProgressDesigns: 2,
        averageRating: 4.7,
        totalRequests: 35,
        approvedRequests: 28,
        pendingApprovals: 7
    };

    const mockPendingRequests = [
        {
            id: 'REQ001',
            customerName: 'Nguyễn Văn A',
            vehicleType: 'Ô tô',
            designType: 'Logo công ty',
            priority: 'High',
            deadline: '2024-01-20T17:00:00Z',
            customerNotes: 'Cần thiết kế logo công ty ABC trên xe, phong cách hiện đại',
            estimatedComplexity: 'Medium'
        },
        {
            id: 'REQ002',
            customerName: 'Trần Thị B',
            vehicleType: 'Xe máy',
            designType: 'Decal thể thao',
            priority: 'Medium',
            deadline: '2024-01-22T17:00:00Z',
            customerNotes: 'Thiết kế decal xe máy phong cách thể thao, màu sắc nổi bật',
            estimatedComplexity: 'Simple'
        }
    ];

    const mockInProgressDesigns = [
        {
            id: 'DES001',
            designName: 'Logo công ty ABC - Ô tô',
            customerName: 'Công ty ABC',
            vehicleType: 'Ô tô',
            complexity: 'Medium',
            status: 'In Progress',
            priority: 'High',
            deadline: '2024-01-18T17:00:00Z',
            estimatedTime: '3-4 ngày',
            progress: 65
        },
        {
            id: 'DES002',
            designName: 'Decal xe máy thể thao',
            customerName: 'Nguyễn Văn F',
            vehicleType: 'Xe máy',
            complexity: 'Simple',
            status: 'In Progress',
            priority: 'Medium',
            deadline: '2024-01-16T17:00:00Z',
            estimatedTime: '1-2 ngày',
            progress: 85
        }
    ];

    const actualAnalytics = designerAnalytics || mockDesignerAnalytics;
    const actualPendingRequests = pendingRequests.length > 0 ? pendingRequests : mockPendingRequests;
    const actualInProgressDesigns = inProgressDesigns.length > 0 ? inProgressDesigns : mockInProgressDesigns;
    const actualReadyForInstallation = readyForInstallation.length > 0 ? readyForInstallation : [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Ready for Installation': return 'bg-purple-100 text-purple-800';
            case 'Revision': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getComplexityColor = (complexity) => {
        switch (complexity) {
            case 'Simple': return 'bg-green-100 text-green-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Complex': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getVehicleIcon = (vehicleType) => {
        switch (vehicleType) {
            case 'Ô tô': return Car;
            case 'Xe máy': return Bike;
            case 'Xe tải': return Truck;
            default: return Car;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOverdue = (deadline) => {
        return new Date(deadline) < new Date();
    };

    const getDaysUntilDeadline = (deadline) => {
        const diffTime = new Date(deadline) - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loadingAnalytics) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Designer</h1>
                    <p className="text-gray-600">
                        Chào mừng {user?.name || 'Designer'} - Quản lý thiết kế và sáng tạo
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="quarter">Quý này</option>
                    </select>

                    <Button
                        onClick={() => navigate('/designs/editor')}
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Tạo thiết kế mới</span>
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Design Requests */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Yêu cầu thiết kế</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {actualAnalytics.totalRequests}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                {/* Approved Designs */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {actualAnalytics.approvedRequests}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckSquare className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                {/* Pending Approvals */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {actualAnalytics.pendingApprovals}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                </Card>

                {/* Customer Rating */}
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đánh giá KH</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {actualAnalytics.averageRating}/5.0
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedPeriod === 'week' ? 'Tuần này' :
                                    selectedPeriod === 'month' ? 'Tháng này' : 'Quý này'}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Star className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Design Requests */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Yêu cầu thiết kế mới</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/designs/requests')}
                            className="flex items-center space-x-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span>Xem tất cả</span>
                        </Button>
                    </div>

                    {loadingRequests ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-4">
                            {actualPendingRequests.map((request) => {
                                const VehicleIcon = getVehicleIcon(request.vehicleType);
                                const daysUntilDeadline = getDaysUntilDeadline(request.deadline);
                                const isOverdueDeadline = isOverdue(request.deadline);

                                return (
                                    <div key={request.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <VehicleIcon className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{request.customerName}</h4>
                                                    <p className="text-sm text-gray-600">{request.designType}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <Badge className={getPriorityColor(request.priority)}>
                                                    {request.priority}
                                                </Badge>
                                                <Badge className={`ml-2 ${getComplexityColor(request.estimatedComplexity)}`}>
                                                    {request.estimatedComplexity}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Loại xe:</span>
                                                <span className="text-gray-900">{request.vehicleType}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Ghi chú:</span>
                                                <span className="text-gray-900 italic">"{request.customerNotes}"</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Hạn hoàn thành:</span>
                                                <span className={`${isOverdueDeadline ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                                    {formatDate(request.deadline)}
                                                    {isOverdueDeadline && (
                                                        <span className="ml-2 text-red-500">(Quá hạn)</span>
                                                    )}
                                                    {!isOverdueDeadline && daysUntilDeadline > 0 && (
                                                        <span className="ml-2 text-blue-500">(Còn {daysUntilDeadline} ngày)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/designs/editor?request=${request.id}`)}
                                                className="flex items-center space-x-2"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                <span>Bắt đầu thiết kế</span>
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/designs/requests/${request.id}`)}
                                                className="flex items-center space-x-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Xem chi tiết</span>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Designs In Progress */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Thiết kế đang thực hiện</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/designs')}
                            className="flex items-center space-x-2"
                        >
                            <Eye className="h-4 w-4" />
                            <span>Xem tất cả</span>
                        </Button>
                    </div>

                    {loadingInProgress ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="space-y-4">
                            {actualInProgressDesigns.map((design) => {
                                const VehicleIcon = getVehicleIcon(design.vehicleType);
                                const daysUntilDeadline = getDaysUntilDeadline(design.deadline);
                                const isOverdueDeadline = isOverdue(design.deadline);

                                return (
                                    <div key={design.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <VehicleIcon className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{design.designName}</h4>
                                                    <p className="text-sm text-gray-600">{design.customerName}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <Badge className={getStatusColor(design.status)}>
                                                    {design.status}
                                                </Badge>
                                                <Badge className={`ml-2 ${getPriorityColor(design.priority)}`}>
                                                    {design.priority}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Tiến độ:</span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-600 h-2 rounded-full"
                                                        style={{ width: `${design.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-600">{design.progress}%</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500">Hạn hoàn thành:</span>
                                                <span className={`${isOverdueDeadline ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                                    {formatDate(design.deadline)}
                                                    {isOverdueDeadline && (
                                                        <span className="ml-2 text-red-500">(Quá hạn)</span>
                                                    )}
                                                    {!isOverdueDeadline && daysUntilDeadline > 0 && (
                                                        <span className="ml-2 text-blue-500">(Còn {daysUntilDeadline} ngày)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => navigate(`/designs/editor/${design.id}`)}
                                                className="flex items-center space-x-2"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                <span>Tiếp tục thiết kế</span>
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/designs/${design.id}`)}
                                                className="flex items-center space-x-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Xem chi tiết</span>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            {/* Ready for Installation */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Thiết kế sẵn sàng lắp đặt</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/designs/installation')}
                        className="flex items-center space-x-2"
                    >
                        <Send className="h-4 w-4" />
                        <span>Chuyển cho lắp đặt</span>
                    </Button>
                </div>

                {loadingReady ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {actualReadyForInstallation.map((design) => {
                            const VehicleIcon = getVehicleIcon(design.vehicleType);

                            return (
                                <div key={design.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                <VehicleIcon className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{design.designName}</h4>
                                                <p className="text-sm text-gray-600">{design.customerName}</p>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(design.status)}>
                                            {design.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center space-x-2">
                                            <FileImage className="h-4 w-4" />
                                            <span>Files: {design.fileCount || 3}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Hoàn thành: {formatDate(design.completedDate || new Date())}</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`/designs/${design.id}/transfer`)}
                                            className="flex items-center space-x-2"
                                        >
                                            <Send className="h-4 w-4" />
                                            <span>Chuyển lắp đặt</span>
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/designs/${design.id}`)}
                                            className="flex items-center space-x-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>Xem chi tiết</span>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* Design Templates */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Mẫu thiết kế thường dùng</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/templates')}
                        className="flex items-center space-x-2"
                    >
                        <Layers className="h-4 w-4" />
                        <span>Xem thư viện</span>
                    </Button>
                </div>

                {loadingTemplates ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {designTemplates.map((template) => (
                            <div key={template.id} className="p-4 bg-gray-50 rounded-lg border">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                                    <Badge className={getComplexityColor(template.complexity)}>
                                        {template.complexity}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Car className="h-4 w-4" />
                                        <span>{template.vehicleType}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4" />
                                        <span>Danh mục: {template.category}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-4 w-4" />
                                        <span>Đã sử dụng: {template.usageCount} lần</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Lần cuối: {formatDate(template.lastUsed)}</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/designs/editor?template=${template.id}`)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        <span>Sử dụng mẫu</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/designs/editor')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Plus className="h-8 w-8 text-blue-600" />
                        <span>Tạo thiết kế mới</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/designs/requests')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <FileText className="h-8 w-8 text-green-600" />
                        <span>Xem yêu cầu</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/designs/approval')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <CheckSquare className="h-8 w-8 text-purple-600" />
                        <span>Duyệt thiết kế</span>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/templates')}
                        className="flex flex-col items-center p-4 h-auto space-y-2"
                    >
                        <Archive className="h-8 w-8 text-orange-600" />
                        <span>Thư viện mẫu</span>
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default DesignerDashboardPage;
