import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Package,
    Filter,
    MoreVertical,
    AlertTriangle,
    DollarSign,
    Copy,
    Download
} from 'lucide-react';
import { decalService } from '../../services/decalService';
import { decalTemplateService } from '../../services/decalTemplateService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import SearchableSelect from '../../components/ui/SearchableSelect';

const DecalServiceListPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTemplate, setFilterTemplate] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Get decal services data
    const { data: decalServices = [], isLoading, error } = useQuery({
        queryKey: ['decalServices', searchTerm, filterTemplate],
        queryFn: () => decalService.getDecalServices(),
    });

    // Get decal templates for filter
    const { data: decalTemplates = [] } = useQuery({
        queryKey: ['decalTemplates'],
        queryFn: () => decalTemplateService.getDecalTemplates(),
    });

    // Delete decal service mutation
    const deleteMutation = useMutation({
        mutationFn: decalService.deleteDecalService,
        onSuccess: () => {
            toast.success('Đã xóa dịch vụ decal thành công!');
            queryClient.invalidateQueries(['decalServices']);
            setShowDeleteModal(false);
            setSelectedService(null);
        },
        onError: (error) => {
            console.error('Delete decal service error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa dịch vụ decal';
            toast.error('Lỗi khi xóa dịch vụ decal: ' + errorMessage);
        },
    });

    // Duplicate decal service mutation
    const duplicateMutation = useMutation({
        mutationFn: decalService.duplicateDecalService,
        onSuccess: () => {
            toast.success('Đã sao chép dịch vụ decal thành công!');
            queryClient.invalidateQueries(['decalServices']);
        },
        onError: (error) => {
            console.error('Duplicate decal service error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi sao chép dịch vụ decal';
            toast.error('Lỗi khi sao chép dịch vụ decal: ' + errorMessage);
        },
    });

    // Filter decal services based on search term and template
    const filteredServices = decalServices.filter(service => {
        const matchesSearch =
            service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.decalTemplateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.decalTypeName?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTemplate = filterTemplate === 'all' || service.decalTemplateID === filterTemplate;

        return matchesSearch && matchesTemplate;
    });

    const handleDelete = (service) => {
        setSelectedService(service);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedService) {
            deleteMutation.mutate(selectedService.serviceID);
        }
    };

    const handleDuplicate = (service) => {
        duplicateMutation.mutate(service.serviceID);
    };

    const handleExport = async () => {
        try {
            const blob = await decalService.exportDecalServices({
                format: 'csv',
                search: searchTerm,
                category: filterTemplate !== 'all' ? decalTemplates.find(t => t.templateID === filterTemplate)?.decalTypeName : undefined
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `decal_services_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Đã xuất dữ liệu thành công!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Lỗi khi xuất dữ liệu');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <Button onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Dịch vụ Decal</h1>
                    <p className="text-gray-600">Quản lý các dịch vụ decal và giá cả</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Xuất Excel
                    </Button>
                    <Button
                        onClick={() => navigate('/decal-services/add')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm dịch vụ
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm theo tên dịch vụ, mẫu decal, loại decal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <SearchableSelect
                            options={[
                                { value: 'all', label: 'Tất cả mẫu decal' },
                                ...decalTemplates.map(template => ({
                                    value: template.templateID,
                                    label: template.templateName
                                }))
                            ]}
                            value={filterTemplate}
                            onChange={setFilterTemplate}
                            placeholder="Chọn mẫu decal"
                        />
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tổng dịch vụ</p>
                            <p className="text-xl font-semibold">{decalServices.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Giá trung bình</p>
                            <p className="text-xl font-semibold">
                                {decalServices.length > 0
                                    ? formatPrice(decalServices.reduce((sum, s) => sum + s.price, 0) / decalServices.length)
                                    : '0₫'
                                }
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Mẫu decal</p>
                            <p className="text-xl font-semibold">
                                {new Set(decalServices.map(s => s.decalTemplateID)).size}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Kết quả tìm kiếm</p>
                            <p className="text-xl font-semibold">{filteredServices.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Decal Services Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dịch vụ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mẫu Decal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đơn vị công việc
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-lg font-medium">Không tìm thấy dịch vụ decal nào</p>
                                        <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc thêm dịch vụ mới</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((service) => (
                                    <tr key={service.serviceID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {service.serviceName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {service.serviceID}
                                                </div>
                                                {service.description && (
                                                    <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                                                        {service.description}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {service.decalTemplateName}
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {service.decalTypeName}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatPrice(service.price)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {service.standardWorkUnits} đơn vị
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/decal-services/${service.serviceID}`)}
                                                    className="p-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/decal-services/${service.serviceID}/edit`)}
                                                    className="p-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDuplicate(service)}
                                                    className="p-2 text-blue-600 hover:text-blue-700"
                                                    disabled={duplicateMutation.isPending}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(service)}
                                                    className="p-2 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Bạn có chắc chắn muốn xóa dịch vụ decal <strong>{selectedService?.serviceName}</strong>?
                    </p>
                    <p className="text-sm text-red-600">
                        Hành động này không thể hoàn tác và có thể ảnh hưởng đến các đơn hàng liên quan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DecalServiceListPage;
