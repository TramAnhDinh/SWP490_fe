import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    Loader2,
    Car,
    Palette,
    Shield,
    Award,
    Zap,
    Star,
    Users
} from 'lucide-react';
import { Button, Card, Badge, LoadingSpinner } from '../../components/common';
import { serviceService } from '../../services/serviceService';

const ServiceManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const queryClient = useQueryClient();

    // Fetch services
    const { data: services = [], isLoading: servicesLoading, error: servicesError } = useQuery({
        queryKey: ['services-management'],
        queryFn: () => serviceService.getServices(),
    });

    // Fetch decal types for categories
    const { data: decalTypes = [], isLoading: decalTypesLoading } = useQuery({
        queryKey: ['decal-types-management'],
        queryFn: serviceService.getDecalTypes,
    });

    // Delete service mutation
    const deleteServiceMutation = useMutation({
        mutationFn: (serviceId) => serviceService.deleteService(serviceId),
        onSuccess: () => {
            queryClient.invalidateQueries(['services-management']);
            toast.success('Xóa dịch vụ thành công!');
            setShowDeleteModal(false);
            setSelectedService(null);
        },
        onError: (error) => {
            console.error('Error deleting service:', error);
            toast.error('Có lỗi xảy ra khi xóa dịch vụ');
        },
    });

    // Icon mapping for different service types
    const getServiceIcon = (decalTypeName) => {
        const iconMap = {
            'Decal thể thao': Car,
            'Decal quảng cáo': Palette,
            'Decal bảo vệ': Shield,
            'Decal trang trí': Award,
            'Decal phản quang': Zap,
            'Decal cao cấp': Star,
            'Decal thường': Users,
            'Decal đặc biệt': Award
        };
        return iconMap[decalTypeName] || Car;
    };

    // Color mapping for different service types
    const getServiceColor = (decalTypeName) => {
        const colorMap = {
            'Decal thể thao': 'bg-blue-500',
            'Decal quảng cáo': 'bg-purple-500',
            'Decal bảo vệ': 'bg-green-500',
            'Decal trang trí': 'bg-orange-500',
            'Decal phản quang': 'bg-indigo-500',
            'Decal cao cấp': 'bg-red-500',
            'Decal thường': 'bg-gray-500',
            'Decal đặc biệt': 'bg-yellow-500'
        };
        return colorMap[decalTypeName] || 'bg-blue-500';
    };

    // Transform API data
    const transformedServices = services.map(service => ({
        id: service.serviceID,
        title: service.serviceName,
        category: service.decalType?.decalTypeName || 'Khác',
        description: service.description || 'Dịch vụ dán decal chuyên nghiệp',
        price: service.price,
        isActive: service.isActive,
        icon: getServiceIcon(service.decalType?.decalTypeName),
        color: getServiceColor(service.decalType?.decalTypeName),
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
    }));

    // Generate categories from decal types
    const categories = [
        { id: 'all', name: 'Tất cả dịch vụ' },
        ...decalTypes.map(type => ({
            id: type.decalTypeName,
            name: type.decalTypeName
        }))
    ];

    // Filter services
    const filteredServices = transformedServices.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (service) => {
        setSelectedService(service);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedService) {
            deleteServiceMutation.mutate(selectedService.id);
        }
    };

    const getStatusBadge = (isActive) => {
        return (
            <Badge variant={isActive ? "success" : "secondary"} size="sm">
                {isActive ? 'Hoạt động' : 'Không hoạt động'}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý dịch vụ</h1>
                    <p className="text-gray-600">Quản lý danh sách dịch vụ và cấu hình</p>
                </div>
                <Link to="/services/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm dịch vụ mới
                    </Button>
                </Link>
            </div>

            {/* Search and Filter */}
            <Card className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Bộ lọc
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Filter Options */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Danh mục dịch vụ</h3>
                        {decalTypesLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-600">Đang tải danh mục...</span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tổng dịch vụ</p>
                            <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Car className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-600">
                                {services.filter(s => s.isActive).length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Shield className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Danh mục</p>
                            <p className="text-2xl font-bold text-gray-900">{decalTypes.length}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Palette className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Đã lọc</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredServices.length}</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Filter className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Services List */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Danh sách dịch vụ ({filteredServices.length})
                    </h2>
                </div>

                {servicesLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : servicesError ? (
                    <div className="text-center py-12">
                        <p className="text-red-500 mb-4">Lỗi khi tải danh sách dịch vụ</p>
                        <Button onClick={() => window.location.reload()}>
                            Thử lại
                        </Button>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                        <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Không tìm thấy dịch vụ nào</p>
                        <p className="text-sm text-gray-400">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dịch vụ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
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
                                {filteredServices.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 ${service.color} rounded-lg flex items-center justify-center mr-3`}>
                                                    <service.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                                                    <div className="text-sm text-gray-500">{service.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{service.category}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                                {service.price ? `${service.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(service.isActive)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    to={`/services/${service.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    to={`/services/${service.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(service)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Xác nhận xóa</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn xóa dịch vụ "{selectedService?.title}" không?
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Hành động này không thể hoàn tác.
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={deleteServiceMutation.isPending}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmDelete}
                                    disabled={deleteServiceMutation.isPending}
                                >
                                    {deleteServiceMutation.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Trash2 className="h-4 w-4 mr-2" />
                                    )}
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManagementPage;
