import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Image, Search, Filter, Download, RefreshCw, Check, Trash2, Eye, Clock, AlertTriangle,
  CheckCircle, XCircle, Plus, Settings, Users, Calendar, ArrowUpDown, Star, Archive, Tag,
  Filter as FilterIcon, MoreHorizontal, ExternalLink, Palette, Car, Bike, Truck,
  Heart, Share2, Edit, Copy, Bookmark, Grid, List, ZoomIn, Download as DownloadIcon,
  Crown, Mountain
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { designService } from '../../services/designService';

const TemplateLibraryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Mock templates data (in real app, this would come from API)
  const mockTemplates = [
    {
      id: 1,
      name: 'Decal thể thao Honda Wave',
      description: 'Thiết kế decal thể thao phong cách hiện đại cho Honda Wave',
      category: 'sport',
      vehicleType: 'motorcycle',
      style: 'modern',
      imageUrl: '/api/templates/1/image',
      thumbnailUrl: '/api/templates/1/thumbnail',
      price: 500000,
      rating: 4.5,
      downloads: 1250,
      favorites: 89,
      tags: ['thể thao', 'hiện đại', 'Honda Wave'],
      createdAt: new Date('2024-01-15'),
      designer: 'Nguyễn Văn A',
      status: 'active'
    },
    {
      id: 2,
      name: 'Decal cổ điển Toyota Camry',
      description: 'Thiết kế decal cổ điển thanh lịch cho Toyota Camry',
      category: 'classic',
      vehicleType: 'car',
      style: 'elegant',
      imageUrl: '/api/templates/2/image',
      thumbnailUrl: '/api/templates/2/thumbnail',
      price: 800000,
      rating: 4.8,
      downloads: 890,
      favorites: 156,
      tags: ['cổ điển', 'thanh lịch', 'Toyota Camry'],
      createdAt: new Date('2024-01-10'),
      designer: 'Trần Thị B',
      status: 'active'
    },
    {
      id: 3,
      name: 'Decal công nghiệp Ford Ranger',
      description: 'Thiết kế decal công nghiệp mạnh mẽ cho Ford Ranger',
      category: 'industrial',
      vehicleType: 'truck',
      style: 'rugged',
      imageUrl: '/api/templates/3/image',
      thumbnailUrl: '/api/templates/3/thumbnail',
      price: 1200000,
      rating: 4.2,
      downloads: 567,
      favorites: 78,
      tags: ['công nghiệp', 'mạnh mẽ', 'Ford Ranger'],
      createdAt: new Date('2024-01-05'),
      designer: 'Lê Văn C',
      status: 'active'
    },
    {
      id: 4,
      name: 'Decal phong cách Yamaha Exciter',
      description: 'Thiết kế decal phong cách trẻ trung cho Yamaha Exciter',
      category: 'street',
      vehicleType: 'motorcycle',
      style: 'youth',
      imageUrl: '/api/templates/4/image',
      thumbnailUrl: '/api/templates/4/thumbnail',
      price: 450000,
      rating: 4.6,
      downloads: 2100,
      favorites: 234,
      tags: ['phong cách', 'trẻ trung', 'Yamaha Exciter'],
      createdAt: new Date('2024-01-20'),
      designer: 'Phạm Thị D',
      status: 'active'
    },
    {
      id: 5,
      name: 'Decal luxury Mercedes C-Class',
      description: 'Thiết kế decal sang trọng cho Mercedes C-Class',
      category: 'luxury',
      vehicleType: 'car',
      style: 'premium',
      imageUrl: '/api/templates/5/image',
      thumbnailUrl: '/api/templates/5/thumbnail',
      price: 1500000,
      rating: 4.9,
      downloads: 345,
      favorites: 189,
      tags: ['sang trọng', 'premium', 'Mercedes C-Class'],
      createdAt: new Date('2024-01-12'),
      designer: 'Hoàng Văn E',
      status: 'active'
    },
    {
      id: 6,
      name: 'Decal off-road Toyota Hilux',
      description: 'Thiết kế decal off-road mạnh mẽ cho Toyota Hilux',
      category: 'offroad',
      vehicleType: 'truck',
      style: 'adventure',
      imageUrl: '/api/templates/6/image',
      thumbnailUrl: '/api/templates/6/thumbnail',
      price: 1100000,
      rating: 4.4,
      downloads: 678,
      favorites: 123,
      tags: ['off-road', 'mạnh mẽ', 'Toyota Hilux'],
      createdAt: new Date('2024-01-08'),
      designer: 'Vũ Thị F',
      status: 'active'
    }
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'Tất cả', icon: Grid, color: 'bg-gray-500' },
    { id: 'sport', name: 'Thể thao', icon: Star, color: 'bg-red-500' },
    { id: 'classic', name: 'Cổ điển', icon: Bookmark, color: 'bg-blue-500' },
    { id: 'industrial', name: 'Công nghiệp', icon: Settings, color: 'bg-green-500' },
    { id: 'street', name: 'Phong cách', icon: Palette, color: 'bg-purple-500' },
    { id: 'luxury', name: 'Sang trọng', icon: Crown, color: 'bg-yellow-500' },
    { id: 'offroad', name: 'Off-road', icon: Mountain, color: 'bg-orange-500' }
  ];

  // Vehicle types
  const vehicleTypes = [
    { id: 'all', name: 'Tất cả xe', icon: Car },
    { id: 'car', name: 'Ô tô', icon: Car },
    { id: 'motorcycle', name: 'Xe máy', icon: Bike },
    { id: 'truck', name: 'Xe tải', icon: Truck }
  ];

  // Styles
  const styles = [
    { id: 'all', name: 'Tất cả phong cách' },
    { id: 'modern', name: 'Hiện đại' },
    { id: 'elegant', name: 'Thanh lịch' },
    { id: 'rugged', name: 'Mạnh mẽ' },
    { id: 'youth', name: 'Trẻ trung' },
    { id: 'premium', name: 'Cao cấp' },
    { id: 'adventure', name: 'Phiêu lưu' }
  ];

  // Mutations
  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId) => designService.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Đã xóa mẫu thiết kế');
    }
  });

  const duplicateTemplateMutation = useMutation({
    mutationFn: (templateId) => designService.duplicateTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Đã sao chép mẫu thiết kế');
    }
  });

  const favoriteTemplateMutation = useMutation({
    mutationFn: (templateId) => designService.toggleFavorite(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Đã cập nhật yêu thích');
    }
  });

  // Filter templates
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesVehicleType = selectedVehicleType === 'all' || template.vehicleType === selectedVehicleType;
    const matchesStyle = selectedStyle === 'all' || template.style === selectedStyle;

    return matchesSearch && matchesCategory && matchesVehicleType && matchesStyle;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle template preview
  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
    setShowPreviewModal(true);
  };

  // Handle bulk actions
  const handleSelectAll = () => {
    if (selectedTemplates.length === paginatedTemplates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(paginatedTemplates.map(t => t.id));
    }
  };

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplates(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category || categories[0];
  };

  // Get vehicle type info
  const getVehicleTypeInfo = (vehicleTypeId) => {
    const vehicleType = vehicleTypes.find(v => v.id === vehicleTypeId);
    return vehicleType || vehicleTypes[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thư viện mẫu</h1>
          <p className="text-gray-600">Quản lý và khám phá các mẫu thiết kế decal</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Xuất thư viện
          </Button>
          <Button onClick={() => navigate('/templates/create')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Thêm mẫu mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng mẫu</p>
              <p className="text-2xl font-bold text-gray-900">{mockTemplates.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tải xuống</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockTemplates.reduce((sum, t) => sum + t.downloads, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng yêu thích</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockTemplates.reduce((sum, t) => sum + t.favorites, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đánh giá TB</p>
              <p className="text-2xl font-bold text-gray-900">
                {(mockTemplates.reduce((sum, t) => sum + t.rating, 0) / mockTemplates.length).toFixed(1)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục mẫu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm mẫu thiết kế..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedVehicleType}
              onChange={(e) => setSelectedVehicleType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {vehicleTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {styles.map(style => (
                <option key={style.id} value={style.id}>{style.name}</option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded-lg">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedTemplates.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              Đã chọn {selectedTemplates.length} mẫu
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => selectedTemplates.forEach(id => duplicateTemplateMutation.mutate(id))}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Sao chép
              </Button>
              <Button
                onClick={() => selectedTemplates.forEach(id => deleteTemplateMutation.mutate(id))}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Templates Grid/List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Mẫu thiết kế ({filteredTemplates.length})
          </h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSelectAll}
              variant="outline"
              size="sm"
            >
              {selectedTemplates.length === paginatedTemplates.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedTemplates.map((template) => {
              const categoryInfo = getCategoryInfo(template.category);
              const vehicleTypeInfo = getVehicleTypeInfo(template.vehicleType);
              const CategoryIcon = categoryInfo.icon;
              const VehicleIcon = vehicleTypeInfo.icon;

              return (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => handleSelectTemplate(template.id)}
                        className="rounded"
                      />
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={`${categoryInfo.color} text-white`}>
                        <CategoryIcon className="w-3 h-3 mr-1" />
                        {categoryInfo.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 line-clamp-2">{template.name}</h4>
                      <Button
                        onClick={() => handlePreviewTemplate(template)}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-gray-100 text-gray-800">
                        <VehicleIcon className="w-3 h-3 mr-1" />
                        {vehicleTypeInfo.name}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {template.price?.toLocaleString('vi-VN')} VNĐ
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {template.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {template.downloads}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => favoriteTemplateMutation.mutate(template.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Heart className="w-3 h-3" />
                        </Button>
                        <span>{template.favorites}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        onClick={() => duplicateTemplateMutation.mutate(template.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Sao chép
                      </Button>
                      <Button
                        onClick={() => navigate(`/templates/${template.id}/edit`)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedTemplates.map((template) => {
              const categoryInfo = getCategoryInfo(template.category);
              const vehicleTypeInfo = getVehicleTypeInfo(template.vehicleType);
              const CategoryIcon = categoryInfo.icon;
              const VehicleIcon = vehicleTypeInfo.icon;

              return (
                <Card key={template.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => handleSelectTemplate(template.id)}
                      className="rounded"
                    />
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${categoryInfo.color} text-white`}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {categoryInfo.name}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800">
                            <VehicleIcon className="w-3 h-3 mr-1" />
                            {vehicleTypeInfo.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {template.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {template.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {template.favorites}
                        </span>
                        <span className="font-medium text-blue-600">
                          {template.price?.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handlePreviewTemplate(template)}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => duplicateTemplateMutation.mutate(template.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => navigate(`/templates/${template.id}/edit`)}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} trong tổng số {filteredTemplates.length} mẫu
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Trước
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Xem trước mẫu thiết kế</h3>
              <Button
                onClick={() => setShowPreviewModal(false)}
                variant="ghost"
                size="sm"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <Image className="w-16 h-16 text-gray-400" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Tải xuống
                  </Button>
                  <Button variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{previewTemplate.name}</h4>
                <p className="text-gray-600 mb-4">{previewTemplate.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thiết kế bởi:</span>
                    <span className="font-medium">{previewTemplate.designer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá:</span>
                    <span className="font-medium text-blue-600">{previewTemplate.price?.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đánh giá:</span>
                    <span className="font-medium">{previewTemplate.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tải xuống:</span>
                    <span className="font-medium">{previewTemplate.downloads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yêu thích:</span>
                    <span className="font-medium">{previewTemplate.favorites}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Tags:</h5>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.tags.map((tag, index) => (
                      <Badge key={index} className="bg-gray-100 text-gray-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateLibraryPage;
