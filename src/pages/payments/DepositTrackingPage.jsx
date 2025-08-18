import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { customerService } from '../../services/customers';

const DepositTrackingPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    customerID: '',
    amount: '',
    depositType: 'order_deposit',
    status: 'pending',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [depositsData, customersData] = await Promise.all([
        paymentService.getDeposits(),
        customers.getCustomers()
      ]);
      setDeposits(depositsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error loading data:', error);
      // Use mock data for demonstration
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockDeposits = [
      {
        depositID: 'DEP001',
        customerID: 'CUST001',
        amount: 5000000,
        depositType: 'order_deposit',
        status: 'paid',
        dueDate: '2024-02-15',
        createdAt: '2024-01-15',
        notes: 'Đặt cọc cho đơn hàng decal xe tải'
      },
      {
        depositID: 'DEP002',
        customerID: 'CUST002',
        amount: 3000000,
        depositType: 'service_deposit',
        status: 'pending',
        dueDate: '2024-02-20',
        createdAt: '2024-01-20',
        notes: 'Đặt cọc dịch vụ thiết kế'
      },
      {
        depositID: 'DEP003',
        customerID: 'CUST003',
        amount: 8000000,
        depositType: 'order_deposit',
        status: 'refunded',
        dueDate: '2024-02-10',
        createdAt: '2024-01-10',
        notes: 'Đặt cọc đơn hàng lớn - đã hoàn tiền'
      },
      {
        depositID: 'DEP004',
        customerID: 'CUST004',
        amount: 2000000,
        depositType: 'service_deposit',
        status: 'overdue',
        dueDate: '2024-01-30',
        createdAt: '2024-01-05',
        notes: 'Đặt cọc dịch vụ - quá hạn'
      }
    ];
    setDeposits(mockDeposits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDeposit) {
        await paymentService.updateDeposit(selectedDeposit.depositID, formData);
      } else {
        await paymentService.createDeposit(formData);
      }
      setShowModal(false);
      setSelectedDeposit(null);
      setFormData({
        customerID: '',
        amount: '',
        depositType: 'order_deposit',
        status: 'pending',
        dueDate: '',
        notes: ''
      });
      loadData();
    } catch (error) {
      console.error('Error saving deposit:', error);
    }
  };

  const handleEdit = (deposit) => {
    setSelectedDeposit(deposit);
    setFormData({
      customerID: deposit.customerID,
      amount: deposit.amount,
      depositType: deposit.depositType,
      status: deposit.status,
      dueDate: deposit.dueDate,
      notes: deposit.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoản đặt cọc này?')) {
      try {
        await paymentService.deleteDeposit(id);
        loadData();
      } catch (error) {
        console.error('Error deleting deposit:', error);
      }
    }
  };

  const getCustomerInfo = (customerID) => {
    return customers.find(customer => customer.customerID === customerID);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'overdue': return 'Quá hạn';
      case 'refunded': return 'Đã hoàn tiền';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'order_deposit': return 'Đặt cọc đơn hàng';
      case 'service_deposit': return 'Đặt cọc dịch vụ';
      case 'maintenance_deposit': return 'Đặt cọc bảo trì';
      default: return type;
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    const customer = getCustomerInfo(deposit.customerID);
    const matchesSearch = searchTerm === '' || 
      deposit.depositID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer && customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || deposit.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const pendingDeposits = deposits
    .filter(deposit => deposit.status === 'pending')
    .reduce((sum, deposit) => sum + deposit.amount, 0);
  const overdueDeposits = deposits
    .filter(deposit => deposit.status === 'overdue')
    .reduce((sum, deposit) => sum + deposit.amount, 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Theo Dõi Tiền Đặt Cọc</h1>
          <p className="mt-2 text-gray-600">Quản lý và theo dõi các khoản đặt cọc của khách hàng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng Đặt Cọc</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(totalDeposits)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ Thanh Toán</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(pendingDeposits)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quá Hạn</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(overdueDeposits)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã Thanh Toán</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {deposits.filter(d => d.status === 'paid').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm Kiếm</label>
              <input
                type="text"
                placeholder="Tìm theo mã đặt cọc hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="paid">Đã thanh toán</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="overdue">Quá hạn</option>
                <option value="refunded">Đã hoàn tiền</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
              >
                Xóa Bộ Lọc
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm Đặt Cọc
              </button>
            </div>
          </div>
        </div>

        {/* Deposits Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Danh Sách Đặt Cọc</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã Đặt Cọc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách Hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại Đặt Cọc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hạn Thanh Toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeposits.map((deposit) => {
                  const customer = getCustomerInfo(deposit.customerID);
                  
                  return (
                    <tr key={deposit.depositID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deposit.depositID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer ? customer.fullName : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(deposit.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTypeText(deposit.depositType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                          {getStatusText(deposit.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(deposit.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deposit.dueDate ? new Date(deposit.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(deposit)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(deposit.depositID)}
                          className="text-red-600 hover:text-red-900"
                        >
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
                  {selectedDeposit ? 'Cập Nhật Đặt Cọc' : 'Thêm Đặt Cọc Mới'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Khách Hàng</label>
                    <select
                      value={formData.customerID}
                      onChange={(e) => setFormData({...formData, customerID: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Chọn khách hàng</option>
                      {customers.map(customer => (
                        <option key={customer.customerID} value={customer.customerID}>
                          {customer.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số Tiền</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Loại Đặt Cọc</label>
                    <select
                      value={formData.depositType}
                      onChange={(e) => setFormData({...formData, depositType: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="order_deposit">Đặt cọc đơn hàng</option>
                      <option value="service_deposit">Đặt cọc dịch vụ</option>
                      <option value="maintenance_deposit">Đặt cọc bảo trì</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Chờ thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="overdue">Quá hạn</option>
                      <option value="refunded">Đã hoàn tiền</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hạn Thanh Toán</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ghi Chú</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setSelectedDeposit(null);
                        setFormData({
                          customerID: '',
                          amount: '',
                          depositType: 'order_deposit',
                          status: 'pending',
                          dueDate: '',
                          notes: ''
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                      {selectedDeposit ? 'Cập Nhật' : 'Thêm'}
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

export default DepositTrackingPage;