import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class AnalyticsService {
  // Sales Analytics APIs
  async getSalesAnalytics(dateRange = {}) {
    try {
      const { startDate, endDate } = dateRange;
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const ordersResponse = await axios.get(`${API_BASE_URL}/orders?${params}`);
      const orders = ordersResponse.data;
      
      // Calculate sales metrics
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      // Group by date for trends
      const salesByDate = this.groupOrdersByDate(orders);
      
      // Group by status
      const ordersByStatus = this.groupOrdersByStatus(orders);
      
      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        salesByDate,
        ordersByStatus,
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
        const totalRevenue = employeeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const completedOrders = employeeOrders.filter(order => 
          order.orderStatus === 'Completed'
        ).length;
        
        const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
        
        return {
          ...employee,
          totalOrders,
          totalRevenue,
          completedOrders,
          completionRate,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
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
      
      const customerInsights = customers.map(customer => {
        const customerOrders = orders.filter(order => 
          order.vehicleID && customer.customerVehicles?.some(v => v.vehicleID === order.vehicleID)
        );
        
        const totalOrders = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const lastOrderDate = customerOrders.length > 0 
          ? Math.max(...customerOrders.map(order => new Date(order.orderDate).getTime()))
          : null;
        
        return {
          ...customer,
          totalOrders,
          totalSpent,
          averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
          lastOrderDate: lastOrderDate ? new Date(lastOrderDate) : null,
          customerLifetimeValue: totalSpent
        };
      });
      
      // Sort by total spent (highest value customers first)
      customerInsights.sort((a, b) => b.totalSpent - a.totalSpent);
      
      return {
        topCustomers: customerInsights.slice(0, 10),
        customerSegments: this.segmentCustomers(customerInsights),
        totalCustomers: customers.length,
        activeCustomers: customerInsights.filter(c => c.totalOrders > 0).length,
        averageCustomerValue: customerInsights.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length
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
        processingTimes
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
      grouped[date].revenue += order.totalAmount;
    });
    
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  groupOrdersByStatus(orders) {
    const grouped = {};
    orders.forEach(order => {
      const status = order.orderStatus;
      if (!grouped[status]) {
        grouped[status] = {
          status,
          count: 0,
          revenue: 0
        };
      }
      grouped[status].count += 1;
      grouped[status].revenue += order.totalAmount;
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

  segmentCustomers(customers) {
    const segments = {
      'High Value': customers.filter(c => c.totalSpent > 10000000), // > 10M VND
      'Medium Value': customers.filter(c => c.totalSpent > 3000000 && c.totalSpent <= 10000000), // 3-10M VND
      'Low Value': customers.filter(c => c.totalSpent > 0 && c.totalSpent <= 3000000), // 0-3M VND
      'Inactive': customers.filter(c => c.totalSpent === 0)
    };
    
    return Object.entries(segments).map(([segment, customerList]) => ({
      segment,
      count: customerList.length,
      totalValue: customerList.reduce((sum, c) => sum + c.totalSpent, 0),
      averageValue: customerList.length > 0 ? 
        customerList.reduce((sum, c) => sum + c.totalSpent, 0) / customerList.length : 0
    }));
  }
}

export default new AnalyticsService();