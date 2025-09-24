import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Building,
  MapPin,
  Users,
  Download,
  Filter,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Store
} from 'lucide-react';
import { Card, Button, Badge, LoadingSpinner, Input, Modal } from '../../components/common';
import { storeService } from '../../services/storeService';
import { employeeService } from '../../services/employeeService';

const StoreListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get stores data
  const { data: stores = [], isLoading, error } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: () => storeService.getStores(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Get employees data để đếm nhân viên
  const { data: employees = [] } = useQuery({
    queryKey: ['admin-employees'],
    queryFn: () => employeeService.getEmployees(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Delete store mutation
  const deleteMutation = useMutation({
    mutationFn: storeService.deleteStore,
    onSuccess: () => {
      toast.success('Cửa hàng đã được xóa thành công!');
      queryClient.invalidateQueries(['admin-stores']);
      setShowDeleteModal(false);
      setStoreToDelete(null);
    },
    onError: (error) => {
      console.error('Delete store error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa cửa hàng';
      toast.error('Lỗi khi xóa cửa hàng: ' + errorMessage);
    },
  });

  const handleDelete = (storeId, storeName) => {
    // Kiểm tra xem cửa hàng có nhân viên không
    const employeeCount = getEmployeeCount(storeId);
    if (employeeCount > 0) {
      toast.error(`Không thể xóa cửa hàng "${storeName}" vì còn ${employeeCount} nhân viên đang làm việc. Vui lòng chuyển nhân viên sang cửa hàng khác trước khi xóa.`);
      return;
    }

    setStoreToDelete({ id: storeId, name: storeName });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (storeToDelete) {
      deleteMutation.mutate(storeToDelete.id);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedStores.length === 0) {
      toast.error('Vui lòng chọn ít nhất một cửa hàng!');
      return;
    }

    if (action === 'delete') {
      const confirmMessage = `Xóa ${selectedStores.length} cửa hàng đã chọn?`;

      if (window.confirm(confirmMessage)) {
        selectedStores.forEach(storeId => {
          deleteMutation.mutate(storeId);
        });
        setSelectedStores([]);
      }
    }
  };

  // Lọc stores theo search và status
  const filteredStores = stores.filter(store => {
    const matchesSearch = searchTerm === '' ||
      store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === '' ||
      store.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Đếm nhân viên cho mỗi store
  const getEmployeeCount = (storeId) => {
    return employees.filter(emp => emp.storeID === storeId).length;
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Lỗi: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chuỗi cửa hàng</h1>
          <p className="text-gray-600">Quản lý và giám sát tất cả cửa hàng trong hệ thống</p>
        </div>

        <Button
          onClick={() => navigate('/stores/add')}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm cửa hàng mới</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng cửa hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stores.length}
              </p>
            </div>
            <Store className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.length}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Tìm kiếm cửa hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Tạm dừng</option>
          </select>
          <Button
            onClick={() => handleBulkAction('export')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Xuất Excel</span>
          </Button>
        </div>
      </div>

      {/* Store Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedStores.length === filteredStores.length && filteredStores.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStores(filteredStores.map(store => store.storeID));
                      } else {
                        setSelectedStores([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4 font-medium text-gray-900">Cửa hàng</th>
                <th className="text-left p-4 font-medium text-gray-900">Địa chỉ</th>
                <th className="text-left p-4 font-medium text-gray-900">Nhân viên</th>
                <th className="text-left p-4 font-medium text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.storeID} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedStores.includes(store.storeID)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStores([...selectedStores, store.storeID]);
                        } else {
                          setSelectedStores(selectedStores.filter(id => id !== store.storeID));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{store.storeName}</p>
                        <p className="text-sm text-gray-500">ID: {store.storeID}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{store.address}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{getEmployeeCount(store.storeID)} nhân viên</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/stores/${store.storeID}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/stores/${store.storeID}/edit`)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(store.storeID, store.storeName)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStores.length === 0 && (
          <div className="p-8 text-center">
            <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Không tìm thấy cửa hàng nào phù hợp với bộ lọc</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa cửa hàng"
      >
        <div className="space-y-4">
          <p>
            Bạn có chắc chắn muốn xóa cửa hàng "{storeToDelete?.name}"?
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreListPage;