import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Image, Search, Filter, Download, RefreshCw, Check, Trash2, Eye, Clock, AlertTriangle,
  CheckCircle, XCircle, Plus, Settings, Users, Calendar, ArrowUpDown, Star, Archive, Tag,
  Filter as FilterIcon, MoreHorizontal, ExternalLink, Palette, Car, Bike, Truck,
  Heart, Share2, Edit, Copy, Bookmark, Grid, List, ZoomIn, Download as DownloadIcon,
  Crown, Mountain, Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { decalTemplateService } from '../../services/decalTemplateService';

const TemplateLibraryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Get templates data from API
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['decalTemplates', searchTerm],
    queryFn: () => decalTemplateService.getDecalTemplates(),
  });

  // Map API data to expected format - chỉ sử dụng field thật có
  const mappedTemplates = templates.map(template => ({
    id: template.templateID,
    name: template.templateName,
    imageUrl: template.imageURL,
    decalTypeID: template.decalTypeID,
    decalTypeName: template.decalTypeName
  }));

  // No need for categories, vehicle types, or styles since API doesn't provide this data

  // Mutations
  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId) => decalTemplateService.deleteDecalTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries(['decalTemplates']);
      toast.success('Đã xóa mẫu decal');
    },
    onError: (error) => {
      console.error('Delete template error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa mẫu thiết kế';
      toast.error('Lỗi khi xóa mẫu thiết kế: ' + errorMessage);
    }
  });

  const duplicateTemplateMutation = useMutation({
    mutationFn: (templateId) => {
      // For now, just show a message since we don't have duplicate API
      toast.success('Tính năng sao chép sẽ được thêm sau');
    },
    onError: (error) => {
      console.error('Duplicate template error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi sao chép mẫu thiết kế';
      toast.error('Lỗi khi sao chép mẫu thiết kế: ' + errorMessage);
    }
  });

  const favoriteTemplateMutation = useMutation({
    mutationFn: (templateId) => designService.updateDesign(templateId, { isFavorite: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(['designTemplates']);
      toast.success('Đã cập nhật yêu thích');
    },
    onError: (error) => {
      console.error('Favorite template error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi cập nhật yêu thích';
      toast.error('Lỗi khi cập nhật yêu thích: ' + errorMessage);
    }
  });

  // Filter templates based on search term
  const filteredTemplates = mappedTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.decalTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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

  // No need for category or vehicle type info functions

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
          <Button onClick={() => navigate('/decal-templates/add')} className="bg-blue-600 hover:bg-blue-700">
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
              <p className="text-2xl font-bold text-gray-900">{mappedTemplates.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Loại decal</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(mappedTemplates.map(t => t.decalTypeID)).size}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Có hình ảnh</p>
              <p className="text-2xl font-bold text-gray-900">
                {mappedTemplates.filter(t => t.imageUrl).length}
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
              <p className="text-sm font-medium text-gray-600">Kết quả tìm kiếm</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredTemplates.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm mẫu decal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
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
              return (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      {template.imageUrl ? (
                        <img
                          src={template.imageUrl}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image className="w-12 h-12 text-gray-400" />
                      )}
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
                      <Badge className="bg-purple-100 text-purple-800">
                        {template.decalTypeName}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 line-clamp-2">{template.name}</h4>
                      <Button
                        onClick={() => navigate(`/decal-templates/${template.id}`)}
                        variant="ghost"
                        size="sm"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">Mẫu decal {template.name} - {template.decalTypeName}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-purple-100 text-purple-800">
                        {template.decalTypeName}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800">
                        ID: {template.id}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        onClick={() => navigate(`/decal-templates/${template.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Xem
                      </Button>
                      <Button
                        onClick={() => navigate(`/decal-templates/edit/${template.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        onClick={() => deleteTemplateMutation.mutate(template.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                        title="Xóa"
                      >
                        <Trash2 className="w-3 h-3" />
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
              return (
                <Card key={template.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => handleSelectTemplate(template.id)}
                      className="rounded"
                    />
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {template.imageUrl ? (
                        <img
                          src={template.imageUrl}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">Mẫu decal {template.name} - {template.decalTypeName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-100 text-purple-800">
                            {template.decalTypeName}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-800">
                            ID: {template.id}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="text-gray-400">Mẫu decal</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{template.decalTypeName}</span>
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
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  {previewTemplate.imageUrl ? (
                    <img
                      src={previewTemplate.imageUrl}
                      alt={previewTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="w-16 h-16 text-gray-400" />
                  )}
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
                <p className="text-gray-600 mb-4">Mẫu decal {previewTemplate.name} - {previewTemplate.decalTypeName}</p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loại decal:</span>
                    <span className="font-medium">{previewTemplate.decalTypeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium font-mono">{previewTemplate.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Decal Type ID:</span>
                    <span className="font-medium font-mono">{previewTemplate.decalTypeID}</span>
                  </div>
                  {previewTemplate.imageUrl && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hình ảnh:</span>
                      <a
                        href={previewTemplate.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Xem ảnh gốc
                      </a>
                    </div>
                  )}
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
