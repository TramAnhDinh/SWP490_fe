import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    Building,
    MapPin,
    ArrowLeft,
    Save,
    Hash
} from 'lucide-react';
import { storeService } from '../../services/storeService';

const AddStorePage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        storeID: '',
        storeName: '',
        address: ''
    });

    // Create store mutation
    const createStoreMutation = useMutation({
        mutationFn: storeService.createStore,
        onSuccess: () => {
            toast.success('Cửa hàng đã được tạo thành công!');
            queryClient.invalidateQueries(['stores']);
            navigate('/stores');
        },
        onError: (error) => {
            toast.error('Lỗi khi tạo cửa hàng: ' + (error.response?.data?.message || error.message));
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.storeID.trim()) {
            toast.error('Vui lòng nhập mã số cửa hàng!');
            return;
        }

        if (!formData.storeName.trim()) {
            toast.error('Vui lòng nhập tên cửa hàng!');
            return;
        }

        if (!formData.address.trim()) {
            toast.error('Vui lòng nhập địa chỉ cửa hàng!');
            return;
        }

        try {
            const storeData = {
                StoreID: formData.storeID,
                StoreName: formData.storeName,
                Address: formData.address
            };

            await createStoreMutation.mutateAsync(storeData);
        } catch (error) {
            // Error đã được xử lý trong onError của mutation
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/stores')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>
            </div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Thêm cửa hàng mới</h1>
                <p className="text-gray-600 mt-1">Tạo cửa hàng mới trong hệ thống</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        Thông tin cửa hàng
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã số cửa hàng <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="storeID"
                                    value={formData.storeID}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="VD: STORE001"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên cửa hàng <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tên cửa hàng"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Địa chỉ <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập địa chỉ đầy đủ"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/stores')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={createStoreMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {createStoreMutation.isPending ? 'Đang tạo...' : 'Tạo cửa hàng'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStorePage;
