import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { Button, Input, Card, Badge, LoadingSpinner } from '../components/common';
import { customerService } from '../services/customers';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

const CustomerListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers(),
    staleTime: 1000 * 60 * 5,
  });

  const filteredCustomers = customers?.filter(customer => 
    searchTerm === '' || 
    customer.customerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
          <p className="text-gray-600">Danh sách tất cả khách hàng trong hệ thống</p>
        </div>
        <Link to="/customers/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm khách hàng mới
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.customerID} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.customerFullName}</h3>
                <p className="text-sm text-gray-500">{customer.customerID}</p>
              </div>
              <Badge variant="success" size="sm">
                {customer.accountRoleName}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{customer.phoneNumber}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{customer.address}</span>
              </div>
            </div>

            {/* Birth Date */}
            <div className="mb-4 text-sm">
              <span className="text-gray-600">Ngày sinh: </span>
              <span>
                {customer.dateOfBirth && !isNaN(new Date(customer.dateOfBirth).getTime()) 
                  ? format(new Date(customer.dateOfBirth), 'dd/MM/yyyy')
                  : 'Chưa cập nhật'
                }
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Link to={`/customers/${customer.customerID}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                </Link>
                <Link to={`/customers/${customer.customerID}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                </Link>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê khách hàng</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</div>
            <div className="text-sm text-gray-600">Tổng khách hàng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredCustomers.filter(c => c.accountRoleName === 'Customer').length}
            </div>
            <div className="text-sm text-gray-600">Đã có tài khoản</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Đơn hàng mới</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">VIP</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerListPage;