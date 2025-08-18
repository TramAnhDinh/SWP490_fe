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
    Activity,
    Award,
    Shield,
    Zap,
    Target,
    CheckSquare,
    XSquare,
    MinusSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { installationService } from '../../services/installationService';
import { employeeService } from '../../services/employeeService';
import { storeService } from '../../services/storeService';

const QualityControlPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterQualityScore, setFilterQualityScore] = useState('all');
    const [filterTechnician, setFilterTechnician] = useState('all');
    const [filterStore, setFilterStore] = useState('all');
    const [selectedInstallations, setSelectedInstallations] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedInstallation, setSelectedInstallation] = useState(null);
    const [showQualityModal, setShowQualityModal] = useState(false);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch quality control reports
    const { data: qualityReports = [], isLoading, error, refetch } = useQuery({
        queryKey: ['quality-control-reports', searchTerm, filterQualityScore, filterTechnician, filterStore, selectedDate],
        queryFn: () => installationService.getQualityControlReports({
            search: searchTerm,
            qualityScore: filterQualityScore !== 'all' ? filterQualityScore : undefined,
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

    // Submit quality report mutation
    const submitQualityReportMutation = useMutation({
        mutationFn: ({ id, qualityData }) =>
            installationService.submitQualityReport(id, qualityData),
        onSuccess: () => {
            queryClient.invalidateQueries(['quality-control-reports']);
            toast.success('Báo cáo chất lượng đã được gửi!');
            setShowQualityModal(false);
            setSelectedInstallation(null);
        },
        onError: (error) => {
            toast.error('Lỗi khi gửi báo cáo: ' + error.message);
        },
    });

    // Handle quality report submission
    const handleQualityReport = (qualityData) => {
        if (!selectedInstallation) return;
        submitQualityReportMutation.mutate({ id: selectedInstallation.installationID, qualityData });
    };

    // Get quality score badge
    const getQualityScoreBadge = (score) => {
        if (score >= 90) {
            return <Badge className="bg-green-100 text-green-800">Xuất sắc (90-100)</Badge>;
        } else if (score >= 80) {
            return <Badge className="bg-blue-100 text-blue-800">Tốt (80-89)</Badge>;
        } else if (score >= 70) {
            return <Badge className="bg-yellow-100 text-yellow-800">Khá (70-79)</Badge>;
        } else if (score >= 60) {
            return <Badge className="bg-orange-100 text-orange-800">Trung bình (60-69)</Badge>;
        } else {
            return <Badge className="bg-red-100 text-red-800">Kém ({'<'} 60)</Badge>;
        }
    };

    // Get quality score color
    const getQualityScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        if (score >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    // Calculate average quality score
    const getAverageQualityScore = () => {
        if (qualityReports.length === 0) return 0;
        const total = qualityReports.reduce((sum, report) => sum + report.qualityScore, 0);
        return Math.round(total / qualityReports.length);
    };

    // Get quality statistics
    const getQualityStats = () => {
        const stats = {
            excellent: qualityReports.filter(r => r.qualityScore >= 90).length,
            good: qualityReports.filter(r => r.qualityScore >= 80 && r.qualityScore < 90).length,
            fair: qualityReports.filter(r => r.qualityScore >= 70 && r.qualityScore < 80).length,
            poor: qualityReports.filter(r => r.qualityScore < 70).length,
        };
        return stats;
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

    const qualityStats = getQualityStats();
    const averageScore = getAverageQualityScore();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kiểm soát chất lượng</h1>
                    <p className="text-gray-600">Đánh giá và báo cáo chất lượng lắp đặt</p>
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
                        onClick={() => navigate('/installations/tracking')}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Activity className="w-4 h-4" />
                        Theo dõi
                    </Button>
                </div>
            </div>

            {/* Quality Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Điểm TB</p>
                            <p className={`text-2xl font-bold ${getQualityScoreColor(averageScore)}`}>
                                {averageScore}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Award className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Xuất sắc</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {qualityStats.excellent}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CheckSquare className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tốt</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {qualityStats.good}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <MinusSquare className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Khá</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {qualityStats.fair}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XSquare className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Kém</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {qualityStats.poor}
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
                                placeholder="Tìm kiếm báo cáo..."
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
                                qualityScore: filterQualityScore,
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
                                    Điểm chất lượng
                                </label>
                                <select
                                    value={filterQualityScore}
                                    onChange={(e) => setFilterQualityScore(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả điểm</option>
                                    <option value="90-100">Xuất sắc (90-100)</option>
                                    <option value="80-89">Tốt (80-89)</option>
                                    <option value="70-79">Khá (70-79)</option>
                                    <option value="60-69">Trung bình (60-69)</option>
                                    <option value="0-59">Kém (&lt; 60)</option>
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

            {/* Quality Reports List */}
            <Card>
                {qualityReports.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Shield className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có báo cáo chất lượng</h3>
                        <p className="text-gray-600">Không có báo cáo chất lượng nào trong ngày được chọn</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thông tin lắp đặt
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kỹ thuật viên
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Điểm chất lượng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đánh giá chi tiết
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {qualityReports.map((report) => (
                                    <tr key={report.qualityReportID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <Car className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {report.installation?.order?.orderID || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {report.installation?.vehicle?.brand} {report.installation?.vehicle?.model}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {report.installation?.service?.serviceName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {report.technician?.firstName} {report.technician?.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {report.technician?.phoneNumber}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`text-2xl font-bold ${getQualityScoreColor(report.qualityScore)}`}>
                                                    {report.qualityScore}
                                                </div>
                                                <div className="ml-2">
                                                    {getQualityScoreBadge(report.qualityScore)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs">
                                                <div className="font-medium mb-1">Đánh giá:</div>
                                                <div className="text-gray-600">{report.evaluation || 'Không có đánh giá'}</div>
                                                {report.issues && (
                                                    <div className="mt-2">
                                                        <div className="font-medium text-red-600">Vấn đề:</div>
                                                        <div className="text-red-600 text-sm">{report.issues}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(report.createdAt).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => {
                                                        setSelectedInstallation(report.installation);
                                                        setShowQualityModal(true);
                                                    }}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => navigate(`/installations/${report.installation?.installationID}`)}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Quality Assessment Modal */}
            {showQualityModal && selectedInstallation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Đánh giá chất lượng</h3>
                                <Button
                                    onClick={() => {
                                        setShowQualityModal(false);
                                        setSelectedInstallation(null);
                                    }}
                                    variant="outline"
                                    size="sm"
                                >
                                    <XCircle className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Điểm chất lượng (0-100)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Nhập điểm từ 0-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đánh giá chi tiết
                                    </label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Mô tả chi tiết về chất lượng lắp đặt..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vấn đề (nếu có)
                                    </label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Mô tả các vấn đề cần khắc phục..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Khuyến nghị
                                    </label>
                                    <textarea
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Đưa ra khuyến nghị cải thiện..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        onClick={() => {
                                            setShowQualityModal(false);
                                            setSelectedInstallation(null);
                                        }}
                                        variant="outline"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={() => handleQualityReport({
                                            qualityScore: 85,
                                            evaluation: "Lắp đặt tốt, đúng quy trình",
                                            issues: "",
                                            recommendations: "Tiếp tục duy trì chất lượng"
                                        })}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Gửi báo cáo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QualityControlPage;
