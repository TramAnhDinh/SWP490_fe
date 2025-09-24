import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Package,
    Filter,
    MoreVertical,
    AlertTriangle
} from 'lucide-react';
import { decalTypeService } from '../../services/decalTypeService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const DecalTypeListPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDecalType, setSelectedDecalType] = useState(null);

    // Get decal types data
    const { data: decalTypes = [], isLoading, error } = useQuery({
        queryKey: ['decalTypes', searchTerm],
        queryFn: () => decalTypeService.getDecalTypes(),
    });

    // Delete decal type mutation
    const deleteMutation = useMutation({
        mutationFn: decalTypeService.deleteDecalType,
        onSuccess: () => {
            toast.success('Đã xóa loại decal thành công!');
            queryClient.invalidateQueries(['decalTypes']);
            setShowDeleteModal(false);
            setSelectedDecalType(null);
        },
        onError: (error) => {
            console.error('Delete decal type error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa loại decal';
            toast.error('Lỗi khi xóa loại decal: ' + errorMessage);
        },
    });

    // Filter decal types based on search term
    const filteredDecalTypes = decalTypes.filter(decalType =>
        decalType.decalTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        decalType.material?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (decalType) => {
        setSelectedDecalType(decalType);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedDecalType) {
            deleteMutation.mutate(selectedDecalType.decalTypeID);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h2>
                    <p className="text-gray-600 mb-4">{error.message}</p>
                    <Button onClick={() => window.location.reload()}>
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Loại Decal</h1>
                    <p className="text-gray-600">Quản lý các loại decal và thông số kỹ thuật</p>
                </div>
                <Button
                    onClick={() => navigate('/decal-types/add')}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Thêm loại decal
                </Button>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Tìm kiếm theo tên loại decal, vật liệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={Search}
                        />
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tổng loại decal</p>
                            <p className="text-xl font-semibold">{decalTypes.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Có kích thước</p>
                            <p className="text-xl font-semibold">
                                {decalTypes.filter(dt => dt.width && dt.height).length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Có vật liệu</p>
                            <p className="text-xl font-semibold">
                                {decalTypes.filter(dt => dt.material).length}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Kết quả tìm kiếm</p>
                            <p className="text-xl font-semibold">{filteredDecalTypes.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Decal Types Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Loại Decal
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vật liệu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDecalTypes.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-lg font-medium">Không tìm thấy loại decal nào</p>
                                        <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc thêm loại decal mới</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredDecalTypes.map((decalType) => (
                                    <tr key={decalType.decalTypeID} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {decalType.decalTypeName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {decalType.decalTypeID}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {decalType.material ? (
                                                <Badge variant="secondary">{decalType.material}</Badge>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/decal-types/${decalType.decalTypeID}`)}
                                                    className="p-2"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/decal-types/edit/${decalType.decalTypeID}`)}
                                                    className="p-2"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(decalType)}
                                                    className="p-2 text-red-600 hover:text-red-700"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Xác nhận xóa"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Bạn có chắc chắn muốn xóa loại decal <strong>{selectedDecalType?.decalTypeName}</strong>?
                    </p>
                    <p className="text-sm text-red-600">
                        Hành động này không thể hoàn tác và có thể ảnh hưởng đến các mẫu decal liên quan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={deleteMutation.isPending}
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

export default DecalTypeListPage;
