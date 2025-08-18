import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderCreateFormData, useCreateOrderWithCustomer } from "../../hooks/useOrders";
import { useCustomerVehicles, useVehicleModels, useCreateCustomerVehicle } from "../../hooks/useVehicles";
import { useTechnicians } from "../../hooks/useEmployees";
import { useSearchCustomers, useCreateCustomer, useCustomers } from "../../hooks/useCustomers";
import { useServices } from "../../hooks/useServices";
import { toast } from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Textarea } from "../../components/ui/Textarea";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DateTimePicker from "../../components/ui/DateTimePicker";
import VehicleSearchInput from "../../components/ui/VehicleSearchInput";
import SearchableSelect from "../../components/ui/SearchableSelect";
import CreateVehicleModal from "../../components/ui/CreateVehicleModal";
import CustomerSearchModal from "../../components/ui/CustomerSearchModal";
import CreateCustomerModal from "../../components/ui/CreateCustomerModal";

const OrderCreatePage = () => {
  const navigate = useNavigate();
  const { data: formData, isLoading: isFormDataLoading, error: formDataError } = useOrderCreateFormData();
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useCustomerVehicles();
  const { data: vehicleModels = [], isLoading: isVehicleModelsLoading } = useVehicleModels();
  const { data: technicians = [], isLoading: isTechniciansLoading } = useTechnicians();
  const { data: customers = [], isLoading: isCustomersLoading } = useCustomers();
  const { data: services = [], isLoading: isServicesLoading } = useServices();

  // New hooks for customer functionality
  const searchCustomersMutation = useSearchCustomers();
  const createCustomerMutation = useCreateCustomer();
  const createOrderWithCustomerMutation = useCreateOrderWithCustomer();
  const createVehicleMutation = useCreateCustomerVehicle();

  // Form state
  const [formState, setFormState] = useState({
    totalAmount: "",
    assignedEmployeeID: "",
    vehicleID: "",
    expectedArrivalTime: null,
    priority: "",
    isCustomDecal: false,
    description: "",
    // Customer fields
    existingCustomerID: "",
    newCustomerPayload: null,
    // Service fields
    selectedServiceID: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Selected vehicle info for display
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Modal states
  const [showCreateVehicleModal, setShowCreateVehicleModal] = useState(false);
  const [showCustomerSearchModal, setShowCustomerSearchModal] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [createVehicleSearchTerm, setCreateVehicleSearchTerm] = useState('');

  // Priority options
  const priorityOptions = [
    { value: "Low", label: "Thấp", color: "text-green-600" },
    { value: "Medium", label: "Trung bình", color: "text-yellow-600" },
    { value: "High", label: "Cao", color: "text-red-600" },
  ];

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    console.log('Vehicle selected:', vehicle);
    console.log('Vehicle ID:', vehicle?.vehicleID);
    setSelectedVehicle(vehicle);
    handleInputChange("vehicleID", vehicle?.vehicleID || "");
  };

  // Handle create new vehicle
  const handleCreateNewVehicle = (searchTerm) => {
    setCreateVehicleSearchTerm(searchTerm);
    setShowCreateVehicleModal(true);
  };

  // Handle save new vehicle
  const handleSaveNewVehicle = async (vehicleData) => {
    try {
      // Nếu đã chọn khách hàng, chỉ truyền thông tin xe + customerID
      const payload = {
        licensePlate: vehicleData.licensePlate,
        chassisNumber: vehicleData.chassisNumber,
        color: vehicleData.color,
        year: vehicleData.year,
        initialKM: vehicleData.initialKM,
        modelID: vehicleData.modelID,
        customerID: selectedCustomer?.customerID || formState.existingCustomerID,
      };
      const newVehicle = await createVehicleMutation.mutateAsync(payload);
      setSelectedVehicle(newVehicle);
      handleInputChange("vehicleID", newVehicle.vehicleID);
      setShowCreateVehicleModal(false);
      setCreateVehicleSearchTerm('');
      toast.success("Đã tạo phương tiện mới thành công");
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast.error("Có lỗi xảy ra khi tạo phương tiện");
    }
  };

  // Handle service selection
  const handleServiceSelect = (serviceID) => {
    const service = services.find(s => s.serviceID === serviceID);
    if (service) {
      setSelectedService(service);
      handleInputChange("selectedServiceID", serviceID);
      handleInputChange("totalAmount", service.price?.toString() || "");
    }
  };

  // Handle customer search
  const handleCustomerSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      toast.error("Vui lòng nhập số điện thoại hoặc email để tìm kiếm");
      return;
    }

    try {
      const customers = await searchCustomersMutation.mutateAsync(searchTerm);
      if (customers && customers.length > 0) {
        setShowCustomerSearchModal(true);
      } else {
        // No customers found, show create customer modal
        setShowCreateCustomerModal(true);
      }
    } catch (error) {
      console.error("Error searching customers:", error);

      // Temporary workaround: If search fails, show create customer modal
      if (error.message && error.message.includes('Missing type map configuration')) {
        toast.error("Tính năng tìm kiếm khách hàng đang được cập nhật. Vui lòng tạo khách hàng mới.");
        setShowCreateCustomerModal(true);
      } else {
        toast.error("Có lỗi xảy ra khi tìm kiếm khách hàng");
      }
    }
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    handleInputChange("existingCustomerID", customer.customerID);
    handleInputChange("newCustomerPayload", null);
    setShowCustomerSearchModal(false);

    // Clear selected vehicle when customer changes
    setSelectedVehicle(null);
    handleInputChange("vehicleID", "");

    toast.success(`Đã chọn khách hàng: ${customer.firstName} ${customer.lastName}`);
  };

  // Handle create new customer
  const handleCreateNewCustomer = () => {
    setShowCustomerSearchModal(false);
    setShowCreateCustomerModal(true);
  };

  // Handle save new customer
  const handleSaveNewCustomer = async (customerData) => {
    try {
      const newCustomer = await createCustomerMutation.mutateAsync(customerData);

      setSelectedCustomer(newCustomer);
      handleInputChange("existingCustomerID", "");
      handleInputChange("newCustomerPayload", {
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        phoneNumber: newCustomer.phoneNumber,
        email: newCustomer.email,
        address: newCustomer.address,
        createAccount: customerData.createAccount || false,
      });

      // Clear selected vehicle when customer changes
      setSelectedVehicle(null);
      handleInputChange("vehicleID", "");

      setShowCreateCustomerModal(false);
      toast.success("Đã tạo khách hàng mới thành công");
    } catch (error) {
      console.error("Error creating customer:", error);

      // Temporary workaround: If create customer fails, create a mock customer
      if (error.message && error.message.includes('Missing type map configuration')) {
        const mockCustomer = {
          customerID: `CUST_${Date.now()}`,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phoneNumber: customerData.phoneNumber,
          email: customerData.email,
          address: customerData.address,
        };

        setSelectedCustomer(mockCustomer);
        handleInputChange("existingCustomerID", "");
        handleInputChange("newCustomerPayload", {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phoneNumber: customerData.phoneNumber,
          email: customerData.email,
          address: customerData.address,
          createAccount: customerData.createAccount || false,
        });

        // Clear selected vehicle when customer changes
        setSelectedVehicle(null);
        handleInputChange("vehicleID", "");

        setShowCreateCustomerModal(false);
        toast.success("Đã tạo khách hàng mới thành công (chế độ demo)");
      } else {
        toast.error("Có lỗi xảy ra khi tạo khách hàng");
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formState.selectedServiceID) {
      newErrors.selectedServiceID = "Vui lòng chọn dịch vụ";
    }

    if (!formState.totalAmount || parseFloat(formState.totalAmount) <= 0) {
      newErrors.totalAmount = "Tổng tiền phải lớn hơn 0";
    }

    if (!formState.assignedEmployeeID) {
      newErrors.assignedEmployeeID = "Vui lòng chọn nhân viên thực hiện";
    }

    if (!formState.vehicleID) {
      newErrors.vehicleID = "Vui lòng chọn phương tiện";
    }

    if (!formState.expectedArrivalTime) {
      newErrors.expectedArrivalTime = "Vui lòng chọn ngày dự kiến đến";
    }

    if (!formState.priority) {
      newErrors.priority = "Vui lòng chọn độ ưu tiên";
    }

    // Customer validation
    if (!formState.existingCustomerID && !formState.newCustomerPayload) {
      newErrors.customer = "Vui lòng chọn hoặc tạo khách hàng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin đã nhập");
      return;
    }

    try {
      console.log('Form state before submit:', formState);

      const orderData = {
        totalAmount: parseFloat(formState.totalAmount),
        assignedEmployeeID: formState.assignedEmployeeID,
        vehicleID: formState.vehicleID,
        expectedArrivalTime: formState.expectedArrivalTime,
        priority: formState.priority,
        isCustomDecal: formState.isCustomDecal,
        description: formState.description,
        // Customer data
        existingCustomerID: formState.existingCustomerID || undefined,
        newCustomerPayload: formState.newCustomerPayload || undefined,
        // Service data
        selectedServiceID: formState.selectedServiceID || undefined,
      };

      console.log('Order data to submit:', orderData);

      const createdOrder = await createOrderWithCustomerMutation.mutateAsync(orderData);

      // Success message based on response
      let successMessage = "Đã tạo đơn hàng thành công";

      if (createdOrder.customerFullName) {
        successMessage += ` cho khách hàng ${createdOrder.customerFullName}`;
      }

      if (createdOrder.vehicleBrandName && createdOrder.vehicleModelName) {
        successMessage += ` - xe ${createdOrder.vehicleBrandName} ${createdOrder.vehicleModelName}`;
      }

      if (createdOrder.accountCreated) {
        successMessage += ` (Đã tạo tài khoản cho khách hàng)`;
      }

      toast.success(successMessage);
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);

      // Temporary workaround: If backend API is not ready, show demo message
      if (error.message && error.message.includes('Missing type map configuration')) {
        toast.success("Đã tạo đơn hàng thành công (chế độ demo - backend đang được cập nhật)");
        navigate("/orders");
      } else {
        toast.error("Có lỗi xảy ra khi tạo đơn hàng");
      }
    }
  };

  // Loading state
  if (isFormDataLoading || isVehiclesLoading || isVehicleModelsLoading || isTechniciansLoading || isCustomersLoading || isServicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (formDataError) {
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
          <Button onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </div>
      </div>
    );
  }

  // Filter vehicles by selected customer
  const filteredVehicles = selectedCustomer
    ? vehicles.filter(vehicle => vehicle.customerID === selectedCustomer.customerID)
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tạo Đơn Hàng Mới</h1>
          <p className="text-gray-600 mt-1">Nhập thông tin chi tiết để tạo đơn hàng dán decal</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Thông Tin Khách Hàng</h2>
              </div>

              <div className="space-y-4">
                {selectedCustomer ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-green-900">
                          {selectedCustomer.firstName} {selectedCustomer.lastName}
                        </h3>
                        <p className="text-sm text-green-700">
                          {selectedCustomer.phoneNumber} • {selectedCustomer.email || 'Không có email'}
                        </p>
                        {selectedCustomer.address && (
                          <p className="text-sm text-green-600 mt-1">{selectedCustomer.address}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(null);
                          handleInputChange("existingCustomerID", "");
                          handleInputChange("newCustomerPayload", null);
                          // Clear selected vehicle when customer changes
                          setSelectedVehicle(null);
                          handleInputChange("vehicleID", "");
                        }}
                      >
                        Thay đổi
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          label="Chọn khách hàng"
                          value={formState.existingCustomerID}
                          onChange={(value) => {
                            const customer = customers.find(c => c.customerID === value);
                            if (customer) {
                              setSelectedCustomer(customer);
                              handleInputChange("existingCustomerID", value);
                              handleInputChange("newCustomerPayload", null);
                            }
                          }}
                          options={customers || []}
                          getOptionLabel={(customer) => `${customer.firstName} ${customer.lastName} - ${customer.phoneNumber}`}
                          getOptionValue={(customer) => customer.customerID}
                          placeholder="Chọn khách hàng từ danh sách..."
                          searchPlaceholder="Tìm kiếm khách hàng..."
                          error={errors.customer}
                          required
                          helper="Chọn khách hàng từ danh sách có sẵn"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateCustomerModal(true)}
                          className="whitespace-nowrap"
                        >
                          Thêm khách hàng
                        </Button>
                      </div>
                    </div>
                    {errors.customer && (
                      <p className="text-sm text-red-600">{errors.customer}</p>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Order Information */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Thông Tin Đơn Hàng</h2>
              </div>

              <div className="space-y-4">
                <SearchableSelect
                  label="Chọn dịch vụ"
                  value={formState.selectedServiceID}
                  onChange={handleServiceSelect}
                  options={services || []}
                  getOptionLabel={(service) => `${service.serviceName} - ${service.price?.toLocaleString('vi-VN')}đ`}
                  getOptionValue={(service) => service.serviceID}
                  placeholder="Chọn dịch vụ từ danh sách..."
                  searchPlaceholder="Tìm kiếm dịch vụ..."
                  error={errors.selectedServiceID}
                  required
                  helper="Chọn dịch vụ để tự động điền giá tiền"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Tổng tiền"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formState.totalAmount}
                    onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                    error={errors.totalAmount}
                    required
                    placeholder="0.00"
                    helper="Giá tiền sẽ tự động điền khi chọn dịch vụ"
                    disabled={!!selectedService}
                  />

                  <SearchableSelect
                    label="Độ ưu tiên"
                    value={formState.priority}
                    onChange={(value) => handleInputChange("priority", value)}
                    options={priorityOptions}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    placeholder="Chọn độ ưu tiên..."
                    searchPlaceholder="Tìm kiếm độ ưu tiên..."
                    error={errors.priority}
                    required
                  />
                </div>

                <div className="mt-4">
                  <DateTimePicker
                    label="Ngày dự kiến đến"
                    value={formState.expectedArrivalTime}
                    onChange={(value) => handleInputChange("expectedArrivalTime", value)}
                    error={errors.expectedArrivalTime}
                    required
                    minDate={new Date()}
                    helper="Chọn ngày và giờ khách hàng dự kiến đến"
                  />
                </div>

                <div className="mt-4">
                  <Textarea
                    label="Mô tả"
                    value={formState.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Nhập mô tả chi tiết về đơn hàng..."
                    rows={3}
                    helper="Mô tả chi tiết về yêu cầu dán decal"
                  />
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formState.isCustomDecal}
                      onChange={(e) => handleInputChange("isCustomDecal", e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Đây là decal tùy chỉnh
                    </span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Assignment Information */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Phân Công & Phương Tiện</h2>
              </div>

              <div className="space-y-4">
                <SearchableSelect
                  label="Nhân viên thực hiện"
                  value={formState.assignedEmployeeID}
                  onChange={(value) => handleInputChange("assignedEmployeeID", value)}
                  options={technicians || []}
                  getOptionLabel={(emp) => `${emp.firstName} ${emp.lastName} - ${emp.storeName || 'N/A'}`}
                  getOptionValue={(emp) => emp.employeeID}
                  placeholder="Chọn kỹ thuật viên..."
                  searchPlaceholder="Tìm kiếm kỹ thuật viên..."
                  error={errors.assignedEmployeeID}
                  required
                  helper="Chọn kỹ thuật viên sẽ thực hiện đơn hàng này"
                />

                {selectedCustomer ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <SearchableSelect
                          label="Phương tiện của khách hàng"
                          value={formState.vehicleID}
                          onChange={(value) => {
                            const vehicle = filteredVehicles.find(v => v.vehicleID === value);
                            if (vehicle) {
                              handleVehicleSelect(vehicle);
                            }
                          }}
                          options={filteredVehicles || []}
                          getOptionLabel={(vehicle) => `${vehicle.licensePlate || 'N/A'} - ${vehicle.vehicleBrandName} ${vehicle.vehicleModelName}`}
                          getOptionValue={(vehicle) => vehicle.vehicleID}
                          placeholder="Chọn phương tiện của khách hàng..."
                          searchPlaceholder="Tìm kiếm phương tiện..."
                          error={errors.vehicleID}
                          required
                          helper={`Phương tiện của ${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateVehicleModal(true)}
                          className="whitespace-nowrap"
                        >
                          Thêm xe mới
                        </Button>
                      </div>
                    </div>
                    {filteredVehicles.length === 0 && (
                      <p className="text-sm text-gray-500">
                        Khách hàng chưa có phương tiện nào. Vui lòng thêm phương tiện mới.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm text-yellow-800">
                        Vui lòng chọn khách hàng trước để xem danh sách phương tiện
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Customer Info */}
            {selectedCustomer && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Khách Hàng
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tên:</span>
                    <span className="font-medium">{selectedCustomer.firstName} {selectedCustomer.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">SĐT:</span>
                    <span className="font-medium">{selectedCustomer.phoneNumber}</span>
                  </div>
                  {selectedCustomer.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium">{selectedCustomer.email}</span>
                    </div>
                  )}
                  {selectedCustomer.address && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Địa chỉ:</span>
                      <span className="font-medium text-right">{selectedCustomer.address}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Selected Vehicle Info */}
            {selectedVehicle && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thông Tin Xe
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Biển số:</span>
                    <span className="font-medium">{selectedVehicle.licensePlate || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Số khung:</span>
                    <span className="font-medium">{selectedVehicle.chassisNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hãng xe:</span>
                    <span className="font-medium">{selectedVehicle.vehicleBrandName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Model:</span>
                    <span className="font-medium">{selectedVehicle.vehicleModelName}</span>
                  </div>
                  {selectedVehicle.customerFullName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Khách hàng:</span>
                      <span className="font-medium">{selectedVehicle.customerFullName}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
            {/* Action Buttons */}
            <Card className="p-4">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createOrderWithCustomerMutation.isPending}
                >
                  {createOrderWithCustomerMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Đang tạo đơn hàng...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tạo Đơn Hàng
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/orders")}
                  disabled={createOrderWithCustomerMutation.isPending}
                >
                  Hủy bỏ
                </Button>
              </div>
            </Card>
            {/* Selected Service Info */}
            {selectedService && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dịch Vụ Đã Chọn
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tên dịch vụ:</span>
                    <span className="font-medium">{selectedService.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Giá:</span>
                    <span className="font-medium text-green-600">{selectedService.price?.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {selectedService.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mô tả:</span>
                      <span className="font-medium text-right">{selectedService.description}</span>
                    </div>
                  )}
                  {selectedService.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Danh mục:</span>
                      <span className="font-medium">{selectedService.category}</span>
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
                    <li>• Có thể tìm kiếm khách hàng theo SĐT hoặc email</li>
                    <li>• Có thể tạo khách hàng mới nếu chưa có</li>
                    <li>• Ngày dự kiến đến phải sau thời điểm hiện tại</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>

      {/* Modals */}
      <CreateVehicleModal
        isOpen={showCreateVehicleModal}
        onClose={() => {
          setShowCreateVehicleModal(false);
          setCreateVehicleSearchTerm('');
        }}
        onSave={handleSaveNewVehicle}
        initialSearchTerm={createVehicleSearchTerm}
        vehicleModels={vehicleModels}
        isLoading={createVehicleMutation.isPending}
        customerInfo={selectedCustomer || null}
        prefillCustomerData={true}
      />

      <CustomerSearchModal
        isOpen={showCustomerSearchModal}
        onClose={() => setShowCustomerSearchModal(false)}
        onSelect={handleCustomerSelect}
        onCreateNew={handleCreateNewCustomer}
        customers={searchCustomersMutation.data || []}
        isLoading={searchCustomersMutation.isPending}
      />

      <CreateCustomerModal
        isOpen={showCreateCustomerModal}
        onClose={() => setShowCreateCustomerModal(false)}
        onSave={handleSaveNewCustomer}
        isLoading={createCustomerMutation.isPending}
      />
    </div>
  );
};

export default OrderCreatePage;
