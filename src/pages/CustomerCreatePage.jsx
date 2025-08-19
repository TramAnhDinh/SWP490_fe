import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { customerService } from '../services/customers';
import { accountService } from '../services/accountService';

const CustomerCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  // Form state - chỉ những trường backend cần
  const [formData, setFormData] = useState({
    // Thông tin khách hàng (7 trường backend cần)
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    // Thông tin tài khoản mới
    accountData: {
      username: '',
      password: '',
      roleID: '', // Sẽ set là Customer role
      isActive: true
    }
  });

  // Get roles data để lấy Customer role
  const { data: allRoles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => accountService.getRoles(),
  });

  // Filter out Admin role - khách hàng không thể có quyền Admin
  const roles = allRoles.filter(role => role.roleName !== 'Admin');

  // Tìm Customer role
  const customerRole = roles.find(role => role.roleName === 'Customer');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Xử lý nested accountData
    if (name.startsWith('account.')) {
      const accountField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        accountData: {
          ...prev.accountData,
          [accountField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Validation function - chỉ validate những trường backend cần
  const validateForm = () => {
    const newErrors = {};

    // Validate thông tin khách hàng (5 trường bắt buộc)
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Họ là bắt buộc';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Tên là bắt buộc';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    // Validate thông tin tài khoản
    if (!formData.accountData.username.trim()) {
      newErrors.username = 'Tên đăng nhập là bắt buộc';
    }

    if (!formData.accountData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.accountData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    return newErrors;
  };

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: accountService.createAccount,
    onError: (error) => {
      toast.error('Lỗi khi tạo tài khoản: ' + (error.response?.data?.message || error.message));
    },
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: customerService.createCustomer,
    onError: (error) => {
      toast.error('Lỗi khi tạo khách hàng: ' + (error.response?.data?.message || error.message));
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Hiển thị lỗi đầu tiên
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    // Kiểm tra có Customer role không
    if (!customerRole) {
      toast.error('Không tìm thấy vai trò Customer trong hệ thống!');
      return;
    }

    try {
      // Bước 1: Tạo Account trước
      const accountData = {
        Username: formData.accountData.username,
        PasswordHash: formData.accountData.password,
        Email: formData.email,
        RoleID: customerRole.roleID, // Sử dụng Customer role
        IsActive: formData.accountData.isActive
      };

      const createdAccount = await createAccountMutation.mutateAsync(accountData);
      toast.success('Tài khoản đã được tạo thành công!');

      // Bước 2: Tạo Customer với accountID vừa tạo
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerFullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        accountID: createdAccount.accountID // Liên kết với account vừa tạo
      };

      const createdCustomer = await createCustomerMutation.mutateAsync(customerData);
      toast.success('Khách hàng đã được tạo thành công và liên kết với tài khoản!');

      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['accounts']);
      navigate('/customers');

    } catch (error) {
      // Error đã được xử lý trong onError của mutation
    }
  };

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thêm khách hàng mới</h1>
        <p className="text-gray-600 mt-1">Tạo hồ sơ khách hàng và tài khoản đăng nhập</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập họ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0123456789"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập địa chỉ đầy đủ"
                required
              />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Thông tin tài khoản
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="account.username"
                value={formData.accountData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="account.password"
                  value={formData.accountData.password}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="account.isActive"
                checked={formData.accountData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Tài khoản đang hoạt động</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Tạo khách hàng
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerCreatePage;