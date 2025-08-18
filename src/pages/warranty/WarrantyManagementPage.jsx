import React, { useState, useEffect } from "react";
import { warrantyService } from "../../services/warrantyService";
import { customerService } from "../../services/customers";

const WarrantyManagementPage = () => {
  const [warranties, setWarranties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    vehicleID: "",
    warrantyType: "standard",
    startDate: "",
    endDate: "",
    warrantyStatus: "active",
    description: "",
    terms: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [warrantiesData, customersData] = await Promise.all([
        warrantyService.getWarranties(),
        customers.getCustomers(),
      ]);
      setWarranties(warrantiesData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading data:", error);
      // Use mock data for demonstration
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockWarranties = [
      {
        warrantyID: "WAR001",
        vehicleID: "VEH001",
        warrantyType: "standard",
        startDate: "2024-01-01",
        endDate: "2025-01-01",
        warrantyStatus: "active",
        description: "Bảo hành tiêu chuẩn cho decal xe tải",
        terms: "Bảo hành 12 tháng cho chất lượng decal",
        createdAt: "2024-01-01",
      },
      {
        warrantyID: "WAR002",
        vehicleID: "VEH002",
        warrantyType: "extended",
        startDate: "2024-01-15",
        endDate: "2026-01-15",
        warrantyStatus: "active",
        description: "Bảo hành mở rộng cho xe khách",
        terms: "Bảo hành 24 tháng với dịch vụ ưu tiên",
        createdAt: "2024-01-15",
      },
      {
        warrantyID: "WAR003",
        vehicleID: "VEH003",
        warrantyType: "premium",
        startDate: "2024-02-01",
        endDate: "2027-02-01",
        warrantyStatus: "expired",
        description: "Bảo hành cao cấp cho xe sang trọng",
        terms: "Bảo hành 36 tháng với bảo trì định kỳ",
        createdAt: "2024-02-01",
      },
      {
        warrantyID: "WAR004",
        vehicleID: "VEH004",
        warrantyType: "standard",
        startDate: "2024-01-10",
        endDate: "2025-01-10",
        warrantyStatus: "cancelled",
        description: "Bảo hành tiêu chuẩn - đã hủy",
        terms: "Bảo hành 12 tháng",
        createdAt: "2024-01-10",
      },
    ];
    setWarranties(mockWarranties);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedWarranty) {
        await warrantyService.updateWarranty(
          selectedWarranty.warrantyID,
          formData
        );
      } else {
        await warrantyService.createWarranty(formData);
      }
      setShowModal(false);
      setSelectedWarranty(null);
      setFormData({
        vehicleID: "",
        warrantyType: "standard",
        startDate: "",
        endDate: "",
        warrantyStatus: "active",
        description: "",
        terms: "",
      });
      loadData();
    } catch (error) {
      console.error("Error saving warranty:", error);
    }
  };

  const handleEdit = (warranty) => {
    setSelectedWarranty(warranty);
    setFormData({
      vehicleID: warranty.vehicleID,
      warrantyType: warranty.warrantyType,
      startDate: warranty.startDate,
      endDate: warranty.endDate,
      warrantyStatus: warranty.warrantyStatus,
      description: warranty.description || "",
      terms: warranty.terms || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bảo hành này?")) {
      try {
        await warrantyService.deleteWarranty(id);
        loadData();
      } catch (error) {
        console.error("Error deleting warranty:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "expired":
        return "Hết hạn";
      case "cancelled":
        return "Đã hủy";
      case "suspended":
        return "Tạm ngưng";
      default:
        return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "standard":
        return "Tiêu chuẩn";
      case "extended":
        return "Mở rộng";
      case "premium":
        return "Cao cấp";
      case "lifetime":
        return "Trọn đời";
      default:
        return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "standard":
        return "bg-blue-100 text-blue-800";
      case "extended":
        return "bg-purple-100 text-purple-800";
      case "premium":
        return "bg-indigo-100 text-indigo-800";
      case "lifetime":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredWarranties = warranties.filter((warranty) => {
    const matchesSearch =
      searchTerm === "" ||
      warranty.warrantyID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warranty.vehicleID.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || warranty.warrantyStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeWarranties = warranties.filter(
    (w) => w.warrantyStatus === "active"
  ).length;
  const expiredWarranties = warranties.filter(
    (w) => w.warrantyStatus === "expired"
  ).length;
  const cancelledWarranties = warranties.filter(
    (w) => w.warrantyStatus === "cancelled"
  ).length;

  const isWarrantyExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Bảo Hành</h1>
          <p className="mt-2 text-gray-600">
            Theo dõi và quản lý các chính sách bảo hành
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng Bảo Hành
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {warranties.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Đang Hoạt Động
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activeWarranties}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hết Hạn</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {expiredWarranties}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã Hủy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {cancelledWarranties}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm Kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo mã bảo hành hoặc xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng Thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Tất cả</option>
                <option value="active">Đang hoạt động</option>
                <option value="expired">Hết hạn</option>
                <option value="cancelled">Đã hủy</option>
                <option value="suspended">Tạm ngưng</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg">
                Xóa Bộ Lọc
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Thêm Bảo Hành
              </button>
            </div>
          </div>
        </div>

        {/* Warranties Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Danh Sách Bảo Hành
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Bảo Hành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Xe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại Bảo Hành
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Bắt Đầu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Kết Thúc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWarranties.map((warranty) => (
                  <tr key={warranty.warrantyID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {warranty.warrantyID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {warranty.vehicleID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          warranty.warrantyType
                        )}`}>
                        {getTypeText(warranty.warrantyType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          warranty.warrantyStatus
                        )}`}>
                        {getStatusText(warranty.warrantyStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(warranty.startDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span
                        className={
                          isWarrantyExpired(warranty.endDate)
                            ? "text-red-600 font-medium"
                            : ""
                        }>
                        {new Date(warranty.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(warranty)}
                        className="text-blue-600 hover:text-blue-900 mr-3">
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(warranty.warrantyID)}
                        className="text-red-600 hover:text-red-900">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {selectedWarranty ? "Cập Nhật Bảo Hành" : "Thêm Bảo Hành Mới"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã Xe
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleID}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicleID: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại Bảo Hành
                    </label>
                    <select
                      value={formData.warrantyType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          warrantyType: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="standard">Tiêu chuẩn</option>
                      <option value="extended">Mở rộng</option>
                      <option value="premium">Cao cấp</option>
                      <option value="lifetime">Trọn đời</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày Bắt Đầu
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày Kết Thúc
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng Thái
                    </label>
                    <select
                      value={formData.warrantyStatus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          warrantyStatus: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="active">Đang hoạt động</option>
                      <option value="expired">Hết hạn</option>
                      <option value="cancelled">Đã hủy</option>
                      <option value="suspended">Tạm ngưng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mô Tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Điều Khoản
                    </label>
                    <textarea
                      value={formData.terms}
                      onChange={(e) =>
                        setFormData({ ...formData, terms: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedWarranty(null);
                        setFormData({
                          vehicleID: "",
                          warrantyType: "standard",
                          startDate: "",
                          endDate: "",
                          warrantyStatus: "active",
                          description: "",
                          terms: "",
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg">
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                      {selectedWarranty ? "Cập Nhật" : "Thêm"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarrantyManagementPage;
