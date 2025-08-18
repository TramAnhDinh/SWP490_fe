import React from 'react';
import { Card } from '../common';
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  UserPlus
} from 'lucide-react';

const OrderStats = ({ orders = [] }) => {
  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const completedOrders = orders.filter(order => order.orderStatus === 'Completed').length;
  const pendingOrders = orders.filter(order => order.orderStatus === 'New' || order.orderStatus === 'In Progress').length;
  
  // Customer statistics
  const uniqueCustomers = new Set(orders.map(order => order.customerID).filter(Boolean)).size;
  const customersWithAccounts = orders.filter(order => order.accountCreated).length;
  const newCustomers = orders.filter(order => 
    order.customerID && 
    new Date(order.orderDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
  ).length;

  const stats = [
    {
      title: 'Tổng đơn hàng',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Tổng doanh thu',
      value: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Đơn hoàn thành',
      value: completedOrders,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Đơn đang xử lý',
      value: pendingOrders,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Khách hàng',
      value: uniqueCustomers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Khách hàng mới (30 ngày)',
      value: newCustomers,
      icon: UserPlus,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrderStats;