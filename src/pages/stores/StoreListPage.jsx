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
  Download
} from 'lucide-react';
import { storeService } from '../../services/storeService';
import { employeeService } from '../../services/employeeService';

const StoreListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get stores data
  const { data: stores = [], isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: storeService.getStores,
  });

  // Get employees data để đếm nhân viên
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeService.getEmployees(),
  });

  // Delete store mutation
  const deleteMutation = useMutation({
    mutationFn: storeService.deleteStore,
    onSuccess: () => {
      toast.success('Cửa hàng đã được xóa thành công!');
      queryClient.invalidateQueries(['stores']);
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa cửa hàng: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleDelete = (storeId, storeName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cửa hàng "${storeName}"? Hành động này không thể hoàn tác.`)) {
      deleteMutation.mutate(storeId);
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

  // Lọc stores theo search
  const filteredStores = stores.filter(store => {
    const matchesSearch = searchTerm === '' ||
      store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Đếm nhân viên cho mỗi store
  const getEmployeeCount = (storeId) => {
    return employees.filter(emp => emp.storeID === storeId).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Cửa hàng</h1>
          <p className="text-gray-600">Quản lý thông tin và hoạt động của các cửa hàng</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleBulkAction('export')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
          <Link
            to="/stores/add"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm cửa hàng
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng cửa hàng</p>
              <p className="text-xl font-semibold">{stores.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng nhân viên</p>
              <p className="text-xl font-semibold">{employees.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã số, địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

        </div>

        {/* Bulk Actions */}
        {selectedStores.length > 0 && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-700">
              Đã chọn {selectedStores.length} cửa hàng
            </span>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Store Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
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
                <th className="text-left p-4">Cửa hàng</th>
                <th className="text-left p-4">Địa chỉ</th>
                <th className="text-left p-4">Nhân viên</th>
                <th className="text-left p-4">Thao tác</th>
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
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{store.address || 'Chưa có địa chỉ'}</span>
                      </div>
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
    </div>
  );
};

export default StoreListPage;
