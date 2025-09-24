import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { roleService } from '../../services/roleService';
import { accountService } from '../../services/accountService';
import { storeService } from '../../services/storeService';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    storeID: '',
    // Thông tin tài khoản mới
    accountData: {
      username: '',
      password: '',
      roleID: '',
      isActive: true
    },
    roleIds: []
  });

  // Get roles data
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRoles(),
  });

  // Get stores data
  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => storeService.getStores(),
  });

  // Get current employees data để kiểm tra Manager
  const { data: currentEmployees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getEmployees(),
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: employeeService.createEmployee,
    onError: (error) => {
      toast.error('Lỗi khi tạo nhân viên: ' + (error.response?.data?.message || error.message));
    },
  });

  // Create account mutation
  const createAccountMutation = useMutation({
    mutationFn: accountService.createAccount,
    onError: (error) => {
      toast.error('Lỗi khi tạo tài khoản: ' + (error.response?.data?.message || error.message));
    },
  });

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
      setFormData(prev => {
        const newFormData = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        };

        // Nếu thay đổi storeID, reset roleIds để tránh conflict
        if (name === 'storeID') {
          newFormData.roleIds = [];
          // Hiển thị thông báo xác nhận
          const selectedStore = stores.find(store => store.storeID === value);
          if (selectedStore) {
            toast.success(`Đã chọn cửa hàng: ${selectedStore.storeName}`);
          }
        }

        return newFormData;
      });
    }
  };

  // Kiểm tra xem cửa hàng đã có Manager chưa
  const checkStoreHasManager = (storeId) => {
    return currentEmployees.some(employee =>
      employee.storeID === storeId &&
      employee.roles?.some(role => role.roleName === 'Manager')
    );
  };

  // Kiểm tra xem có thể chọn Manager role cho store này không
  const canSelectManagerRole = (storeId) => {
    if (!storeId) return true; // Chưa chọn store thì cho phép
    return !checkStoreHasManager(storeId);
  };

  const handleRoleChange = (roleId) => {
    const selectedRole = roles.find(role => role.roleID === roleId);

    // Nếu chọn Manager role, kiểm tra store đã có Manager chưa
    if (selectedRole?.roleName === 'Manager' && formData.storeID) {
      if (checkStoreHasManager(formData.storeID)) {
        toast.error('Cửa hàng này đã có Manager! Mỗi cửa hàng chỉ được phép có 1 Manager.');
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      roleIds: [roleId] // Chỉ cho phép chọn 1 vai trò
    }));

    // Hiển thị thông báo xác nhận
    toast.success(`Đã chọn vai trò: ${selectedRole?.roleName}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Bắt buộc phải có thông tin tài khoản
    if (!formData.accountData.username || !formData.accountData.password) {
      toast.error('Vui lòng nhập đầy đủ thông tin tài khoản!');
      return;
    }

    // Bắt buộc phải chọn vai trò
    if (formData.roleIds.length === 0) {
      toast.error('Vui lòng chọn một vai trò cho nhân viên!');
      return;
    }

    // Bắt buộc phải chọn cửa hàng
    if (!formData.storeID) {
      toast.error('Vui lòng chọn cửa hàng cho nhân viên!');
      return;
    }

    // Kiểm tra stores đã load xong chưa
    if (storesLoading) {
      toast.error('Đang tải danh sách cửa hàng, vui lòng đợi...');
      return;
    }

    // Kiểm tra có stores nào không
    if (stores.length === 0) {
      toast.error('Không có cửa hàng nào để chọn!');
      return;
    }

    // Kiểm tra Manager role validation
    const selectedRole = roles.find(role => role.roleID === formData.roleIds[0]);
    if (selectedRole?.roleName === 'Manager') {
      if (checkStoreHasManager(formData.storeID)) {
        toast.error('Cửa hàng này đã có Manager! Mỗi cửa hàng chỉ được phép có 1 Manager.');
        return;
      }
    }

    try {
      // Bước 1: Tạo Account trước
      const accountData = {
        Username: formData.accountData.username,
        PasswordHash: formData.accountData.password, // Lưu password đúng như user nhập
        Email: formData.email, // Dùng email của employee
        RoleID: formData.roleIds[0], // Sử dụng vai trò đã chọn từ radio button
        IsActive: formData.accountData.isActive
      };

      const createdAccount = await createAccountMutation.mutateAsync(accountData);
      toast.success('Tài khoản đã được tạo thành công!');

      // Bước 2: Tạo Employee với accountID vừa tạo
      const employeeData = {
        FirstName: formData.firstName,
        LastName: formData.lastName,
        Email: formData.email,
        PhoneNumber: formData.phoneNumber,
        Address: formData.address,
        StoreID: formData.storeID,
        AccountID: createdAccount.accountID, // Liên kết với account vừa tạo
        IsActive: true
      };

      const createdEmployee = await createEmployeeMutation.mutateAsync(employeeData);

      queryClient.invalidateQueries(['employees']);
      queryClient.invalidateQueries(['accounts']);

      toast.success('Nhân viên đã được tạo thành công!');
      navigate(-1);

    } catch (error) {
      // Error đã được xử lý trong onError của mutation
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/employees')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thêm nhân viên mới</h1>
        <p className="text-gray-600 mt-1">Tạo hồ sơ nhân viên và tài khoản đăng nhập</p>
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
                  placeholder="0912345678"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
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
                />
              </div>
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Thông tin công việc
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cửa hàng <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {storesLoading ? (
                  <p className="text-gray-500">Đang tải cửa hàng...</p>
                ) : (
                  stores.map(store => {
                    const hasManager = checkStoreHasManager(store.storeID);
                    return (
                      <label key={store.storeID} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="storeID"
                          value={store.storeID}
                          checked={formData.storeID === store.storeID}
                          onChange={handleInputChange}
                          className="text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">{store.storeName}</span>
                          {hasManager && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Đã có Manager
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Chọn một cửa hàng cho nhân viên
                {formData.storeID && checkStoreHasManager(formData.storeID) && (
                  <span className="text-orange-600 font-medium block mt-1">
                    ⚠️ Cửa hàng này đã có Manager. Chỉ có thể chọn các vai trò khác.
                  </span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {rolesLoading ? (
                  <p className="text-gray-500">Đang tải vai trò...</p>
                ) : (
                  roles
                    .filter(role => role.roleName !== 'Admin') // Lọc bỏ Admin role
                    .map(role => {
                      const isManagerRole = role.roleName === 'Manager';
                      const isDisabled = isManagerRole && formData.storeID && checkStoreHasManager(formData.storeID);

                      return (
                        <label key={role.roleID} className={`flex items-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input
                            type="radio"
                            name="roleIds"
                            value={role.roleID}
                            checked={formData.roleIds[0] === role.roleID}
                            onChange={() => handleRoleChange(role.roleID)}
                            className="text-blue-600 focus:ring-blue-500"
                            required={formData.roleIds.length === 0}
                            disabled={isDisabled}
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{role.roleName}</span>
                            {isDisabled && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Store đã có Manager
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Chọn một vai trò cho nhân viên (Admin không được phép).
                <span className="text-orange-600 font-medium"> Mỗi cửa hàng chỉ được phép có 1 Manager.</span>
                {formData.storeID && checkStoreHasManager(formData.storeID) && (
                  <span className="text-red-600 font-medium block mt-1">
                    ⚠️ Cửa hàng đã chọn có Manager. Vai trò Manager bị vô hiệu hóa.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Account Creation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Thông tin tài khoản <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-gray-600 mb-4">Tạo tài khoản đăng nhập cho nhân viên</p>

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
                  type={showPassword ? "text" : "password"}
                  name="account.password"
                  value={formData.accountData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div className="flex items-center">
              <input
                type="checkbox"
                name="account.isActive"
                checked={formData.accountData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Tài khoản hoạt động
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={createEmployeeMutation.isPending || createAccountMutation.isPending || storesLoading || rolesLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createEmployeeMutation.isPending || createAccountMutation.isPending ? 'Đang tạo...' :
              storesLoading || rolesLoading ? 'Đang tải...' : 'Tạo nhân viên'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployeePage;