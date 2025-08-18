# Migration từ Mock Data sang Real API

## Tổng quan
Đã chuyển đổi toàn bộ ứng dụng từ sử dụng mock data sang API thực tế.

## Các thay đổi đã thực hiện

### 1. API Configuration
- **File**: `src/constants/api.js`
- **Thay đổi**: Cập nhật API_BASE_URL từ localhost sang production URL
- **Trước**: `https://localhost:7056/api`
- **Sau**: `https://decalxeapi-production.up.railway.app/api`

### 2. Order Service
- **File**: `src/services/orders.js`
- **Thay đổi**: 
  - Sửa request body format cho updateOrderStatus
  - Loại bỏ mock data functions
  - Thêm logging cho debugging

### 3. Hooks
- **File**: `src/hooks/useOrders.js`
- **Thay đổi**:
  - `useOrders`: Chuyển từ `getMockOrders()` sang `getOrders()`
  - `useOrder`: Chuyển từ mock data sang `getOrderById(id)`

### 4. Components

#### DashboardPage
- **File**: `src/pages/DashboardPage.jsx`
- **Thay đổi**:
  - Thêm useQuery để fetch orders và customers từ API
  - Tính toán stats từ dữ liệu thực tế
  - Thêm loading state
  - Hiển thị recent orders từ API data

#### CustomerListPage
- **File**: `src/pages/CustomerListPage.jsx`
- **Thay đổi**:
  - Chuyển từ `getMockCustomers()` sang `getCustomers()`

#### OrderDetailPage
- **File**: `src/pages/orders/OrderDetailPage.jsx`
- **Thay đổi**:
  - Loại bỏ mock stage history
  - Thêm TODO comment cho future implementation

#### LoginPage
- **File**: `src/pages/LoginPage.jsx`
- **Thay đổi**:
  - Chuyển từ mock login sang API login
  - Sử dụng authService.login() thực tế
  - Giữ lại demo credentials cho testing

#### Header
- **File**: `src/components/layout/Header.jsx`
- **Thay đổi**:
  - Loại bỏ mock notifications
  - Thêm TODO comment cho future implementation

### 5. Services Cleanup
- **File**: `src/services/customers.js`
- **Thay đổi**: Loại bỏ getMockCustomers function
- **File**: `src/services/orders.js`
- **Thay đổi**: Loại bỏ getMockOrders function

## API Endpoints được sử dụng

### Orders
- `GET /api/Orders` - Lấy danh sách đơn hàng
- `GET /api/Orders/{id}` - Lấy chi tiết đơn hàng
- `PUT /api/Orders/{id}/status` - Cập nhật trạng thái đơn hàng
- `POST /api/Orders` - Tạo đơn hàng mới
- `PUT /api/Orders/{id}` - Cập nhật đơn hàng
- `DELETE /api/Orders/{id}` - Xóa đơn hàng

### Customers
- `GET /api/Customers` - Lấy danh sách khách hàng
- `GET /api/Customers/{id}` - Lấy chi tiết khách hàng
- `POST /api/Customers` - Tạo khách hàng mới
- `PUT /api/Customers/{id}` - Cập nhật khách hàng
- `DELETE /api/Customers/{id}` - Xóa khách hàng

### Authentication
- `POST /api/Auth/login` - Đăng nhập
- `POST /api/Auth/register` - Đăng ký
- `POST /api/Auth/logout` - Đăng xuất
- `POST /api/Auth/reset-password` - Đặt lại mật khẩu

## Các tính năng còn TODO

1. **Notifications**: Cần implement API notifications
2. **Stage History**: Cần implement API cho order stage history
3. **Statistics**: Cần implement API cho sales statistics
4. **Employee Management**: Cần implement API cho employee assignment

## Testing

### Credentials cho Demo
- **Admin**: username: `admin`, password: `admin123`
- **Manager**: username: `manager`, password: `manager123`
- **Sales**: username: `sales`, password: `sales123`
- **Technician**: username: `tech`, password: `tech123`

### Test Cases
1. Đăng nhập với các role khác nhau
2. Xem danh sách đơn hàng
3. Xem chi tiết đơn hàng
4. Thay đổi trạng thái đơn hàng
5. Xem danh sách khách hàng
6. Dashboard hiển thị dữ liệu thực tế

## Lưu ý

- Tất cả API calls đều có error handling
- Loading states đã được implement
- Toast notifications cho success/error
- CORS đã được cấu hình đúng ở backend
- Authentication flow đã được implement đầy đủ