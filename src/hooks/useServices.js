import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../services/serviceService';

// Hook để lấy danh sách tất cả dịch vụ
export const useServices = (params = {}) => {
    return useQuery({
        queryKey: ['services', params],
        queryFn: () => serviceService.getServices(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook để lấy thông tin dịch vụ theo ID
export const useService = (serviceId) => {
    return useQuery({
        queryKey: ['services', serviceId],
        queryFn: () => serviceService.getServiceById(serviceId),
        enabled: !!serviceId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

// Hook để lấy thống kê dịch vụ
export const useServiceStats = (params = {}) => {
    return useQuery({
        queryKey: ['serviceStats', params],
        queryFn: () => serviceService.getServiceStats(params),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
