import React, { useState, useEffect } from "react";
import { warrantyService } from "../../services/warrantyService";
import { customerService } from "../../services/customers";

const FeedbackSystemPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    orderID: "",
    customerID: "",
    rating: 5,
    feedbackType: "general",
    title: "",
    content: "",
    status: "pending",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedbacksData, customersData] = await Promise.all([
        warrantyService.getFeedbacks(),
        customers.getCustomers(),
      ]);
      setFeedbacks(feedbacksData);
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
    const mockFeedbacks = [
      {
        feedbackID: "FB001",
        orderID: "ORD001",
        customerID: "CUST001",
        rating: 5,
        feedbackType: "service",
        title: "Dịch vụ tuyệt vời",
        content:
          "Nhân viên phục vụ rất nhiệt tình, chất lượng decal rất tốt. Tôi rất hài lòng với dịch vụ.",
        status: "resolved",
        createdAt: "2024-01-15",
        resolvedAt: "2024-01-16",
      },
      {
        feedbackID: "FB002",
        orderID: "ORD002",
        customerID: "CUST002",
        rating: 4,
        feedbackType: "quality",
        title: "Chất lượng tốt",
        content:
          "Decal đẹp, bền màu. Tuy nhiên thời gian giao hàng hơi chậm một chút.",
        status: "pending",
        createdAt: "2024-01-20",
      },
      {
        feedbackID: "FB003",
        orderID: "ORD003",
        customerID: "CUST003",
        rating: 2,
        feedbackType: "complaint",
        title: "Không hài lòng về thời gian",
        content:
          "Đơn hàng bị chậm trễ nhiều so với cam kết. Cần cải thiện thời gian giao hàng.",
        status: "in_progress",
        createdAt: "2024-01-25",
      },
      {
        feedbackID: "FB004",
        orderID: "ORD004",
        customerID: "CUST004",
        rating: 5,
        feedbackType: "suggestion",
        title: "Đề xuất cải thiện",
        content: "Nên có thêm nhiều mẫu decal mới và cập nhật thường xuyên.",
        status: "resolved",
        createdAt: "2024-01-30",
        resolvedAt: "2024-02-01",
      },
    ];
    setFeedbacks(mockFeedbacks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFeedback) {
        await warrantyService.updateFeedback(
          selectedFeedback.feedbackID,
          formData
        );
      } else {
        await warrantyService.createFeedback(formData);
      }
      setShowModal(false);
      setSelectedFeedback(null);
      setFormData({
        orderID: "",
        customerID: "",
        rating: 5,
        feedbackType: "general",
        title: "",
        content: "",
        status: "pending",
      });
      loadData();
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const handleEdit = (feedback) => {
    setSelectedFeedback(feedback);
    setFormData({
      orderID: feedback.orderID,
      customerID: feedback.customerID,
      rating: feedback.rating,
      feedbackType: feedback.feedbackType,
      title: feedback.title || "",
      content: feedback.content || "",
      status: feedback.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) {
      try {
        await warrantyService.deleteFeedback(id);
        loadData();
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    }
  };

  const getCustomerInfo = (customerID) => {
    return customers.find((customer) => customer.customerID === customerID);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "resolved":
        return "Đã giải quyết";
      case "pending":
        return "Chờ xử lý";
      case "in_progress":
        return "Đang xử lý";
      case "closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case "general":
        return "Chung";
      case "service":
        return "Dịch vụ";
      case "quality":
        return "Chất lượng";
      case "complaint":
        return "Khiếu nại";
      case "suggestion":
        return "Đề xuất";
      default:
        return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "general":
        return "bg-gray-100 text-gray-800";
      case "service":
        return "bg-blue-100 text-blue-800";
      case "quality":
        return "bg-green-100 text-green-800";
      case "complaint":
        return "bg-red-100 text-red-800";
      case "suggestion":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const customer = getCustomerInfo(feedback.customerID);
    const matchesSearch =
      searchTerm === "" ||
      feedback.feedbackID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer &&
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || feedback.status === filterStatus;
    const matchesRating =
      filterRating === "all" || feedback.rating === parseInt(filterRating);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
        ).toFixed(1)
      : 0;

  const totalFeedbacks = feedbacks.length;
  const resolvedFeedbacks = feedbacks.filter(
    (f) => f.status === "resolved"
  ).length;
  const pendingFeedbacks = feedbacks.filter(
    (f) => f.status === "pending"
  ).length;

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
          <h1 className="text-3xl font-bold text-gray-900">
            Hệ Thống Phản Hồi
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý và xử lý phản hồi từ khách hàng
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Tổng Phản Hồi
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalFeedbacks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đánh Giá TB</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {averageRating}/5
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
                  Đã Giải Quyết
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {resolvedFeedbacks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ Xử Lý</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingFeedbacks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm Kiếm
              </label>
              <input
                type="text"
                placeholder="Tìm theo mã, tiêu đề hoặc khách hàng..."
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
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh Giá
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Tất cả</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterRating("all");
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
                Thêm Phản Hồi
              </button>
            </div>
          </div>
        </div>

        {/* Feedbacks Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Danh Sách Phản Hồi
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Phản Hồi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách Hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu Đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedbacks.map((feedback) => {
                  const customer = getCustomerInfo(feedback.customerID);

                  return (
                    <tr key={feedback.feedbackID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feedback.feedbackID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer ? customer.fullName : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {feedback.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                            feedback.feedbackType
                          )}`}>
                          {getTypeText(feedback.feedbackType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(feedback.rating)}
                          <span className="ml-1 text-sm text-gray-600">
                            ({feedback.rating})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            feedback.status
                          )}`}>
                          {getStatusText(feedback.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(feedback.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(feedback)}
                          className="text-blue-600 hover:text-blue-900 mr-3">
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(feedback.feedbackID)}
                          className="text-red-600 hover:text-red-900">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
                  {selectedFeedback ? "Cập Nhật Phản Hồi" : "Thêm Phản Hồi Mới"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mã Đơn Hàng
                    </label>
                    <input
                      type="text"
                      value={formData.orderID}
                      onChange={(e) =>
                        setFormData({ ...formData, orderID: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Khách Hàng
                    </label>
                    <select
                      value={formData.customerID}
                      onChange={(e) =>
                        setFormData({ ...formData, customerID: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required>
                      <option value="">Chọn khách hàng</option>
                      {customers.map((customer) => (
                        <option
                          key={customer.customerID}
                          value={customer.customerID}>
                          {customer.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Đánh Giá
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value={5}>5 sao - Rất tốt</option>
                      <option value={4}>4 sao - Tốt</option>
                      <option value={3}>3 sao - Bình thường</option>
                      <option value={2}>2 sao - Không tốt</option>
                      <option value={1}>1 sao - Rất không tốt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại Phản Hồi
                    </label>
                    <select
                      value={formData.feedbackType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          feedbackType: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="general">Chung</option>
                      <option value="service">Dịch vụ</option>
                      <option value="quality">Chất lượng</option>
                      <option value="complaint">Khiếu nại</option>
                      <option value="suggestion">Đề xuất</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tiêu Đề
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nội Dung
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng Thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="pending">Chờ xử lý</option>
                      <option value="in_progress">Đang xử lý</option>
                      <option value="resolved">Đã giải quyết</option>
                      <option value="closed">Đã đóng</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedFeedback(null);
                        setFormData({
                          orderID: "",
                          customerID: "",
                          rating: 5,
                          feedbackType: "general",
                          title: "",
                          content: "",
                          status: "pending",
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg">
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                      {selectedFeedback ? "Cập Nhật" : "Thêm"}
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

export default FeedbackSystemPage;
