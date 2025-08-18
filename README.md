# DecalXe API Test - React Vite Tailwind

Ứng dụng React để test API DecalXe và kiểm tra CORS configuration.

## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

## 📋 Features

### ✅ Test Cases đầy đủ (24 APIs):

#### 🏢 Core Business (5 APIs):
- **Accounts API** - GET /api/accounts
- **Customers API** - GET /api/customers  
- **Employees API** - GET /api/employees
- **Roles API** - GET /api/roles
- **Stores API** - GET /api/stores

#### 🚗 Vehicle Management (3 APIs):
- **Vehicle Brands API** - GET /api/vehiclebrands
- **Vehicle Models API** - GET /api/vehiclemodels
- **Customer Vehicles API** - GET /api/customervehicles

#### 🎨 Decal & Design (7 APIs):
- **Decal Types API** - GET /api/decaltypes
- **Decal Templates API** - GET /api/decaltemplates
- **Decal Services API** - GET /api/decalservices
- **Designs API** - GET /api/designs
- **Design Template Items API** - GET /api/designtemplateitems
- **Design Work Orders API** - GET /api/designworkorders
- **Design Comments API** - GET /api/designcomments

#### 📦 Order Management (3 APIs):
- **Orders API** - GET /api/orders
- **Order Details API** - GET /api/orderdetails
- **Order Stage Histories API** - GET /api/orderstagehistories

#### 💰 Financial (3 APIs):
- **Payments API** - GET /api/payments
- **Deposits API** - GET /api/deposits
- **Tech Labor Prices API** - GET /api/techlaborprices

#### 🛠️ Support & Quality (2 APIs):
- **Feedbacks API** - GET /api/feedbacks
- **Warranties API** - GET /api/warranties

### 🔧 Tính năng:
- ✅ **24 API endpoints** testing đầy đủ
- ✅ **Category filtering** (Core, Vehicle, Decal, Order, Financial, Support)
- ✅ **Real-time API testing** với status indicators
- ✅ **CORS headers inspection** và debugging
- ✅ **Error handling** chi tiết với console logging
- ✅ **Connection status monitoring**
- ✅ **Success/Error statistics** cho từng category
- ✅ **Compact UI design** hiển thị nhiều APIs
- ✅ **Beautiful UI** với Tailwind CSS và icons
- ✅ **Responsive design** mobile-friendly

## 🛠️ Cấu hình

### API Base URL
Trong file `src/services/api.js`:

```javascript
// Production
const BASE_URL = 'https://decalxeapi-backend-production.up.railway.app';

// Local development  
// const BASE_URL = 'http://localhost:5000';
```

### Axios Configuration
- **Timeout**: 10 seconds
- **Headers**: Content-Type: application/json
- **Interceptors**: Request/Response logging
- **Token**: Auto-attach từ localStorage

## 🧪 Cách sử dụng

### 1. Kiểm tra kết nối
- Click "Kiểm tra kết nối" để test Swagger endpoint
- Xem status indicator (green = OK, red = Error)

### 2. Test từng API
- Click "Test API" trên mỗi card
- Xem kết quả JSON response
- Check status: Success (green) hoặc Error (red)

### 3. Test tất cả APIs
- Click "Chạy tất cả test" để test sequential
- Xem progress và kết quả từng API

### 4. Debug CORS
- Mở Developer Tools (F12)
- **Network tab**: Xem CORS headers
- **Console tab**: Xem error logs

## 🔍 CORS Debugging

### Headers cần kiểm tra:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, Accept, Origin, X-Requested-With
Access-Control-Allow-Credentials: true
```

### Common CORS Errors:
1. **Origin not allowed** → Check API CORS config
2. **Preflight failed** → Check OPTIONS method support
3. **Headers not allowed** → Check allowed headers list

## 📁 Project Structure

```
cors-test-react/
├── src/
│   ├── components/
│   │   ├── TestCard.jsx      # API test card component
│   │   └── ApiStatus.jsx     # Connection status indicator
│   ├── services/
│   │   └── api.js            # Axios configuration & API calls
│   ├── App.jsx               # Main application
│   ├── main.jsx              # React entry point
│   └── index.css             # Tailwind imports
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 UI Components

### TestCard
- Hiển thị status (idle, loading, success, error)
- JSON response viewer
- Click-to-test functionality

### ApiStatus  
- Connection indicator
- Last checked timestamp
- Error message display

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel/Netlify
1. Build project: `npm run build`
2. Upload `dist/` folder
3. Configure SPA redirects

## 🔧 Customization

### Thêm API test mới:
1. Thêm function trong `src/services/api.js`
2. Thêm test case trong `App.jsx` array `testCases`
3. Component sẽ tự động render

### Thay đổi styling:
- Edit Tailwind classes trong components
- Customize `tailwind.config.js` cho theme

## 📝 Notes

- Port 5173 được hardcode để match CORS config
- API responses được log ra console
- Error handling bao gồm network và HTTP errors
- Token authentication support (nếu có trong localStorage)

## 🐛 Troubleshooting

### CORS vẫn lỗi?
1. Check API có deploy chưa
2. Verify CORS middleware trong backend
3. Check Network tab cho preflight requests
4. Verify origin trong API logs

### API không response?
1. Check API URL trong `api.js`
2. Verify API server đang chạy
3. Check timeout setting (10s default)
4. Test API trực tiếp bằng Postman