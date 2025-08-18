import React, { useState, useEffect } from "react";
import { warrantyService } from "../../services/warrantyService";
import { customerService } from "../../services/customers";

const SupportTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    customerID: "",
    title: "",
    description: "",
    priority: "medium",
    category: "technical",
    status: "open",
    assignedTo: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, customersData] = await Promise.all([
        warrantyService.getSupportTickets(),
        customers.getCustomers(),
      ]);
      setTickets(ticketsData);
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
    const mockTickets = [
      {
        ticketID: "TKT001",
        customerID: "CUST001",
        title: "Decal bị bong tróc sau 1 tháng",
        description:
          "Decal tôi mua cách đây 1 tháng bị bong tróc ở một số chỗ. Cần hỗ trợ kiểm tra và thay thế.",
        priority: "high",
        category: "warranty",
        status: "open",
        assignedTo: "EMP001",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        ticketID: "TKT002",
        customerID: "CUST002",
        title: "Cần tư vấn về mẫu decal mới",
        description:
          "Tôi muốn tư vấn về các mẫu decal mới cho xe tải của mình. Có thể gọi điện tư vấn không?",
        priority: "medium",
        category: "consultation",
        status: "in_progress",
        assignedTo: "EMP002",
        createdAt: "2024-01-20",
        updatedAt: "2024-01-22",
      },
      {
        ticketID: "TKT003",
        customerID: "CUST003",
        title: "Đơn hàng bị chậm trễ",
        description:
          "Đơn hàng ORD003 của tôi đã quá hạn giao hàng 3 ngày. Cần kiểm tra và thông báo tình trạng.",
        priority: "high",
        category: "order",
        status: "resolved",
        assignedTo: "EMP003",
        createdAt: "2024-01-25",
        updatedAt: "2024-01-28",
        resolvedAt: "2024-01-28",
      },
      {
        ticketID: "TKT004",
        customerID: "CUST004",
        title: "Yêu cầu báo giá dịch vụ",
        description:
          "Tôi cần báo giá cho dịch vụ thiết kế và in decal cho 5 xe tải. Vui lòng liên hệ sớm.",
        priority: "low",
        category: "quotation",
        status: "closed",
        assignedTo: "EMP001",
        createdAt: "2024-01-30",
        updatedAt: "2024-02-01",
        resolvedAt: "2024-02-01",
      },
    ];
    setTickets(mockTickets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTicket) {
        await warrantyService.updateSupportTicket(
          selectedTicket.ticketID,
          formData
        );
      } else {
        await warrantyService.createSupportTicket(formData);
      }
      setShowModal(false);
      setSelectedTicket(null);
      setFormData({
        customerID: "",
        title: "",
        description: "",
        priority: "medium",
        category: "technical",
        status: "open",
        assignedTo: "",
      });
      loadData();
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      customerID: ticket.customerID,
      title: ticket.title || "",
      description: ticket.description || "",
      priority: ticket.priority,
      category: ticket.category,
      status: ticket.status,
      assignedTo: ticket.assignedTo || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ticket này?")) {
      try {
        await warrantyService.deleteSupportTicket(id);
        loadData();
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    }
  };

  const handleCloseTicket = async (id) => {
    try {
      await warrantyService.closeSupportTicket(id);
      loadData();
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  const getCustomerInfo = (customerID) => {
    return customers.find((customer) => customer.customerID === customerID);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Mở";
      case "in_progress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      case "closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return priority;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case "technical":
        return "Kỹ thuật";
      case "warranty":
        return "Bảo hành";
      case "order":
        return "Đơn hàng";
      case "consultation":
        return "Tư vấn";
      case "quotation":
        return "Báo giá";
      default:
        return category;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "technical":
        return "bg-blue-100 text-blue-800";
      case "warranty":
        return "bg-purple-100 text-purple-800";
      case "order":
        return "bg-indigo-100 text-indigo-800";
      case "consultation":
        return "bg-pink-100 text-pink-800";
      case "quotation":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const customer = getCustomerInfo(ticket.customerID);
    const matchesSearch =
      searchTerm === "" ||
      ticket.ticketID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer &&
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "in_progress"
  ).length;
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;
  const highPriorityTickets = tickets.filter(
    (t) => t.priority === "high"
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
            Quản Lý Ticket Hỗ Trợ
          </h1>
          <p className="mt-2 text-gray-600">
            Theo dõi và xử lý các yêu cầu hỗ trợ từ khách hàng
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Ticket</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {tickets.length}
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
                <p className="text-sm font-medium text-gray-600">Đang Mở</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {openTickets}
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
                <p className="text-sm font-medium text-gray-600">Đang Xử Lý</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inProgressTickets}
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
                  {resolvedTickets}
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
                placeholder="Tìm theo mã ticket, tiêu đề hoặc khách hàng..."
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
                <option value="open">Mở</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ Ưu Tiên
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Tất cả</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterPriority("all");
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
                Tạo Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Danh Sách Ticket
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách Hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu Đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh Mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ Ưu Tiên
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
                {filteredTickets.map((ticket) => {
                  const customer = getCustomerInfo(ticket.customerID);

                  return (
                    <tr key={ticket.ticketID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ticket.ticketID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer ? customer.fullName : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {ticket.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                            ticket.category
                          )}`}>
                          {getCategoryText(ticket.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                            ticket.priority
                          )}`}>
                          {getPriorityText(ticket.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            ticket.status
                          )}`}>
                          {getStatusText(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(ticket)}
                          className="text-blue-600 hover:text-blue-900 mr-3">
                          Sửa
                        </button>
                        {ticket.status !== "closed" && (
                          <button
                            onClick={() => handleCloseTicket(ticket.ticketID)}
                            className="text-green-600 hover:text-green-900 mr-3">
                            Đóng
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ticket.ticketID)}
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
                  {selectedTicket ? "Cập Nhật Ticket" : "Tạo Ticket Mới"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      rows="4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Danh Mục
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="technical">Kỹ thuật</option>
                      <option value="warranty">Bảo hành</option>
                      <option value="order">Đơn hàng</option>
                      <option value="consultation">Tư vấn</option>
                      <option value="quotation">Báo giá</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Độ Ưu Tiên
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                      <option value="low">Thấp</option>
                      <option value="medium">Trung bình</option>
                      <option value="high">Cao</option>
                    </select>
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
                      <option value="open">Mở</option>
                      <option value="in_progress">Đang xử lý</option>
                      <option value="resolved">Đã giải quyết</option>
                      <option value="closed">Đã đóng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giao Cho
                    </label>
                    <input
                      type="text"
                      value={formData.assignedTo}
                      onChange={(e) =>
                        setFormData({ ...formData, assignedTo: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mã nhân viên"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedTicket(null);
                        setFormData({
                          customerID: "",
                          title: "",
                          description: "",
                          priority: "medium",
                          category: "technical",
                          status: "open",
                          assignedTo: "",
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg">
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                      {selectedTicket ? "Cập Nhật" : "Tạo"}
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

export default SupportTicketPage;
