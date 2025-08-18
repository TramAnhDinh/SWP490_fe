import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../services/employeeService';

// Hook để lấy tất cả employees
export const useEmployees = (params = {}) => {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeService.getEmployees(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook để lấy technicians (employees có role là Technician)
export const useTechnicians = () => {
  return useQuery({
    queryKey: ['employees', 'technicians'],
    queryFn: async () => {
      // Tạm thời lấy tất cả employees và filter ở client-side
      // vì backend chưa được cập nhật
      const allEmployees = await employeeService.getEmployees();
      return allEmployees.filter(emp => emp.accountRoleName === 'Technician');
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Hook để lấy employee theo ID
export const useEmployee = (id) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};