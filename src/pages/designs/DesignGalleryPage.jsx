import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Eye, 
  Download, 
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
  FileText,
  Clock,
  User,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Button, Input, LoadingSpinner, Badge } from '../../components/common';
import { designService } from '../../services/designService';

const DesignGalleryPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const queryClient = useQueryClient();

  const { data: designs = [], isLoading, error } = useQuery({
    queryKey: ['designs', searchTerm, filterStatus],
    queryFn: () => designService.getDesigns({ search: searchTerm, status: filterStatus }),
  });

  const uploadMutation = useMutation({
    mutationFn: designService.uploadDesign,
    onSuccess: () => {
      toast.success('Thiết kế đã được tải lên thành công!');
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadPreview(null);
      queryClient.invalidateQueries(['designs']);
    },
    onError: (error) => {
      console.error('Error uploading design:', error);
      
      // Handle specific error cases
      if (error.response?.status === 415) {
        toast.error('API không hỗ trợ upload file. Vui lòng liên hệ admin để cấu hình.');
      } else if (error.response?.status === 413) {
        toast.error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.errors?.DesignURL) {
          toast.error('Lỗi DesignURL: ' + errorData.errors.DesignURL[0]);
        } else {
          toast.error('Dữ liệu không hợp lệ: ' + (errorData?.message || ''));
        }
      } else if (error.response?.status === 500) {
        toast.error('Lỗi server. Vui lòng thử lại sau.');
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải lên thiết kế');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: designService.deleteDesign,
    onSuccess: () => {
      toast.success('Thiết kế đã được xóa thành công!');
      queryClient.invalidateQueries(['designs']);
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa thiết kế: ' + error.message);
    },
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh!');
        return;
      }

      // Check file size (5MB limit for Base64)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
        return;
      }

      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (formData) => {
    if (!uploadFile) {
      toast.error('Vui lòng chọn file để tải lên!');
      return;
    }
    
    const uploadData = {
      file: uploadFile,
      designName: formData.designName || 'Thiết kế mới',
      description: formData.description || '',
      category: formData.category || 'General',
      tags: formData.tags || '',
      price: formData.price || '0'
    };
    
    uploadMutation.mutate(uploadData);
  };

  const handleDelete = (designId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết kế này?')) {
      deleteMutation.mutate(designId);
    }
  };

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.designName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.designer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || design.approvalStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thư viện Thiết kế</h1>
          <p className="text-gray-600">Quản lý và duyệt các thiết kế decal</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tải lên thiết kế mới
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm thiết kế..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Approved">Đã duyệt</option>
              <option value="Rejected">Từ chối</option>
            </select>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Design Gallery */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => (
            <Card key={design.designID} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 relative group">
                {design.designURL ? (
                  <img
                    src={design.designURL}
                    alt={design.designName || 'Design'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setSelectedDesign(design)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleDelete(design.designID)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {design.designName || `Design ${design.designID.slice(0, 8)}`}
                  </h3>
                  <Badge className={getStatusColor(design.approvalStatus)}>
                    {design.approvalStatus}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{design.designer?.name || 'Chưa xác định'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>v{design.version}</span>
                  </div>
                  {design.designPrice && (
                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <span>{design.designPrice.toLocaleString()} VNĐ</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Thiết kế</th>
                  <th className="text-left p-4">Người thiết kế</th>
                  <th className="text-left p-4">Phiên bản</th>
                  <th className="text-left p-4">Trạng thái</th>
                  <th className="text-left p-4">Giá</th>
                  <th className="text-left p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDesigns.map((design) => (
                  <tr key={design.designID} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          {design.designURL ? (
                            <img src={design.designURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">
                          {design.designName || `Design ${design.designID.slice(0, 8)}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">{design.designer?.name || 'Chưa xác định'}</td>
                    <td className="p-4">v{design.version}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(design.approvalStatus)}>
                        {design.approvalStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {design.designPrice ? `${design.designPrice.toLocaleString()} VNĐ` : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedDesign(design)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(design.designID)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Tải lên thiết kế mới</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleUpload({
                designName: formData.get('designName'),
                designPrice: parseFloat(formData.get('designPrice')) || 0,
                size: formData.get('size'),
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File thiết kế
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full"
                    required
                  />
                  {uploadPreview && (
                    <img src={uploadPreview} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
                  )}
                </div>
                <Input
                  name="designName"
                  placeholder="Tên thiết kế"
                  required
                />
                <Input
                  name="designPrice"
                  type="number"
                  placeholder="Giá thiết kế (VNĐ)"
                  min="0"
                />
                <Input
                  name="size"
                  placeholder="Kích thước (ví dụ: 20cm x 50cm)"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" disabled={uploadMutation.isPending} className="flex-1">
                  {uploadMutation.isPending ? 'Đang tải...' : 'Tải lên'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Design Preview Modal */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedDesign.designName || `Design ${selectedDesign.designID.slice(0, 8)}`}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDesign(null)}
              >
                Đóng
              </Button>
            </div>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {selectedDesign.designURL ? (
                  <img
                    src={selectedDesign.designURL}
                    alt={selectedDesign.designName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Người thiết kế:</span> {selectedDesign.designer?.name || 'Chưa xác định'}
                </div>
                <div>
                  <span className="font-medium">Phiên bản:</span> v{selectedDesign.version}
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span>{' '}
                  <Badge className={getStatusColor(selectedDesign.approvalStatus)}>
                    {selectedDesign.approvalStatus}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Giá:</span>{' '}
                  {selectedDesign.designPrice ? `${selectedDesign.designPrice.toLocaleString()} VNĐ` : 'Chưa định giá'}
                </div>
                {selectedDesign.size && (
                  <div className="col-span-2">
                    <span className="font-medium">Kích thước:</span> {selectedDesign.size}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignGalleryPage;