import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

// Utility functions for exporting data
export const exportUtils = {
  // Export to PDF
  async exportToPDF(elementId, filename = 'report.pdf', options = {}) {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id '${elementId}' not found`);
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        ...options.canvasOptions
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  },

  // Export to Excel
  exportToExcel(data, filename = 'report.xlsx', sheetName = 'Sheet1') {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, filename);
      
      return true;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  },

  // Export multiple sheets to Excel
  exportMultiSheetExcel(sheetsData, filename = 'report.xlsx') {
    try {
      const workbook = XLSX.utils.book_new();
      
      sheetsData.forEach(({ data, sheetName }) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
      
      XLSX.writeFile(workbook, filename);
      return true;
    } catch (error) {
      console.error('Error exporting multi-sheet Excel:', error);
      throw error;
    }
  },

  // Format currency for Vietnam
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },

  // Format date for Vietnam
  formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },

  // Format percentage
  formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  },

  // Prepare sales data for export
  prepareSalesDataForExport(salesData) {
    return salesData.rawData?.map(order => ({
      'Mã đơn hàng': order.orderID,
      'Ngày đặt hàng': this.formatDate(order.orderDate),
      'Tổng tiền': order.totalAmount,
      'Trạng thái': order.orderStatus,
      'Nhân viên phụ trách': order.assignedEmployeeFullName || 'Chưa phân công',
      'Xe': `${order.vehicleBrandName || ''} ${order.vehicleModelName || ''}`.trim(),
      'Số khung': order.chassisNumber || '',
      'Giai đoạn hiện tại': order.currentStage,
      'Thời gian dự kiến': order.expectedArrivalTime ? this.formatDate(order.expectedArrivalTime) : '',
      'Độ ưu tiên': order.priority || 'Bình thường',
      'Decal tùy chỉnh': order.isCustomDecal ? 'Có' : 'Không'
    })) || [];
  },

  // Prepare employee performance data for export
  prepareEmployeeDataForExport(employeeData) {
    return employeeData.map(employee => ({
      'Mã nhân viên': employee.employeeID,
      'Họ tên': `${employee.firstName} ${employee.lastName}`,
      'Email': employee.email || '',
      'Số điện thoại': employee.phoneNumber || '',
      'Cửa hàng': employee.storeName,
      'Vai trò': employee.accountRoleName || '',
      'Tổng đơn hàng': employee.totalOrders,
      'Đơn hoàn thành': employee.completedOrders,
      'Tỷ lệ hoàn thành': this.formatPercentage(employee.completionRate),
      'Tổng doanh thu': this.formatCurrency(employee.totalRevenue),
      'Giá trị đơn trung bình': this.formatCurrency(employee.averageOrderValue),
      'Trạng thái': employee.isActive ? 'Hoạt động' : 'Không hoạt động'
    }));
  },

  // Prepare customer insights data for export
  prepareCustomerDataForExport(customerData) {
    return customerData.topCustomers?.map(customer => ({
      'Mã khách hàng': customer.customerID,
      'Họ tên': `${customer.firstName} ${customer.lastName}`,
      'Email': customer.email || '',
      'Số điện thoại': customer.phoneNumber || '',
      'Địa chỉ': customer.address || '',
      'Tổng đơn hàng': customer.totalOrders,
      'Tổng chi tiêu': this.formatCurrency(customer.totalSpent),
      'Giá trị đơn trung bình': this.formatCurrency(customer.averageOrderValue),
      'Đơn hàng cuối': customer.lastOrderDate ? this.formatDate(customer.lastOrderDate) : 'Chưa có',
      'Giá trị khách hàng': this.formatCurrency(customer.customerLifetimeValue)
    })) || [];
  },

  // Send email notification (mock implementation)
  async sendEmailNotification(emailData) {
    try {
      // This would integrate with your email service
      console.log('Sending email notification:', emailData);
      
      // Mock API call
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  // Send SMS notification (mock implementation)
  async sendSMSNotification(smsData) {
    try {
      // This would integrate with your SMS service
      console.log('Sending SMS notification:', smsData);
      
      // Mock API call
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  },

  // Generate print-friendly CSS
  generatePrintCSS() {
    return `
      @media print {
        body * {
          visibility: hidden;
        }
        
        .print-area, .print-area * {
          visibility: visible;
        }
        
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        
        .no-print {
          display: none !important;
        }
        
        .print-break {
          page-break-before: always;
        }
        
        .print-avoid-break {
          page-break-inside: avoid;
        }
        
        table {
          border-collapse: collapse;
          width: 100%;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        
        .chart-container {
          max-width: 100%;
          height: auto;
        }
      }
    `;
  },

  // Apply print styles
  applyPrintStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = this.generatePrintCSS();
    document.head.appendChild(styleElement);
    return styleElement;
  },

  // Remove print styles
  removePrintStyles(styleElement) {
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  }
};