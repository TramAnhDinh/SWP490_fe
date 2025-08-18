import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orders';
import { toast } from 'react-hot-toast';

export const useOrders = (params = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getOrders(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      // Toast message will be handled in the component for better UX
    },
    onError: (error) => {
      toast.error(error.message || 'Tạo đơn hàng thất bại');
    },
  });
};

// New hook for creating orders with customer information
export const useCreateOrderWithCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.createOrderWithCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['customers']);
      // Toast message will be handled in the component for better UX
    },
    onError: (error) => {
      toast.error(error.message || 'Tạo đơn hàng với khách hàng thất bại');
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => orderService.updateOrder(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', variables.id]);
      toast.success('Cập nhật đơn hàng thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật đơn hàng thất bại');
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Xóa đơn hàng thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Xóa đơn hàng thất bại');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', variables.id]);
      toast.success('Cập nhật trạng thái thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật trạng thái thất bại');
    },
  });
};

export const useAssignEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, employeeId }) => orderService.assignEmployee(orderId, employeeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', variables.orderId]);
      toast.success('Phân công nhân viên thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Phân công nhân viên thất bại');
    },
  });
};

export const useUnassignEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderService.unassignEmployee,
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', orderId]);
      toast.success('Hủy phân công nhân viên thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Hủy phân công nhân viên thất bại');
    },
  });
};

export const useSalesStatistics = (startDate, endDate) => {
  return useQuery({
    queryKey: ['orders', 'statistics', startDate, endDate],
    queryFn: () => orderService.getSalesStatistics(startDate, endDate),
    enabled: !!(startDate && endDate),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useOrderCreateFormData = () => {
  return useQuery({
    queryKey: ['orders', 'create-form-data'],
    queryFn: orderService.getOrderCreateFormData,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useOrderTracking = (orderId, customerPhone, licensePlate) => {
  return useQuery({
    queryKey: ['orders', 'tracking', orderId, customerPhone, licensePlate],
    queryFn: () => orderService.trackOrder(orderId, customerPhone, licensePlate),
    enabled: !!(orderId || customerPhone || licensePlate),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};