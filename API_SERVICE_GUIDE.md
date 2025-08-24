# API Service Guide - DecalXe Frontend

## Tổng quan

API Service đã được tập trung hóa vào một file duy nhất `src/services/apiService.js` để dễ quản lý và bảo trì. Tất cả các API calls đều sử dụng BASE_URL từ `src/constants/api.js`.

## Cách sử dụng

### 1. Import toàn bộ API Service

```javascript
import apiService from '../services/apiService';

// Sử dụng
const orders = await apiService.orders.getAll();
const employees = await apiService.employees.getAll();
```

### 2. Import từng module riêng lẻ

```javascript
import { ordersAPI, employeesAPI, customersAPI } from '../services/apiService';

// Sử dụng
const orders = await ordersAPI.getAll();
const employees = await employeesAPI.getAll();
```

### 3. Import API constants

```javascript
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

// Sử dụng
console.log(API_BASE_URL); // https://decalxesequences-production.up.railway.app/api
```

## Các module API có sẵn

### Authentication
```javascript
apiService.auth.login(credentials)
apiService.auth.register(userData)
apiService.auth.refresh(refreshToken)
apiService.auth.logout()
apiService.auth.resetPassword(data)
```

### Employees
```javascript
apiService.employees.getAll(params)
apiService.employees.getById(id)
apiService.employees.create(employeeData)
apiService.employees.update(id, employeeData)
apiService.employees.delete(id)
apiService.employees.getWithAccount()
apiService.employees.updateStatus(id, isActive)
```

### Orders
```javascript
apiService.orders.getAll(params)
apiService.orders.getById(id)
apiService.orders.create(orderData)
apiService.orders.update(id, orderData)
apiService.orders.delete(id)
apiService.orders.createWithCustomer(orderData)
apiService.orders.createCustomer(customerData)
apiService.orders.assignEmployee(orderId, employeeId)
apiService.orders.unassignEmployee(orderId)
apiService.orders.getAssignedEmployee(orderId)
apiService.orders.updateStatus(id, status)
apiService.orders.getSalesStatistics(params)
apiService.orders.getTracking(orderId)
```

### Customers
```javascript
apiService.customers.getAll(params)
apiService.customers.getById(id)
apiService.customers.create(customerData)
apiService.customers.update(id, customerData)
apiService.customers.delete(id)
apiService.customers.search(searchTerm)
```

### Customer Vehicles
```javascript
apiService.customerVehicles.getAll(params)
apiService.customerVehicles.getById(id)
apiService.customerVehicles.create(vehicleData)
apiService.customerVehicles.update(id, vehicleData)
apiService.customerVehicles.delete(id)
apiService.customerVehicles.getByLicensePlate(licensePlate)
apiService.customerVehicles.getByCustomer(customerId)
apiService.customerVehicles.checkExists(id)
apiService.customerVehicles.checkLicensePlateExists(licensePlate)
apiService.customerVehicles.checkChassisExists(chassisNumber)
```

### Stores
```javascript
apiService.stores.getAll(params)
apiService.stores.getById(id)
apiService.stores.create(storeData)
apiService.stores.update(id, storeData)
apiService.stores.delete(id)
```

### Decal Services
```javascript
apiService.decalServices.getAll(params)
apiService.decalServices.getById(id)
apiService.decalServices.create(serviceData)
apiService.decalServices.update(id, serviceData)
apiService.decalServices.delete(id)
```

### Vehicle Brands & Models
```javascript
apiService.vehicleBrands.getAll(params)
apiService.vehicleBrands.getById(id)
apiService.vehicleBrands.create(brandData)
apiService.vehicleBrands.update(id, brandData)
apiService.vehicleBrands.delete(id)

apiService.vehicleModels.getAll(params)
apiService.vehicleModels.getById(id)
apiService.vehicleModels.create(modelData)
apiService.vehicleModels.update(id, modelData)
apiService.vehicleModels.delete(id)
apiService.vehicleModels.getDecalTypes(modelId)
apiService.vehicleModels.getDecalType(modelId, decalTypeId)
apiService.vehicleModels.getTemplates(modelId)
```

## Ví dụ sử dụng trong component

### Orders List Component
```javascript
import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/apiService';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getAll({ page: 1, pageSize: 10 });
        setOrders(response.data.items);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.orderID}>{order.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Customer Search Component
```javascript
import React, { useState } from 'react';
import { customersAPI } from '../services/apiService';

const CustomerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await customersAPI.search(searchTerm);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error searching customers:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Tìm kiếm khách hàng..."
      />
      <button onClick={handleSearch}>Tìm kiếm</button>
      
      <ul>
        {customers.map(customer => (
          <li key={customer.customerID}>
            {customer.firstName} {customer.lastName} - {customer.phoneNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Lợi ích của việc tập trung hóa API

1. **Dễ quản lý**: Tất cả API calls ở một nơi
2. **Dễ bảo trì**: Chỉ cần cập nhật BASE_URL ở một file
3. **Tính nhất quán**: Tất cả API calls đều có cùng cấu hình
4. **Tự động refresh token**: Xử lý tự động khi token hết hạn
5. **Error handling**: Xử lý lỗi tập trung
6. **Logging**: Log tất cả requests/responses

## Migration từ API cũ

### Trước đây:
```javascript
import axios from 'axios';
const API_BASE_URL = 'https://decalxeapi-production.up.railway.app/api';

const response = await axios.get(`${API_BASE_URL}/Orders`);
```

### Bây giờ:
```javascript
import { ordersAPI } from '../services/apiService';

const response = await ordersAPI.getAll();
```

## Cấu hình

### Thay đổi BASE_URL
Chỉ cần cập nhật file `src/constants/api.js`:

```javascript
export const API_BASE_URL = 'https://your-new-api-url.com/api';
```

### Thêm endpoint mới
1. Thêm vào `src/constants/api.js`:
```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  NEW_MODULE: {
    BASE: '/NewModule',
    BY_ID: (id) => `/NewModule/${id}`,
  },
};
```

2. Thêm vào `src/services/apiService.js`:
```javascript
newModule = {
  getAll: (params = {}) => apiClient.get(API_ENDPOINTS.NEW_MODULE.BASE, { params }),
  getById: (id) => apiClient.get(API_ENDPOINTS.NEW_MODULE.BY_ID(id)),
  create: (data) => apiClient.post(API_ENDPOINTS.NEW_MODULE.BASE, data),
  update: (id, data) => apiClient.put(API_ENDPOINTS.NEW_MODULE.BY_ID(id), data),
  delete: (id) => apiClient.delete(API_ENDPOINTS.NEW_MODULE.BY_ID(id)),
};
```

## Troubleshooting

### Lỗi CORS
- Kiểm tra BASE_URL có đúng không
- Đảm bảo API server cho phép CORS từ domain của frontend

### Lỗi Authentication
- Kiểm tra token có được lưu đúng không
- Kiểm tra refresh token có hoạt động không

### Lỗi Network
- Kiểm tra kết nối internet
- Kiểm tra API server có hoạt động không
