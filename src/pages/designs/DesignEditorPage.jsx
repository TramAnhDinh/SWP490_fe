import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  Link,
  Image as ImageIcon,
  FileText,
  Tag,
  DollarSign,
  Palette,
  X
} from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/common';
import { designService } from '../../services/designService';

const DesignEditorPage = () => {
  console.log('DesignEditorPage component loaded successfully');
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designURL, setDesignURL] = useState('');
  const [preview, setPreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    designName: '',
    description: '',
    category: '',
    tags: '',
    price: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Handle URL input
  const handleURLChange = (event) => {
    const url = event.target.value;
    setDesignURL(url);
    
    // Update preview if URL is valid
    if (url && isValidURL(url)) {
      setPreview(url);
    } else {
      setPreview(null);
    }

    // Clear URL error
    if (errors.designURL) {
      setErrors(prev => ({ ...prev, designURL: '' }));
    }
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.designName.trim()) {
      newErrors.designName = 'Tên thiết kế là bắt buộc';
    }

    if (!designURL.trim()) {
      newErrors.designURL = 'URL thiết kế là bắt buộc';
    } else if (!isValidURL(designURL)) {
      newErrors.designURL = 'URL không hợp lệ';
    }

    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Giá phải là số hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save design mutation
  const saveDesignMutation = useMutation({
    mutationFn: async (data) => {
      const result = await designService.uploadDesign(data);
      return result;
    },
    onSuccess: (data) => {
      toast.success('Thiết kế đã được lưu thành công!');
      queryClient.invalidateQueries(['designs']);
      navigate('/designs');
    },
    onError: (error) => {
      console.error('Error saving design:', error);
      
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
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thiết kế');
      }
    }
  });

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting upload with URL...', {
        designURL: designURL,
        designName: formData.designName
      });

      const uploadData = {
        designURL: designURL,
        designName: formData.designName,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        price: formData.price
      };

      await saveDesignMutation.mutateAsync(uploadData);
    } catch (error) {
      console.error('Error in handleSave:', error);
      // Error is handled in mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeURL = () => {
    setDesignURL('');
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/designs')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Soạn thảo thiết kế</h1>
              <p className="text-gray-600">Tạo thiết kế mới</p>
            </div>
          </div>
          
                      <Button
              onClick={handleSave}
              disabled={isSubmitting || !designURL}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Lưu thiết kế</span>
                </>
              )}
            </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* URL Input */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Link className="h-5 w-5 mr-2" />
                URL thiết kế
              </h3>
              
              {!designURL ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Link className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Nhập URL hình ảnh thiết kế</p>
                  <Input
                    type="url"
                    placeholder="https://example.com/design.jpg"
                    value={designURL}
                    onChange={handleURLChange}
                    className="w-full"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Link className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">URL thiết kế</p>
                        <p className="text-sm text-gray-500 break-all">
                          {designURL}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeURL}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    type="url"
                    placeholder="https://example.com/design.jpg"
                    value={designURL}
                    onChange={handleURLChange}
                    className="w-full"
                  />
                </div>
              )}
              
              {errors.designURL && (
                <p className="text-red-500 text-sm mt-2">{errors.designURL}</p>
              )}
            </Card>

            {/* Design Information */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Thông tin thiết kế
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thiết kế <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="designName"
                    value={formData.designName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên thiết kế"
                    className={errors.designName ? 'border-red-500' : ''}
                  />
                  {errors.designName && (
                    <p className="text-red-500 text-sm mt-1">{errors.designName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả thiết kế..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Vehicle">Xe cộ</option>
                    <option value="Business">Doanh nghiệp</option>
                    <option value="Personal">Cá nhân</option>
                    <option value="Event">Sự kiện</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Nhập tags (phân cách bằng dấu phẩy)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ)
                  </label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Xem trước
              </h3>
              
              {preview ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      URL: {designURL}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Chưa có URL để xem trước</p>
                  <p className="text-sm text-gray-400">Nhập URL hình ảnh để xem preview</p>
                </div>
              )}
            </Card>

            {/* Design Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Gợi ý thiết kế
              </h3>
              
                             <div className="space-y-3 text-sm text-gray-600">
                 <div className="flex items-start space-x-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                   <p>Nhập URL hình ảnh thiết kế từ internet</p>
                 </div>
                 <div className="flex items-start space-x-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                   <p>Hỗ trợ các định dạng: PNG, JPG, JPEG, SVG, WebP</p>
                 </div>
                 <div className="flex items-start space-x-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                   <p>URL phải có thể truy cập công khai</p>
                 </div>
                 <div className="flex items-start space-x-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                   <p>Có thể sử dụng: Imgur, Google Drive, Dropbox, etc.</p>
                 </div>
                 <div className="flex items-start space-x-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                   <p>Đảm bảo URL bắt đầu bằng http:// hoặc https://</p>
                 </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEditorPage;