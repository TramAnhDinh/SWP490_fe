import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Clock, 
  User, 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  RefreshCw,
  Star,
  Timer,
  Users,
  Building,
  ArrowUpDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { installationService } from '../../services/installationService';
import { employeeService } from '../../services/employeeService';
import { storeService } from '../../services/storeService';

const InstallationQueuePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTechnician, setFilterTechnician] = useState('all');
  const [filterStore, setFilterStore] = useState('all');
  const [selectedInstallations, setSelectedInstallations] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch installation queue
  const { data: installations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['installation-queue', searchTerm, filterStatus, filterPriority, filterTechnician, filterStore, sortBy, sortOrder],
    queryFn: () => installationService.getInstallationQueue({
      search: searchTerm,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      priority: filterPriority !== 'all' ? filterPriority : undefined,
      technicianId: filterTechnician !== 'all' ? filterTechnician : undefined,
      storeId: filterStore !== 'all' ? filterStore : undefined,
      sortBy,
      sortOrder
    }),
  });

  // Fetch technicians for filter
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: () => employeeService.getEmployees({ role: 'Technician' }),
  });

  // Fetch stores for filter
  const { data: stores = [] } = useQuery({
    queryKey: ['stores'],
    queryFn: storeService.getStores,
  });

  // Update installation status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }) => 
      installationService.updateInstallationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['installation-queue']);
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi khi cập nhật trạng thái: ' + error.message);
    },
  });

  // Assign installation mutation
  const assignInstallationMutation = useMutation({
    mutationFn: ({ id, technicianId }) => 
      installationService.assignInstallation(id, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries(['installation-queue']);
      toast.success('Phân công thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi khi phân công: ' + error.message);
    },
  });

  // Delete installation mutation
  const deleteInstallationMutation = useMutation({
    mutationFn: (id) => installationService.deleteInstallation(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['installation-queue']);
      toast.success('Xóa lắp đặt thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi khi xóa: ' + error.message);
    },
  });

  // Handle status update
  const handleStatusUpdate = (id, status, notes = '') => {
    updateStatusMutation.mutate({ id, status, notes });
  };

  // Handle assignment
  const handleAssign = (id, technicianId) => {
    assignInstallationMutation.mutate({ id, technicianId });
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lắp đặt này?')) {
      deleteInstallationMutation.mutate(id);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedInstallations.length === 0) {
      toast.error('Vui lòng chọn ít nhất một lắp đặt');
      return;
    }

    switch (action) {
      case 'assign':
        // Handle bulk assign
        break;
      case 'delete':
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedInstallations.length} lắp đặt?`)) {
          selectedInstallations.forEach(id => {
            deleteInstallationMutation.mutate(id);
          });
        }
        break;
      default:
        break;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'in_progress': { color: 'bg-blue-100 text-blue-800', icon: Play },
      'paused': { color: 'bg-orange-100 text-orange-800', icon: Pause },
      'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status === 'pending' && 'Chờ xử lý'}
        {status === 'in_progress' && 'Đang thực hiện'}
        {status === 'paused' && 'Tạm dừng'}
        {status === 'completed' && 'Hoàn thành'}
        {status === 'cancelled' && 'Đã hủy'}
      </Badge>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { color: 'bg-gray-100 text-gray-800', text: 'Thấp' },
      'medium': { color: 'bg-yellow-100 text-yellow-800', text: 'Trung bình' },
      'high': { color: 'bg-orange-100 text-orange-800', text: 'Cao' },
      'urgent': { color: 'bg-red-100 text-red-800', text: 'Khẩn cấp' },
    };

    const config = priorityConfig[priority] || priorityConfig['medium'];

    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  // Calculate estimated time
  const getEstimatedTime = (installation) => {
    const startTime = new Date(installation.scheduledStartTime);
    const endTime = new Date(installation.scheduledEndTime);
    const duration = Math.round((endTime - startTime) / (1000 * 60)); // minutes
    
    if (duration < 60) {
      return `${duration} phút`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}p`;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <AlertTriangle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Lỗi khi tải dữ liệu</h3>
        <p className="text-red-600 mb-4">Không thể kết nối đến máy chủ</p>
        <Button onClick={() => refetch()} className="bg-red-600 hover:bg-red-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hàng đợi lắp đặt</h1>
          <p className="text-gray-600">Quản lý và theo dõi các lắp đặt đang chờ xử lý</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
          <Button
            onClick={() => navigate('/installations/create')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tạo lắp đặt mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {installations.filter(i => i.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang thực hiện</p>
              <p className="text-2xl font-bold text-gray-900">
                {installations.filter(i => i.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hoàn thành hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">
                {installations.filter(i => 
                  i.status === 'completed' && 
                  new Date(i.completedAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khẩn cấp</p>
              <p className="text-2xl font-bold text-gray-900">
                {installations.filter(i => i.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm lắp đặt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </Button>

            {selectedInstallations.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkAction('assign')}
                  variant="outline"
                  size="sm"
                >
                  Phân công ({selectedInstallations.length})
                </Button>
                <Button
                  onClick={() => handleBulkAction('delete')}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  Xóa ({selectedInstallations.length})
                </Button>
              </div>
            )}

            <Button
              onClick={() => installationService.exportInstallations('excel', {
                search: searchTerm,
                status: filterStatus,
                priority: filterPriority,
                technicianId: filterTechnician,
                storeId: filterStore
              })}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="in_progress">Đang thực hiện</option>
                  <option value="paused">Tạm dừng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ ưu tiên
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả độ ưu tiên</option>
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kỹ thuật viên
                </label>
                <select
                  value={filterTechnician}
                  onChange={(e) => setFilterTechnician(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả kỹ thuật viên</option>
                  {technicians.map(tech => (
                    <option key={tech.employeeID} value={tech.employeeID}>
                      {tech.firstName} {tech.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cửa hàng
                </label>
                <select
                  value={filterStore}
                  onChange={(e) => setFilterStore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả cửa hàng</option>
                  {stores.map(store => (
                    <option key={store.storeID} value={store.storeID}>
                      {store.storeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sắp xếp
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="priority-desc">Ưu tiên cao nhất</option>
                  <option value="priority-asc">Ưu tiên thấp nhất</option>
                  <option value="scheduledStartTime-asc">Thời gian sớm nhất</option>
                  <option value="scheduledStartTime-desc">Thời gian muộn nhất</option>
                  <option value="createdAt-desc">Mới nhất</option>
                  <option value="createdAt-asc">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Installations List */}
      <Card>
        {installations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lắp đặt nào</h3>
            <p className="text-gray-600">Hiện tại không có lắp đặt nào trong hàng đợi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInstallations(installations.map(i => i.installationID));
                        } else {
                          setSelectedInstallations([]);
                        }
                      }}
                      checked={selectedInstallations.length === installations.length}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin lắp đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ thuật viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {installations.map((installation) => (
                  <tr key={installation.installationID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedInstallations.includes(installation.installationID)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInstallations([...selectedInstallations, installation.installationID]);
                          } else {
                            setSelectedInstallations(selectedInstallations.filter(id => id !== installation.installationID));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Car className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {installation.order?.orderID || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {installation.vehicle?.brand} {installation.vehicle?.model}
                          </div>
                          <div className="flex items-center mt-1">
                            {getPriorityBadge(installation.priority)}
                            <span className="ml-2 text-xs text-gray-500">
                              {installation.service?.serviceName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {installation.customer?.firstName} {installation.customer?.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {installation.customer?.phoneNumber}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {installation.customer?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {installation.technician ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {installation.technician.firstName} {installation.technician.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {installation.technician.phoneNumber}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Chưa phân công</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(installation.scheduledStartTime).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(installation.scheduledStartTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(installation.scheduledEndTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Timer className="w-3 h-3 mr-1" />
                        {getEstimatedTime(installation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(installation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => navigate(`/installations/${installation.installationID}`)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => navigate(`/installations/${installation.installationID}/edit`)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(installation.installationID)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InstallationQueuePage;
