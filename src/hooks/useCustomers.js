import { useMutation, useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customerService';

// Hook để tìm kiếm khách hàng
export const useSearchCustomers = () => {
  return useMutation({
    mutationFn: (searchTerm) => customerService.searchCustomers(searchTerm),
    onError: (error) => {
      console.error('Error searching customers:', error);
    },
  });
};

// Hook để tạo khách hàng mới
export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: (customerData) => customerService.createCustomer(customerData),
    onError: (error) => {
      console.error('Error creating customer:', error);
    },
  });
};

// Hook để lấy danh sách khách hàng
export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getCustomers(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook để lấy thông tin khách hàng theo ID
export const useCustomer = (customerId) => {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: () => customerService.getCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};