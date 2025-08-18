import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Clock,
    User,
    Car,
    MapPin,
    Phone,
    Mail,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Play,
    Pause,
    Eye,
    Edit,
    Trash2,
    Filter,
    Search,
    Download,
    RefreshCw,
    Star,
    Timer,
    Users,
    Building,
    ArrowUpDown,
    Camera,
    FileText,
    MessageSquare,
    PhoneCall,
    Map,
    Navigation,
    Settings,
    BarChart3,
    TrendingUp,
    Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { installationService } from '../../services/installationService';
import { employeeService } from '../../services/employeeService';
import { storeService } from '../../services/storeService';

const InstallationTrackingPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTechnician, setFilterTechnician] = useState('all');
    const [filterStore, setFilterStore] = useState('all');
    const [selectedInstallations, setSelectedInstallations] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'timeline'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch installations for tracking
    const { data: installations = [], isLoading, error, refetch } = useQuery({
        queryKey: ['installation-tracking', searchTerm, filterStatus, filterTechnician, filterStore, selectedDate],
        queryFn: () => installationService.getInstallations({
            search: searchTerm,
            status: filterStatus !== 'all' ? filterStatus : undefined,
            technicianId: filterTechnician !== 'all' ? filterTechnician : undefined,
            storeId: filterStore !== 'all' ? filterStore : undefined,
            startDate: selectedDate,
            endDate: selectedDate
        }),
    });

    // Fetch technicians for filter
    const { data: technicians = [] } = useQuery({
        queryKey: ['technicians'],
        queryFn: () => employeeService.getEmployees({ role: 'Technician' }),
    });

    // Fetch stores for filter
    const { data: stores = [] } = useQuery({
        queryKey: ['stores'],
        queryFn: storeService.getStores,
    });

    // Fetch installation statistics
    const { data: stats = {} } = useQuery({
        queryKey: ['installation-stats', selectedDate],
        queryFn: () => installationService.getInstallationStats({
            startDate: selectedDate,
            endDate: selectedDate
        }),
    });

    // Update installation status mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, notes }) =>
            installationService.updateInstallationStatus(id, status, notes),
        onSuccess: () => {
            queryClient.invalidateQueries(['installation-tracking']);
            queryClient.invalidateQueries(['installation-stats']);
            toast.success('Cập nhật trạng thái thành công!');
        },
        onError: (error) => {
            toast.error('Lỗi khi cập nhật trạng thái: ' + error.message);
        },
    });

    // Submit quality report mutation
    const submitQualityReportMutation = useMutation({
        mutationFn: ({ id, qualityData }) =>
            installationService.submitQualityReport(id, qualityData),
        onSuccess: () => {
            queryClient.invalidateQueries(['installation-tracking']);
            toast.success('Báo cáo chất lượng đã được gửi!');
        },
        onError: (error) => {
            toast.error('Lỗi khi gửi báo cáo: ' + error.message);
        },
    });

    // Handle status update
    const handleStatusUpdate = (id, status, notes = '') => {
        updateStatusMutation.mutate({ id, status, notes });
    };

    // Handle quality report submission
    const handleQualityReport = (id, qualityData) => {
        submitQualityReportMutation.mutate({ id, qualityData });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
            'in_progress': { color: 'bg-blue-100 text-blue-800', icon: Play },
            'paused': { color: 'bg-orange-100 text-orange-800', icon: Pause },
            'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
        };

        const config = statusConfig[status] || statusConfig['pending'];
        const Icon = config.icon;

        return (
            <Badge className={config.color}>
                <Icon className="w-3 h-3 mr-1" />
                {status === 'pending' && 'Chờ xử lý'}
                {status === 'in_progress' && 'Đang thực hiện'}
                {status === 'paused' && 'Tạm dừng'}
                {status === 'completed' && 'Hoàn thành'}
                {status === 'cancelled' && 'Đã hủy'}
            </Badge>
        );
    };

    // Calculate progress percentage
    const getProgressPercentage = (installation) => {
        const startTime = new Date(installation.scheduledStartTime);
        const endTime = new Date(installation.scheduledEndTime);
        const now = new Date();

        if (now < startTime) return 0;
        if (now > endTime) return 100;

        const totalDuration = endTime - startTime;
        const elapsed = now - startTime;
        return Math.round((elapsed / totalDuration) * 100);
    };

    // Get time status
    const getTimeStatus = (installation) => {
        const startTime = new Date(installation.scheduledStartTime);
        const endTime = new Date(installation.scheduledEndTime);
        const now = new Date();

        if (now < startTime) {
            const diff = startTime - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return { status: 'upcoming', text: `Bắt đầu sau ${hours}h ${minutes}p` };
        } else if (now > endTime) {
            const diff = now - endTime;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return { status: 'overdue', text: `Trễ ${hours}h ${minutes}p` };
        } else {
            return { status: 'on_time', text: 'Đúng tiến độ' };
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                    <AlertTriangle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Lỗi khi tải dữ liệu</h3>
                <p className="text-red-600 mb-4">Không thể kết nối đến máy chủ</p>
                <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Thử lại
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Theo dõi lắp đặt</h1>
                    <p className="text-gray-600">Theo dõi tiến độ và trạng thái các lắp đặt</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => refetch()}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Làm mới
                    </Button>
                    <Button
                        onClick={() => navigate('/installations/queue')}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Clock className="w-4 h-4" />
                        Hàng đợi
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng lắp đặt hôm nay</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalInstallations || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.completedInstallations || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Đang thực hiện</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.inProgressInstallations || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Trễ hạn</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.overdueInstallations || 0}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters and Controls */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm lắp đặt..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setViewMode('list')}
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                            >
                                Danh sách
                            </Button>
                            <Button
                                onClick={() => setViewMode('timeline')}
                                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                                size="sm"
                            >
                                Timeline
                            </Button>
                        </div>

                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Bộ lọc
                        </Button>

                        <Button
                            onClick={() => installationService.exportInstallations('excel', {
                                search: searchTerm,
                                status: filterStatus,
                                technicianId: filterTechnician,
                                storeId: filterStore,
                                startDate: selectedDate,
                                endDate: selectedDate
                            })}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Xuất Excel
                        </Button>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="pending">Chờ xử lý</option>
                                    <option value="in_progress">Đang thực hiện</option>
                                    <option value="paused">Tạm dừng</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kỹ thuật viên
                                </label>
                                <select
                                    value={filterTechnician}
                                    onChange={(e) => setFilterTechnician(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả kỹ thuật viên</option>
                                    {technicians.map(tech => (
                                        <option key={tech.employeeID} value={tech.employeeID}>
                                            {tech.firstName} {tech.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cửa hàng
                                </label>
                                <select
                                    value={filterStore}
                                    onChange={(e) => setFilterStore(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả cửa hàng</option>
                                    {stores.map(store => (
                                        <option key={store.storeID} value={store.storeID}>
                                            {store.storeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Installations List/Timeline */}
            {viewMode === 'list' ? (
                <Card>
                    {installations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Activity className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lắp đặt nào</h3>
                            <p className="text-gray-600">Không có lắp đặt nào trong ngày được chọn</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {installations.map((installation) => {
                                const progress = getProgressPercentage(installation);
                                const timeStatus = getTimeStatus(installation);

                                return (
                                    <div key={installation.installationID} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <Car className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        {installation.order?.orderID || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {installation.vehicle?.brand} {installation.vehicle?.model}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {installation.service?.serviceName}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(installation.status)}
                                                <div className={`text-sm ${timeStatus.status === 'overdue' ? 'text-red-600' :
                                                    timeStatus.status === 'on_time' ? 'text-green-600' : 'text-gray-600'
                                                    }`}>
                                                    {timeStatus.text}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-1">Khách hàng</div>
                                                <div className="text-sm text-gray-900">
                                                    {installation.customer?.firstName} {installation.customer?.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {installation.customer?.phoneNumber}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-1">Kỹ thuật viên</div>
                                                {installation.technician ? (
                                                    <>
                                                        <div className="text-sm text-gray-900">
                                                            {installation.technician.firstName} {installation.technician.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <Phone className="w-3 h-3 mr-1" />
                                                            {installation.technician.phoneNumber}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-sm text-gray-500">Chưa phân công</div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-1">Thời gian</div>
                                                <div className="text-sm text-gray-900">
                                                    {new Date(installation.scheduledStartTime).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} - {new Date(installation.scheduledEndTime).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(installation.scheduledStartTime).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Tiến độ</span>
                                                <span className="text-sm text-gray-500">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => navigate(`/installations/${installation.installationID}`)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    Chi tiết
                                                </Button>
                                                <Button
                                                    onClick={() => navigate(`/installations/${installation.installationID}/edit`)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Chỉnh sửa
                                                </Button>
                                                <Button
                                                    onClick={() => navigate(`/installations/${installation.installationID}/quality`)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Camera className="w-4 h-4 mr-1" />
                                                    Chất lượng
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => window.open(`tel:${installation.customer?.phoneNumber}`)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <PhoneCall className="w-4 h-4 mr-1" />
                                                    Gọi
                                                </Button>
                                                <Button
                                                    onClick={() => window.open(`https://maps.google.com/?q=${installation.customer?.address}`)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Map className="w-4 h-4 mr-1" />
                                                    Bản đồ
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <BarChart3 className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline View</h3>
                        <p className="text-gray-600">Chế độ xem timeline sẽ được phát triển trong phiên bản tiếp theo</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default InstallationTrackingPage;
