export const formatUtils = {
  // Format currency in Vietnamese Dong
  formatCurrency: (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Format number with thousand separators
  formatNumber: (num) => {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(num);
  },

  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    if (value === null || value === undefined) return 'N/A';
    return `${Number(value).toFixed(decimals)}%`;
  },

  // Format date
  formatDate: (date, options = {}) => {
    if (!date) return 'N/A';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    return new Date(date).toLocaleDateString('vi-VN', defaultOptions);
  },

  // Format datetime
  formatDateTime: (date, options = {}) => {
    if (!date) return 'N/A';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    return new Date(date).toLocaleString('vi-VN', defaultOptions);
  },

  // Format phone number
  formatPhoneNumber: (phone) => {
    if (!phone) return 'N/A';
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Format as XXX XXX XXXX or +84 XXX XXX XXX
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
    }
    return phone;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format order status
  formatOrderStatus: (status) => {
    const statusMap = {
      'pending': 'Chờ xử lý',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang xử lý',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy',
      'delivered': 'Đã giao',
      'paid': 'Đã thanh toán',
      'unpaid': 'Chưa thanh toán'
    };
    return statusMap[status?.toLowerCase()] || status || 'N/A';
  },

  // Format employee role
  formatRole: (role) => {
    const roleMap = {
      'admin': 'Quản trị viên',
      'manager': 'Quản lý',
      'sales': 'Nhân viên bán hàng',
      'technician': 'Kỹ thuật viên',
      'designer': 'Thiết kế viên',
      'customer': 'Khách hàng'
    };
    return roleMap[role?.toLowerCase()] || role || 'N/A';
  },

  // Prepare employee data for export
  prepareEmployeeDataForExport: (employees) => {
    return employees.map(emp => ({
      'Mã NV': emp.employeeID,
      'Họ tên': `${emp.firstName} ${emp.lastName}`,
      'Email': emp.email,
      'Điện thoại': formatUtils.formatPhoneNumber(emp.phoneNumber),
      'Địa chỉ': emp.address || '',
      'Vai trò': emp.roles?.map(r => r.roleName).join(', ') || '',
      'Cửa hàng': emp.storeName || '',
      'Trạng thái': emp.isActive ? 'Hoạt động' : 'Không hoạt động',
      'Ngày tạo': formatUtils.formatDate(emp.createdAt)
    }));
  },

  // Export to Excel (simplified CSV export)
  exportToExcel: (data, filename = 'export.xlsx', sheetName = 'Data') => {
    if (!data || data.length === 0) {
      throw new Error('Không có dữ liệu để xuất');
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        typeof row[header] === 'string' && row[header].includes(',') 
          ? `"${row[header]}"` 
          : row[header]
      ).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.xlsx', '.csv'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export to PDF (simplified print)
  exportToPDF: async (elementId, filename = 'export.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Không tìm thấy element để xuất PDF');
    }
    
    // Simple print solution - in a real app, you might use jsPDF or similar
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  },

  // Truncate text
  truncateText: (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Calculate performance score color
  getPerformanceColor: (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  },

  // Get status badge color
  getStatusBadgeColor: (status, isActive = true) => {
    if (!isActive) return 'bg-gray-100 text-gray-800';
    
    const colorMap = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    
    return colorMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }
};