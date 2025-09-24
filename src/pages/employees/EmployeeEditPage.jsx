import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Shield,
    ArrowLeft,
    Save
} from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import { roleService } from '../../services/roleService';
import { accountService } from '../../services/accountService';
import { storeService } from '../../services/storeService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SearchableSelect from '../../components/ui/SearchableSelect';

const EmployeeEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        storeID: '',
        // Thông tin tài khoản
        accountData: {
            username: '',
            roleID: '',
            isActive: true
        },
    });

    const [errors, setErrors] = useState({});

    // Get employee data
    const { data: employee, isLoading: isEmployeeLoading, error: employeeError } = useQuery({
        queryKey: ['employee', id],
        queryFn: async () => {
            const result = await employeeService.getEmployeeById(id);
            console.log('Employee data from API:', result);
            return result;
        },
        enabled: !!id,
    });

    // Get roles data
    const { data: roles = [], isLoading: rolesLoading, error: rolesError } = useQuery({
        queryKey: ['roles'],
        queryFn: () => roleService.getRoles(),
    });

    console.log('Roles data:', roles);
    console.log('Roles loading:', rolesLoading);
    console.log('Roles error:', rolesError);

    // Lọc roles để chỉ hiển thị các vai trò staff (không bao gồm Customer)
    const staffRoles = [
        { roleID: 'MANAGER', roleName: 'Manager' },
        { roleID: 'SALES', roleName: 'Sales' },
        { roleID: 'DESIGNER', roleName: 'Designer' },
        { roleID: 'TECHNICIAN', roleName: 'Technician' },
    ];

    // Sử dụng roles từ API nếu có, nhưng lọc để chỉ lấy staff roles
    const availableRoles = roles.length > 0
        ? roles.filter(role =>
            staffRoles.some(staffRole => staffRole.roleID === role.roleID)
        )
        : staffRoles;

    console.log('Available roles:', availableRoles);

    // Get stores data
    const { data: stores = [], isLoading: storesLoading, error: storesError } = useQuery({
        queryKey: ['stores'],
        queryFn: () => storeService.getStores(),
    });

    console.log('Stores data:', stores);
    console.log('Stores loading:', storesLoading);
    console.log('Stores error:', storesError);

    // Get current employees data để kiểm tra Manager
    const { data: currentEmployees = [], isLoading: employeesLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: () => employeeService.getEmployees(),
    });

    // Update employee mutation
    const updateEmployeeMutation = useMutation({
        mutationFn: ({ id, data }) => employeeService.updateEmployee(id, data),
        onSuccess: (data) => {
            console.log('Employee mutation success:', data);
            queryClient.invalidateQueries(['employees']);
            queryClient.invalidateQueries(['employee', id]);
        },
        onError: (error) => {
            console.error('Employee mutation error:', error);
            toast.error('Lỗi khi cập nhật nhân viên: ' + (error.response?.data?.message || error.message));
        },
    });

    // Update account mutation
    const updateAccountMutation = useMutation({
        mutationFn: ({ id, data }) => accountService.updateAccount(id, data),
        onSuccess: () => {
            toast.success('Cập nhật tài khoản thành công!');
            queryClient.invalidateQueries(['accounts']);
        },
        onError: (error) => {
            toast.error('Lỗi khi cập nhật tài khoản: ' + (error.response?.data?.message || error.message));
        },
    });

    // Load employee data into form
    useEffect(() => {
        console.log('Employee data changed:', employee);
        console.log('Employee ID from params:', id);

        if (employee) {
            console.log('Loading employee data:', employee);
            const newFormData = {
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                email: employee.email || '',
                phoneNumber: employee.phoneNumber || '',
                storeID: employee.storeID || '',
                accountData: {
                    username: employee.account?.username || '',
                    roleID: employee.account?.roleID || '',
                    isActive: employee.account?.isActive ?? true
                },
            };
            console.log('Setting form data:', newFormData);
            setFormData(newFormData);
        }
    }, [employee, id]);

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

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'Tên là bắt buộc';
        }

        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Họ là bắt buộc';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phoneNumber?.trim()) {
            newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
        }


        if (!formData.storeID) {
            newErrors.storeID = 'Cửa hàng là bắt buộc';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
            return;
        }


        try {
            console.log('Submitting employee data:', {
                id,
                employeeData: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    storeID: formData.storeID
                }
            });

            // Bước 1: Cập nhật Employee
            const employeeData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                storeID: formData.storeID,
                // Thêm các field có thể cần thiết
                isActive: true,
                employeeID: id
            };

            console.log('Sending employee data to API:', employeeData);

            // Thử sử dụng endpoint khác hoặc format khác
            let employeeResult;
            try {
                employeeResult = await updateEmployeeMutation.mutateAsync({ id: id, data: employeeData });
                console.log('Employee update result:', employeeResult);
                console.log('Employee update response data:', employeeResult);
            } catch (error) {
                console.error('PUT method failed:', error);

                // Thử PATCH method nếu PUT thất bại
                try {
                    console.log('Trying PATCH method...');
                    const patchResult = await employeeService.updateEmployeePatch(id, employeeData);
                    console.log('PATCH method result:', patchResult);
                    employeeResult = patchResult;
                } catch (patchError) {
                    console.error('PATCH method also failed:', patchError);
                    throw patchError; // Re-throw để xử lý ở catch block bên ngoài
                }
            }

            // Bước 2: Cập nhật Account (nếu có) - chỉ cập nhật trạng thái
            if (employee?.account?.accountID) {
                const accountData = {
                    isActive: formData.accountData.isActive
                };

                console.log('Updating account:', {
                    accountID: employee.account.accountID,
                    accountData
                });

                const accountResult = await updateAccountMutation.mutateAsync({
                    id: employee.account.accountID,
                    data: accountData
                });
                console.log('Account update result:', accountResult);
            }

            // Invalidate và refetch tất cả queries liên quan
            await queryClient.invalidateQueries(['employees']);
            await queryClient.invalidateQueries(['accounts']);
            await queryClient.invalidateQueries(['employee', id]);

            // Refetch employee data ngay lập tức
            await queryClient.refetchQueries(['employee', id]);

            toast.success('Cập nhật thông tin nhân viên thành công!');

            // Redirect về trang trước đó
            navigate(-1);

        } catch (error) {
            console.error('Error updating employee:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error('Có lỗi xảy ra khi cập nhật nhân viên: ' + (error.response?.data?.message || error.message));
        }
    };

    console.log('Loading states:', { isEmployeeLoading, rolesLoading, storesLoading, employeesLoading });
    console.log('Employee data:', employee);
    console.log('Form data:', formData);

    if (isEmployeeLoading || rolesLoading || storesLoading || employeesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (employeeError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải dữ liệu</h3>
                    <p className="text-gray-500 mb-4">Vui lòng thử lại sau</p>
                    <Button onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa nhân viên</h1>
                        <p className="text-gray-600 mt-1">Cập nhật thông tin chi tiết của nhân viên</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <User className="h-4 w-4 text-green-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Thông Tin Cá Nhân</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Họ"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    error={errors.lastName}
                                    required
                                    placeholder="Nguyễn"
                                />

                                <Input
                                    label="Tên"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    error={errors.firstName}
                                    required
                                    placeholder="Văn A"
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                    required
                                    placeholder="email@example.com"
                                />

                                <Input
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    error={errors.phoneNumber}
                                    required
                                    placeholder="0901234567"
                                />
                            </div>
                        </Card>

                        {/* Work Information */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Building className="h-4 w-4 text-purple-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">Thông Tin Công Việc</h2>
                            </div>

                            <div className="space-y-4">
                                <SearchableSelect
                                    label="Cửa hàng"
                                    value={formData.storeID}
                                    onChange={(value) => handleInputChange({ target: { name: 'storeID', value } })}
                                    options={stores}
                                    getOptionLabel={(store) => store.storeName}
                                    getOptionValue={(store) => store.storeID}
                                    placeholder="Chọn cửa hàng..."
                                    error={errors.storeID}
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vai trò hiện tại
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg flex-1">
                                            <span className="text-sm font-medium text-gray-900">
                                                {employee?.roles?.[0]?.roleName || 'Chưa có vai trò'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            (Không thể thay đổi)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Account Information */}
                        {employee?.account && (
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Shield className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Thông Tin Tài Khoản</h2>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label="Tên đăng nhập"
                                        name="account.username"
                                        value={formData.accountData.username}
                                        onChange={handleInputChange}
                                        disabled
                                        placeholder="Tên đăng nhập"
                                        helper="Không thể thay đổi tên đăng nhập"
                                    />

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="account.isActive"
                                            name="account.isActive"
                                            checked={formData.accountData.isActive}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="account.isActive" className="text-sm font-medium text-gray-700">
                                            Tài khoản hoạt động
                                        </label>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Buttons */}
                        <Card className="p-4">
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={updateEmployeeMutation.isPending || updateAccountMutation.isPending}
                                >
                                    {(updateEmployeeMutation.isPending || updateAccountMutation.isPending) ? (
                                        <div className="flex items-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            Đang cập nhật...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Lưu thay đổi
                                        </div>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate(-1)}
                                    disabled={updateEmployeeMutation.isPending || updateAccountMutation.isPending}
                                >
                                    Hủy bỏ
                                </Button>
                            </div>
                        </Card>

                        {/* Current Employee Info */}
                        {employee && (
                            <Card className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    Thông Tin Hiện Tại
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Họ tên:</span>
                                        <span className="font-medium">{employee.firstName} {employee.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="font-medium">{employee.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">SĐT:</span>
                                        <span className="font-medium">{employee.phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Cửa hàng:</span>
                                        <span className="font-medium">
                                            {stores.find(s => s.storeID === employee.storeID)?.storeName || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Vai trò:</span>
                                        <span className="font-medium">
                                            {employee.roles?.map(role => role.roleName).join(', ') || 'N/A'}
                                        </span>
                                    </div>
                                    {employee.account && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Trạng thái TK:</span>
                                            <span className={`font-medium ${employee.account.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                {employee.account.isActive ? 'Hoạt động' : 'Khóa'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Help Card */}
                        <Card className="p-4 bg-blue-50 border-blue-200">
                            <div className="flex items-start gap-2">
                                <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Lưu ý:</p>
                                    <ul className="space-y-1 text-blue-700">
                                        <li>• Tất cả trường có dấu (*) là bắt buộc</li>
                                        <li>• Mỗi cửa hàng chỉ được có 1 Manager</li>
                                        <li>• Không thể thay đổi tên đăng nhập</li>
                                        <li>• Thông tin sẽ được cập nhật ngay lập tức</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EmployeeEditPage;
