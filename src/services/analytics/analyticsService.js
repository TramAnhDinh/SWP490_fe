import axios from 'axios';
import { API_ENDPOINTS } from '../../constants/api';

const API_BASE_URL = 'https://decalxeapi-production.up.railway.app/api';

class AnalyticsService {
  // Sales Analytics APIs
  async getSalesAnalytics(dateRange = {}) {
    try {
      const { startDate, endDate } = dateRange;
      const params = new URLSearchParams();

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      // Lấy dữ liệu đơn hàng
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders?${params}`);
      const orders = ordersResponse.data;

      // Lấy dữ liệu dịch vụ decal
      const servicesResponse = await axios.get(`${API_BASE_URL}/decalservices`);
      const services = servicesResponse.data;

      // Lấy dữ liệu cửa hàng
      const storesResponse = await axios.get(`${API_BASE_URL}/stores`);
      const stores = storesResponse.data;

      // Lấy dữ liệu nhân viên
      const employeesResponse = await axios.get(`${API_BASE_URL}/employees`);
      const employees = employeesResponse.data;

      // Calculate sales metrics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Group by date for trends
      const salesByDate = this.groupOrdersByDate(orders);

      // Group by status
      const ordersByStatus = this.groupOrdersByStatus(orders);

      // Group by service type
      const salesByService = this.groupSalesByService(orders, services);

      // Group by store
      const salesByStore = this.groupSalesByStore(orders, stores);

      // Group by employee
      const salesByEmployee = this.groupSalesByEmployee(orders, employees);

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        salesByDate,
        ordersByStatus,
        salesByService,
        salesByStore,
        salesByEmployee,
        rawData: orders
      };
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  // Employee Performance Analytics
  async getEmployeePerformance(employeeId = null) {
    try {
      const employeesResponse = await axios.get(`${API_BASE_URL}/employees`);
      const employees = employeesResponse.data;

      const ordersResponse = await axios.get(`${API_BASE_URL}/orders`);
      const orders = ordersResponse.data;

      const performanceData = employees.map(employee => {
        const employeeOrders = orders.filter(order =>
          order.assignedEmployeeID === employee.employeeID
        );

        const totalOrders = employeeOrders.length;
        const totalRevenue = employeeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const completedOrders = employeeOrders.filter(order =>
          order.orderStatus === 'Completed'
        ).length;

        const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

        // Tính thời gian hoàn thành trung bình
        const processingTimes = employeeOrders
          .filter(order => order.orderDate && order.expectedArrivalTime)
          .map(order => {
            const startDate = new Date(order.orderDate);
            const endDate = new Date(order.expectedArrivalTime);
            return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          });

        const averageProcessingTime = processingTimes.length > 0
          ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
          : 0;

        return {
          ...employee,
          totalOrders,
          totalRevenue,
          completedOrders,
          completionRate,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          averageProcessingTime,
          processingTimes
        };
      });

      return employeeId
        ? performanceData.find(emp => emp.employeeID === employeeId)
        : performanceData;
    } catch (error) {
      console.error('Error fetching employee performance:', error);
      throw error;
    }
  }

  // Customer Insights Analytics
  async getCustomerInsights() {
    try {
      const customersResponse = await axios.get(`${API_BASE_URL}/customers`);
      const customers = customersResponse.data;

      const ordersResponse = await axios.get(`${API_BASE_URL}/orders`);
      const orders = ordersResponse.data;

      const customerVehiclesResponse = await axios.get(`${API_BASE_URL}/customervehicles`);
      const customerVehicles = customerVehiclesResponse.data;

      const customerInsights = customers.map(customer => {
        // Tìm xe của khách hàng
        const customerCars = customerVehicles.filter(cv => cv.customerID === customer.customerID);

        // Tìm đơn hàng của khách hàng
        const customerOrders = orders.filter(order =>
          customerCars.some(car => car.vehicleID === order.vehicleID)
        );

        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const lastOrderDate = customerOrders.length > 0
          ? Math.max(...customerOrders.map(order => new Date(order.orderDate).getTime()))
          : null;

        // Tính tần suất mua hàng
        const purchaseFrequency = this.calculatePurchaseFrequency(customerOrders);

        return {
          ...customer,
          totalOrders,
          totalSpent,
          averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
          lastOrderDate: lastOrderDate ? new Date(lastOrderDate) : null,
          customerLifetimeValue: totalSpent,
          purchaseFrequency,
          vehicles: customerCars
        };
      });

      // Sort by total spent (highest value customers first)
      customerInsights.sort((a, b) => b.totalSpent - a.totalSpent);

      return {
        topCustomers: customerInsights.slice(0, 10),
        customerSegments: this.segmentCustomers(customerInsights),
        totalCustomers: customers.length,
        activeCustomers: customerInsights.filter(c => c.totalOrders > 0).length,
        averageCustomerValue: customerInsights.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
        customerInsights
      };
    } catch (error) {
      console.error('Error fetching customer insights:', error);
      throw error;
    }
  }

  // Operational Reports
  async getOperationalMetrics() {
    try {
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders`);
      const orders = ordersResponse.data;

      const employeesResponse = await axios.get(`${API_BASE_URL}/employees`);
      const employees = employeesResponse.data;

      const storesResponse = await axios.get(`${API_BASE_URL}/stores`);
      const stores = storesResponse.data;

      const servicesResponse = await axios.get(`${API_BASE_URL}/decalservices`);
      const services = servicesResponse.data;

      // Order processing times
      const processingTimes = orders.map(order => {
        const orderDate = new Date(order.orderDate);
        const expectedArrival = order.expectedArrivalTime ? new Date(order.expectedArrivalTime) : null;

        return {
          orderId: order.orderID,
          orderDate,
          expectedArrival,
          status: order.orderStatus,
          currentStage: order.currentStage,
          processingDays: expectedArrival ?
            Math.ceil((expectedArrival - orderDate) / (1000 * 60 * 60 * 24)) : null
        };
      });

      // Efficiency metrics
      const completedOrders = orders.filter(order => order.orderStatus === 'Completed');
      const pendingOrders = orders.filter(order => order.orderStatus === 'Pending');
      const inProgressOrders = orders.filter(order => order.orderStatus === 'InProgress');

      const averageProcessingTime = processingTimes
        .filter(pt => pt.processingDays !== null)
        .reduce((sum, pt) => sum + pt.processingDays, 0) /
        processingTimes.filter(pt => pt.processingDays !== null).length || 0;

      // Store performance
      const storePerformance = stores.map(store => {
        const storeOrders = orders.filter(order => order.storeID === store.storeID);
        const storeRevenue = storeOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const storeCompletedOrders = storeOrders.filter(order => order.orderStatus === 'Completed').length;

        return {
          ...store,
          totalOrders: storeOrders.length,
          totalRevenue: storeRevenue,
          completedOrders: storeCompletedOrders,
          completionRate: storeOrders.length > 0 ? (storeCompletedOrders / storeOrders.length) * 100 : 0
        };
      });

      // Service consumption
      const serviceConsumption = this.calculateServiceConsumption(orders, services);

      return {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        pendingOrders: pendingOrders.length,
        inProgressOrders: inProgressOrders.length,
        completionRate: orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0,
        averageProcessingTime,
        activeEmployees: employees.filter(emp => emp.isActive).length,
        totalEmployees: employees.length,
        ordersByStage: this.groupOrdersByStage(orders),
        processingTimes,
        storePerformance,
        serviceConsumption
      };
    } catch (error) {
      console.error('Error fetching operational metrics:', error);
      throw error;
    }
  }

  // Helper methods
  groupOrdersByDate(orders) {
    const grouped = {};
    orders.forEach(order => {
      const date = new Date(order.orderDate).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = {
          date,
          orders: 0,
          revenue: 0
        };
      }
      grouped[date].orders += 1;
      grouped[date].revenue += (order.totalAmount || 0);
    });

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  groupOrdersByStatus(orders) {
    const grouped = {};
    orders.forEach(order => {
      const status = order.orderStatus || 'Unknown';
      if (!grouped[status]) {
        grouped[status] = {
          status,
          count: 0,
          revenue: 0
        };
      }
      grouped[status].count += 1;
      grouped[status].revenue += (order.totalAmount || 0);
    });

    return Object.values(grouped);
  }

  groupOrdersByStage(orders) {
    const grouped = {};
    orders.forEach(order => {
      const stage = order.currentStage || 'Unknown';
      if (!grouped[stage]) {
        grouped[stage] = {
          stage,
          count: 0
        };
      }
      grouped[stage].count += 1;
    });

    return Object.values(grouped);
  }

  groupSalesByService(orders, services) {
    const grouped = {};
    services.forEach(service => {
      grouped[service.serviceID] = {
        serviceID: service.serviceID,
        serviceName: service.serviceName,
        count: 0,
        revenue: 0
      };
    });

    orders.forEach(order => {
      // Giả sử order có serviceID hoặc có thể tính từ orderDetails
      if (order.serviceID && grouped[order.serviceID]) {
        grouped[order.serviceID].count += 1;
        grouped[order.serviceID].revenue += (order.totalAmount || 0);
      }
    });

    return Object.values(grouped).filter(item => item.count > 0);
  }

  groupSalesByStore(orders, stores) {
    const grouped = {};
    stores.forEach(store => {
      grouped[store.storeID] = {
        storeID: store.storeID,
        storeName: store.storeName,
        count: 0,
        revenue: 0
      };
    });

    orders.forEach(order => {
      if (order.storeID && grouped[order.storeID]) {
        grouped[order.storeID].count += 1;
        grouped[order.storeID].revenue += (order.totalAmount || 0);
      }
    });

    return Object.values(grouped).filter(item => item.count > 0);
  }

  groupSalesByEmployee(orders, employees) {
    const grouped = {};
    employees.forEach(employee => {
      grouped[employee.employeeID] = {
        employeeID: employee.employeeID,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        role: employee.role,
        count: 0,
        revenue: 0
      };
    });

    orders.forEach(order => {
      if (order.assignedEmployeeID && grouped[order.assignedEmployeeID]) {
        grouped[order.assignedEmployeeID].count += 1;
        grouped[order.assignedEmployeeID].revenue += (order.totalAmount || 0);
      }
    });

    return Object.values(grouped).filter(item => item.count > 0);
  }

  calculatePurchaseFrequency(orders) {
    if (orders.length < 2) return 'Khách mới';

    const sortedOrders = orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    const firstOrder = new Date(sortedOrders[0].orderDate);
    const lastOrder = new Date(sortedOrders[sortedOrders.length - 1].orderDate);
    const daysBetween = Math.ceil((lastOrder - firstOrder) / (1000 * 60 * 60 * 24));
    const averageDays = daysBetween / (orders.length - 1);

    if (averageDays <= 30) return 'Khách thường xuyên';
    if (averageDays <= 90) return 'Khách định kỳ';
    return 'Khách thỉnh thoảng';
  }

  segmentCustomers(customers) {
    const segments = {
      'VIP': customers.filter(c => c.totalSpent > 10000000), // > 10M VND
      'Khách hàng cao cấp': customers.filter(c => c.totalSpent > 3000000 && c.totalSpent <= 10000000), // 3-10M VND
      'Khách hàng trung bình': customers.filter(c => c.totalSpent > 500000 && c.totalSpent <= 3000000), // 0.5-3M VND
      'Khách hàng mới': customers.filter(c => c.totalSpent > 0 && c.totalSpent <= 500000), // 0-0.5M VND
      'Chưa mua hàng': customers.filter(c => c.totalSpent === 0)
    };

    return Object.entries(segments).map(([segment, customerList]) => ({
      segment,
      count: customerList.length,
      totalValue: customerList.reduce((sum, c) => sum + c.totalSpent, 0),
      averageValue: customerList.length > 0 ?
        customerList.reduce((sum, c) => sum + c.totalSpent, 0) / customerList.length : 0
    }));
  }

  calculateServiceConsumption(orders, services) {
    const consumption = {};
    services.forEach(service => {
      consumption[service.serviceID] = {
        serviceID: service.serviceID,
        serviceName: service.serviceName,
        count: 0,
        revenue: 0
      };
    });

    orders.forEach(order => {
      if (order.serviceID && consumption[order.serviceID]) {
        consumption[order.serviceID].count += 1;
        consumption[order.serviceID].revenue += (order.totalAmount || 0);
      }
    });

    return Object.values(consumption).filter(item => item.count > 0);
  }
}

export default new AnalyticsService();