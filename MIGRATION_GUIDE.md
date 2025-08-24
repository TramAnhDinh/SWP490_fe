# Migration Guide - Chuyển đổi sang API Service tập trung

## Tổng quan

Dự án đã được chuyển đổi từ việc sử dụng nhiều file API riêng lẻ sang một API Service tập trung duy nhất. Điều này giúp:

- **Dễ quản lý**: Tất cả API calls ở một nơi
- **Dễ bảo trì**: Chỉ cần cập nhật BASE_URL ở một file
- **Tính nhất quán**: Tất cả API calls đều có cùng cấu hình
- **Tự động refresh token**: Xử lý tự động khi token hết hạn

## Các file đã được thay đổi

### ✅ Đã cập nhật
- `src/constants/api.js` - Cập nhật BASE_URL mới
- `src/services/analytics/analyticsService.js` - Chuyển sang sử dụng apiService
- `test_orders_api.js` - Cập nhật BASE_URL
- `test_customer_api.js` - Cập nhật BASE_URL
- `test_frontend_customer.js` - Cập nhật BASE_URL

### ✅ Đã tạo mới
- `src/services/apiService.js` - API Service tập trung mới
- `API_SERVICE_GUIDE.md` - Hướng dẫn sử dụng API Service
- `MIGRATION_GUIDE.md` - File này

### ❌ Đã xóa
- `src/services/api.js` - File API cũ
- `src/services/apiClient.js` - File API client cũ

## Cách migration trong code

### 1. Thay đổi import

**Trước:**
```javascript
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

// Hoặc
import api from '../services/api';
```

**Sau:**
```javascript
import apiService from '../services/apiService';

// Hoặc import từng module
import { ordersAPI, employeesAPI } from '../services/apiService';
```

### 2. Thay đổi API calls

**Trước:**
```javascript
// Cách 1: Sử dụng axios trực tiếp
const response = await axios.get(`${API_BASE_URL}/Orders`);

// Cách 2: Sử dụng api service cũ
const response = await api.getOrders();
```

**Sau:**
```javascript
// Cách 1: Sử dụng apiService
const response = await apiService.orders.getAll();

// Cách 2: Sử dụng module riêng lẻ
const response = await ordersAPI.getAll();
```

### 3. Ví dụ migration cụ thể

#### Orders API
**Trước:**
```javascript
// Lấy danh sách orders
const ordersResponse = await fetch(`${API_BASE_URL}/Orders?page=1&pageSize=10`);

// Lấy order theo ID
const orderResponse = await fetch(`${API_BASE_URL}/Orders/${orderId}`);

// Tạo order mới
const createResponse = await fetch(`${API_BASE_URL}/Orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

**Sau:**
```javascript
// Lấy danh sách orders
const ordersResponse = await apiService.orders.getAll({ page: 1, pageSize: 10 });

// Lấy order theo ID
const orderResponse = await apiService.orders.getById(orderId);

// Tạo order mới
const createResponse = await apiService.orders.create(orderData);
```

#### Employees API
**Trước:**
```javascript
const employeesResponse = await axios.get(`${API_BASE_URL}/Employees`);
const employeeResponse = await axios.get(`${API_BASE_URL}/Employees/${employeeId}`);
```

**Sau:**
```javascript
const employeesResponse = await apiService.employees.getAll();
const employeeResponse = await apiService.employees.getById(employeeId);
```

#### Customers API
**Trước:**
```javascript
const searchResponse = await fetch(`${API_BASE_URL}/Orders/search-customers?searchTerm=${searchTerm}`);
```

**Sau:**
```javascript
const searchResponse = await apiService.customers.search(searchTerm);
```

## Các component cần migration

### 1. Tìm tất cả files sử dụng API cũ

```bash
# Tìm tất cả files có chứa API_BASE_URL
grep -r "API_BASE_URL" src/

# Tìm tất cả files có chứa axios.get
grep -r "axios.get" src/

# Tìm tất cả files có chứa fetch
grep -r "fetch(" src/
```

### 2. Migration từng component

#### OrdersListPage
**Trước:**
```javascript
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const fetchOrders = async () => {
  const response = await axios.get(`${API_BASE_URL}/Orders`);
  setOrders(response.data);
};
```

**Sau:**
```javascript
import { ordersAPI } from '../services/apiService';

const fetchOrders = async () => {
  const response = await ordersAPI.getAll();
  setOrders(response.data);
};
```

#### EmployeeListPage
**Trước:**
```javascript
import api from '../services/api';

const fetchEmployees = async () => {
  const response = await api.getEmployees();
  setEmployees(response.data);
};
```

**Sau:**
```javascript
import { employeesAPI } from '../services/apiService';

const fetchEmployees = async () => {
  const response = await employeesAPI.getAll();
  setEmployees(response.data);
};
```

## Lợi ích sau migration

### 1. Quản lý dễ dàng hơn
- Tất cả API calls ở một file duy nhất
- Dễ dàng tìm và sửa lỗi
- Cấu hình tập trung

### 2. Tính nhất quán
- Tất cả API calls đều có cùng cấu hình
- Error handling thống nhất
- Logging thống nhất

### 3. Tự động xử lý
- Tự động refresh token khi hết hạn
- Tự động thêm Authorization header
- Tự động redirect khi authentication fail

### 4. Performance
- Giảm bundle size (không cần import axios nhiều lần)
- Tối ưu hóa network requests
- Caching tự động

## Testing sau migration

### 1. Test API calls
```javascript
// Test connection
const testResponse = await apiService.testConnection();
console.log('API connection:', testResponse.status);

// Test orders API
const ordersResponse = await apiService.orders.getAll();
console.log('Orders count:', ordersResponse.data.length);

// Test employees API
const employeesResponse = await apiService.employees.getAll();
console.log('Employees count:', employeesResponse.data.length);
```

### 2. Test authentication
```javascript
// Test login
const loginResponse = await apiService.auth.login({
  username: 'test',
  password: 'test'
});
console.log('Login successful:', loginResponse.data);

// Test token refresh
const refreshResponse = await apiService.auth.refresh(refreshToken);
console.log('Token refreshed:', refreshResponse.data);
```

### 3. Test error handling
```javascript
try {
  await apiService.orders.getById('invalid-id');
} catch (error) {
  console.log('Error handled correctly:', error.response.status);
}
```

## Troubleshooting

### Lỗi thường gặp

#### 1. Import error
```
Module not found: Can't resolve '../services/api'
```
**Giải pháp:** Thay đổi import sang `../services/apiService`

#### 2. Method not found
```
apiService.orders.getOrders is not a function
```
**Giải pháp:** Sử dụng `apiService.orders.getAll()` thay vì `getOrders()`

#### 3. CORS error
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Giải pháp:** Kiểm tra BASE_URL có đúng không và API server có cho phép CORS

#### 4. Authentication error
```
401 Unauthorized
```
**Giải pháp:** Kiểm tra token có được lưu đúng không và refresh token có hoạt động không

### Debug tips

#### 1. Enable logging
```javascript
// Trong browser console
localStorage.setItem('debug', 'api:*');
```

#### 2. Check network tab
- Mở Developer Tools > Network tab
- Kiểm tra requests có được gửi đúng không
- Kiểm tra response status và data

#### 3. Check localStorage
```javascript
// Kiểm tra token
console.log('Access token:', localStorage.getItem('accessToken'));
console.log('Refresh token:', localStorage.getItem('refreshToken'));
```

## Kết luận

Migration sang API Service tập trung sẽ giúp dự án dễ quản lý và bảo trì hơn. Tất cả API calls đều được chuẩn hóa và có cùng cấu hình. Việc thay đổi BASE_URL trong tương lai cũng sẽ rất đơn giản, chỉ cần cập nhật một file duy nhất.

Hãy đảm bảo test kỹ tất cả các chức năng sau khi migration để đảm bảo không có lỗi nào xảy ra.
