import { orderService } from './orders';
import { customerService } from './customers';
import { storeService } from './storeService';
import { employeeService } from './employeeService';

export const dashboardStatsService = {
    // Lấy tất cả dữ liệu thống kê cho dashboard
    getDashboardStats: async (params = {}) => {
        try {
            // Lấy tất cả dữ liệu cần thiết
            const [orders, customers, stores, employees] = await Promise.all([
                orderService.getOrders(params),
                customerService.getCustomers(params),
                storeService.getStores(params),
                employeeService.getEmployees(params)
            ]);

            // Tính toán các metrics
            const stats = {
                // Tổng đơn hàng - đếm tất cả đơn hàng
                totalOrders: orders?.length || 0,

                // Tổng khách hàng - đếm số lượng khách hàng
                totalCustomers: customers?.length || 0,

                // Tổng cửa hàng
                totalStores: stores?.length || 0,

                // Tổng nhân viên
                totalEmployees: employees?.length || 0,

                // Tổng doanh thu - chỉ tính từ đơn hàng có currentStage = "AcceptanceAndDelivery"
                totalRevenue: calculateRevenueFromCompletedOrders(orders),

                // Giá trị đơn hàng trung bình
                averageOrderValue: calculateAverageOrderValue(orders),

                // Thống kê theo trạng thái đơn hàng
                ordersByStatus: groupOrdersByStatus(orders),

                // Thống kê theo giai đoạn
                ordersByStage: groupOrdersByStage(orders),

                // Dữ liệu thô để sử dụng cho các tính toán khác
                rawData: {
                    orders,
                    customers,
                    stores,
                    employees
                }
            };

            return stats;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    // Lấy thống kê đơn hàng
    getOrderStats: async (params = {}) => {
        try {
            const orders = await orderService.getOrders(params);

            return {
                totalOrders: orders?.length || 0,
                totalRevenue: calculateRevenueFromCompletedOrders(orders),
                averageOrderValue: calculateAverageOrderValue(orders),
                ordersByStatus: groupOrdersByStatus(orders),
                ordersByStage: groupOrdersByStage(orders)
            };
        } catch (error) {
            console.error('Error fetching order stats:', error);
            throw error;
        }
    },

    // Lấy thống kê doanh thu
    getRevenueStats: async (params = {}) => {
        try {
            const orders = await orderService.getOrders(params);

            return {
                totalRevenue: calculateRevenueFromCompletedOrders(orders),
                averageOrderValue: calculateAverageOrderValue(orders),
                revenueByStage: calculateRevenueByStage(orders)
            };
        } catch (error) {
            console.error('Error fetching revenue stats:', error);
            throw error;
        }
    },

    // Lấy thống kê khách hàng
    getCustomerStats: async (params = {}) => {
        try {
            const customers = await customerService.getCustomers(params);

            return {
                totalCustomers: customers?.length || 0,
                customersByStatus: groupCustomersByStatus(customers)
            };
        } catch (error) {
            console.error('Error fetching customer stats:', error);
            throw error;
        }
    }
};

// Helper functions

// Tính tổng doanh thu từ đơn hàng có currentStage = "AcceptanceAndDelivery"
function calculateRevenueFromCompletedOrders(orders) {
    if (!orders || !Array.isArray(orders)) return 0;

    return orders
        .filter(order => order.currentStage === 'AcceptanceAndDelivery')
        .reduce((total, order) => {
            return total + (order.totalAmount || 0);
        }, 0);
}

// Tính giá trị đơn hàng trung bình
function calculateAverageOrderValue(orders) {
    if (!orders || !Array.isArray(orders) || orders.length === 0) return 0;

    const totalRevenue = orders.reduce((total, order) => {
        return total + (order.totalAmount || 0);
    }, 0);

    return totalRevenue / orders.length;
}

// Nhóm đơn hàng theo trạng thái
function groupOrdersByStatus(orders) {
    if (!orders || !Array.isArray(orders)) return {};

    return orders.reduce((groups, order) => {
        const status = order.orderStatus || 'Unknown';
        groups[status] = (groups[status] || 0) + 1;
        return groups;
    }, {});
}

// Nhóm đơn hàng theo giai đoạn (currentStage)
function groupOrdersByStage(orders) {
    if (!orders || !Array.isArray(orders)) return {};

    return orders.reduce((groups, order) => {
        const stage = order.currentStage || 'Unknown';
        groups[stage] = (groups[stage] || 0) + 1;
        return groups;
    }, {});
}

// Tính doanh thu theo từng giai đoạn
function calculateRevenueByStage(orders) {
    if (!orders || !Array.isArray(orders)) return {};

    return orders.reduce((groups, order) => {
        const stage = order.currentStage || 'Unknown';
        const amount = order.totalAmount || 0;
        groups[stage] = (groups[stage] || 0) + amount;
        return groups;
    }, {});
}

// Nhóm khách hàng theo trạng thái (nếu có)
function groupCustomersByStatus(customers) {
    if (!customers || !Array.isArray(customers)) return {};

    return customers.reduce((groups, customer) => {
        const status = customer.status || 'Active';
        groups[status] = (groups[status] || 0) + 1;
        return groups;
    }, {});
}
