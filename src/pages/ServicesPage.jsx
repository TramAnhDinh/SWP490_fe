import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Car,
    Palette,
    Shield,
    Clock,
    Star,
    MapPin,
    Phone,
    Mail,
    ArrowLeft,
    CheckCircle,
    Award,
    Users,
    Zap,
    Filter,
    Search,
    ChevronDown,
    ChevronUp,
    Loader2,
    LogIn
} from 'lucide-react';
import { serviceService } from '../services/serviceService';

const ServicesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Fetch services from API
    const { data: services = [], isLoading: servicesLoading, error: servicesError } = useQuery({
        queryKey: ['services', searchTerm, selectedCategory],
        queryFn: () => serviceService.getServices({
            search: searchTerm,
            category: selectedCategory !== 'all' ? selectedCategory : undefined
        }),
    });

    // Fetch decal types for categories
    const { data: decalTypes = [], isLoading: decalTypesLoading } = useQuery({
        queryKey: ['decal-types'],
        queryFn: serviceService.getDecalTypes,
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

    // Transform API data to match our UI structure
    const transformedServices = services.map(service => ({
        id: service.serviceID,
        title: service.serviceName,
        category: service.decalType?.decalTypeName || 'Khác',
        description: service.description || 'Dịch vụ dán decal chuyên nghiệp',
        icon: getServiceIcon(service.decalType?.decalTypeName),
        features: [
            'Chất lượng cao',
            'Thời gian nhanh chóng',
            'Bảo hành uy tín',
            'Giá cả hợp lý'
        ],
        price: service.price ? `Từ ${service.price.toLocaleString('vi-VN')}đ` : 'Liên hệ',
        priceRange: service.price ? `${service.price.toLocaleString('vi-VN')}đ` : 'Theo báo giá',
        duration: '1-3 ngày',
        warranty: '12 tháng',
        color: getServiceColor(service.decalType?.decalTypeName),
        popular: service.price && service.price > 500000 // Services over 500k are considered popular
    }));

    // Generate categories from decal types
    const categories = [
        { id: 'all', name: 'Tất cả dịch vụ' },
        ...decalTypes.map(type => ({
            id: type.decalTypeName,
            name: type.decalTypeName
        }))
    ];

    const filteredServices = transformedServices.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const popularServices = transformedServices.filter(service => service.popular);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Quay lại trang chủ
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">DecalXe</h1>
                        </div>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            Đăng nhập hệ thống
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Dịch vụ của chúng tôi
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Chuyên nghiệp - Chất lượng - Uy tín
                        </p>
                        <p className="text-lg text-blue-200 max-w-3xl mx-auto">
                            Khám phá các dịch vụ dán decal xe hàng đầu với công nghệ hiện đại và đội ngũ chuyên nghiệp
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search and Filter */}
                <div className="mb-8">
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

                            <Link
                                to="/contact"
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                Liên hệ tư vấn
                            </Link>
                        </div>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
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
                </div>

                {/* Popular Services */}
                {selectedCategory === 'all' && popularServices.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500" />
                            Dịch vụ nổi bật
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularServices.map((service) => (
                                <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-200 relative">
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            Nổi bật
                                        </span>
                                    </div>
                                    <div className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                                        <service.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600 mb-4">{service.description}</p>
                                    <ul className="space-y-2 mb-6">
                                        {service.features.slice(0, 4).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-600">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-blue-600">{service.price}</span>
                                        <Link
                                            to="/contact"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            Tư vấn ngay
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Services */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {selectedCategory === 'all' ? 'Tất cả dịch vụ' : categories.find(c => c.id === selectedCategory)?.name}
                    </h2>

                    {servicesLoading ? (
                        <div className="text-center py-12">
                            <div className="flex items-center justify-center mb-4">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải dịch vụ...</h3>
                            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                        </div>
                    ) : servicesError ? (
                        <div className="text-center py-12">
                            <div className="text-red-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-900 mb-2">Lỗi khi tải dịch vụ</h3>
                            <p className="text-red-600">Không thể kết nối đến máy chủ. Vui lòng thử lại sau.</p>
                        </div>
                    ) : filteredServices.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy dịch vụ</h3>
                            <p className="text-gray-600">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((service) => (
                                <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                                        <service.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                                    <p className="text-gray-600 mb-4">{service.description}</p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Giá:</span>
                                            <span className="font-semibold text-blue-600">{service.price}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Thời gian:</span>
                                            <span className="font-medium">{service.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Bảo hành:</span>
                                            <span className="font-medium">{service.warranty}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {service.features.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-600">
                                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                        {service.features.length > 3 && (
                                            <li className="text-sm text-blue-600 font-medium">
                                                +{service.features.length - 3} tính năng khác
                                            </li>
                                        )}
                                    </ul>

                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-600">{service.price}</span>
                                        <Link
                                            to="/contact"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            Tư vấn ngay
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Bạn cần tư vấn thêm?</h3>
                    <p className="text-blue-100 mb-6">
                        Hãy liên hệ với chúng tôi để được tư vấn chi tiết và báo giá cụ thể cho dự án của bạn
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Liên hệ tư vấn
                        </Link>
                        <a
                            href="tel:0909123456"
                            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Gọi ngay: 0909 123 456
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
