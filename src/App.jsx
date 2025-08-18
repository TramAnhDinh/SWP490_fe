import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Layout components
import Layout from "./components/layout/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PublicDashboardPage from "./pages/PublicDashboardPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import OrderListPage from "./pages/orders/OrderListPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import OrderCreatePage from "./pages/orders/OrderCreatePage";
import OrderTrackingPage from "./pages/orders/OrderTrackingPage";

// Installation Management Pages
import InstallationQueuePage from "./pages/installations/InstallationQueuePage";
import InstallationTrackingPage from "./pages/installations/InstallationTrackingPage";
import QualityControlPage from "./pages/installations/QualityControlPage";

// Notification Management Pages
import NotificationListPage from "./pages/notifications/NotificationListPage";
import CreateNotificationPage from "./pages/notifications/CreateNotificationPage";
import NotificationCenterPage from "./pages/notifications/NotificationCenterPage";
import MessageSystemPage from "./pages/notifications/MessageSystemPage";

// Settings Pages
import SystemSettingsPage from "./pages/settings/SystemSettingsPage";
import UserProfilePage from "./pages/settings/UserProfilePage";

// Detail Pages
import EmployeeDetailPage from "./pages/employees/EmployeeDetailPage";
import TemplateLibraryPage from "./pages/templates/TemplateLibraryPage";

import CustomerListPage from "./pages/CustomerListPage";
import CustomerCreatePage from "./pages/CustomerCreatePage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import CustomerEditPage from "./pages/CustomerEditPage";
import VehicleDetailPage from "./pages/vehicles/VehicleDetailPage";

// Vehicle Management Pages
import VehicleListPage from "./pages/vehicles/VehicleListPage";
import BrandCreatePage from "./pages/vehicles/BrandCreatePage";
import BrandDetailPage from "./pages/vehicles/BrandDetailPage";
import ModelCreatePage from "./pages/vehicles/ModelCreatePage";
import ModelDetailPage from "./pages/vehicles/ModelDetailPage";

// Design & Template Module Pages
import DesignGalleryPage from "./pages/designs/DesignGalleryPage";
import DesignApprovalPage from "./pages/designs/DesignApprovalPage";
import DesignEditorPage from "./pages/designs/DesignEditorPage";
import DesignTestPage from "./pages/designs/DesignTestPage";

// Employee Management Module Pages
import EmployeeListPage from "./pages/employees/EmployeeListPage";
import AddEmployeePage from "./pages/employees/AddEmployeePage";
import EmployeeEditPage from "./pages/employees/EmployeeEditPage";
import PerformanceTrackingPage from "./pages/employees/PerformanceTrackingPage";

// Store Management Module Pages
import StoreListPage from "./pages/stores/StoreListPage";
import AddStorePage from "./pages/stores/AddStorePage";
import StoreDetailPage from "./pages/stores/StoreDetailPage";
import EditStorePage from "./pages/stores/EditStorePage";

// Account Management Module Pages
import AccountListPage from "./pages/accounts/AccountListPage";
import AddAccountPage from "./pages/accounts/AddAccountPage";
import AccountEditPage from "./pages/accounts/AccountEditPage";

// Services & Inventory Module Pages
import ServiceListPage from "./pages/services/ServiceListPage";
import ServiceManagementPage from "./pages/services/ServiceManagementPage";
import ServiceDetailPage from "./pages/services/ServiceDetailPage";
import InventoryTrackingPage from "./pages/services/InventoryTrackingPage";
import PricingManagementPage from "./pages/services/PricingManagementPage";
import DecalTypesPage from "./pages/services/DecalTypesPage";

// Payment & Financial Module Pages
import PaymentProcessingPage from "./pages/payments/PaymentProcessingPage";
import InvoiceManagementPage from "./pages/payments/InvoiceManagementPage";
import FinancialReportsPage from "./pages/payments/FinancialReportsPage";
import DepositTrackingPage from "./pages/payments/DepositTrackingPage";

// Warranty & Support Module Pages
import WarrantyManagementPage from "./pages/warranty/WarrantyManagementPage";
import FeedbackSystemPage from "./pages/warranty/FeedbackSystemPage";
import SupportTicketPage from "./pages/warranty/SupportTicketPage";

// Analytics & Reporting Module Pages
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage";
import SalesAnalytics from "./components/analytics/SalesAnalytics";
import PerformanceMetrics from "./components/analytics/PerformanceMetrics";
import CustomerInsights from "./components/analytics/CustomerInsights";
import OperationalReports from "./components/analytics/OperationalReports";

// Auth hook
import { useAuth } from "./hooks/useAuth";
import { NotificationProvider } from "./contexts/NotificationContext";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoadingUser } = useAuth();

  console.log('🔒 ProtectedRoute - isAuthenticated:', isAuthenticated, 'user:', user, 'isLoading:', isLoadingUser);

  if (isLoadingUser) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    console.log('🚫 User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route wrapper (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, isLoadingUser } = useAuth();

  console.log('🌐 PublicRoute - isAuthenticated:', isAuthenticated, 'user:', user, 'isLoading:', isLoadingUser);

  if (isLoadingUser) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  if (isAuthenticated) {
    console.log('✅ User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<PublicDashboardPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                {/* Dashboard */}
                <Route path="dashboard" element={<DashboardPage />} />

                {/* Order Management Routes */}
                <Route path="orders" element={<OrderListPage />} />
                <Route path="orders/create" element={<OrderCreatePage />} />
                <Route path="orders/tracking" element={<OrderTrackingPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />

                {/* Installation Management Routes */}
                <Route path="installations" element={<InstallationQueuePage />} />
                <Route path="installations/queue" element={<InstallationQueuePage />} />
                <Route path="installations/tracking" element={<InstallationTrackingPage />} />
                <Route path="installations/quality" element={<QualityControlPage />} />

                {/* Notification Management Routes */}
                <Route path="notifications" element={<NotificationListPage />} />
                <Route path="notifications/create" element={<CreateNotificationPage />} />
                <Route path="notifications/center" element={<NotificationCenterPage />} />
                <Route path="notifications/messages" element={<MessageSystemPage />} />

                {/* Detail Pages Routes */}
                <Route path="employees/:id" element={<EmployeeDetailPage />} />
                <Route path="services/:id" element={<ServiceDetailPage />} />
                <Route path="templates" element={<TemplateLibraryPage />} />

                {/* Customer Management Routes */}
                <Route path="customers" element={<CustomerListPage />} />
                <Route path="customers/create" element={<CustomerCreatePage />} />
                <Route path="customers/:id" element={<CustomerDetailPage />} />
                <Route path="customers/:id/edit" element={<CustomerEditPage />} />

                {/* Vehicle Management Routes */}
                <Route path="vehicles" element={<VehicleListPage />} />
                <Route path="vehicles/:id" element={<VehicleDetailPage />} />
                <Route
                  path="vehicles/brands/create"
                  element={<BrandCreatePage />}
                />
                <Route path="vehicles/brands/:id" element={<BrandDetailPage />} />
                <Route
                  path="vehicles/models/create"
                  element={<ModelCreatePage />}
                />
                <Route path="vehicles/models/:id" element={<ModelDetailPage />} />

                {/* Design & Template Module Routes */}
                <Route path="designs" element={<DesignGalleryPage />} />
                <Route path="designs/approval" element={<DesignApprovalPage />} />
                <Route path="designs/editor" element={<DesignEditorPage />} />
                <Route path="designs/test" element={<DesignTestPage />} />
                <Route
                  path="templates"
                  element={
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Thư viện Mẫu</h1>
                      <p>Trang này sẽ được hoàn thiện sau</p>
                    </div>
                  }
                />

                {/* Employee Management Module Routes */}
                <Route path="employees" element={<EmployeeListPage />} />
                <Route path="employees/:id" element={<EmployeeDetailPage />} />
                <Route path="employees/:id/edit" element={<EmployeeEditPage />} />
                <Route path="employees/add" element={<AddEmployeePage />} />
                <Route path="performance" element={<PerformanceTrackingPage />} />

                {/* Store Management Module Routes */}
                <Route path="stores" element={<StoreListPage />} />
                <Route path="stores/add" element={<AddStorePage />} />
                <Route path="stores/:storeId" element={<StoreDetailPage />} />
                <Route path="stores/:storeId/edit" element={<EditStorePage />} />

                {/* Account Management Module Routes */}
                <Route path="accounts" element={<AccountListPage />} />
                <Route path="accounts/add" element={<AddAccountPage />} />
                <Route path="accounts/:accountId/edit" element={<AccountEditPage />} />

                {/* Services & Inventory Module Routes */}
                <Route path="services" element={<ServiceManagementPage />} />
                <Route path="services/list" element={<ServiceListPage />} />
                <Route path="services/:id" element={<ServiceDetailPage />} />
                <Route
                  path="services/:id/edit"
                  element={
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Chỉnh sửa Dịch vụ</h1>
                      <p>Trang này sẽ được hoàn thiện sau</p>
                    </div>
                  }
                />
                <Route path="decal-types" element={<DecalTypesPage />} />
                <Route path="pricing" element={<PricingManagementPage />} />
                <Route path="inventory" element={<InventoryTrackingPage />} />

                {/* Payment & Financial Module Routes */}
                <Route path="payments" element={<PaymentProcessingPage />} />
                <Route
                  path="payments/processing"
                  element={<PaymentProcessingPage />}
                />
                <Route
                  path="payments/invoices"
                  element={<InvoiceManagementPage />}
                />
                <Route
                  path="payments/reports"
                  element={<FinancialReportsPage />}
                />
                <Route
                  path="payments/deposits"
                  element={<DepositTrackingPage />}
                />

                {/* Warranty & Support Module Routes */}
                <Route path="warranty" element={<WarrantyManagementPage />} />
                <Route
                  path="warranty/management"
                  element={<WarrantyManagementPage />}
                />
                <Route path="feedback" element={<FeedbackSystemPage />} />
                <Route path="support" element={<SupportTicketPage />} />
                <Route path="support/tickets" element={<SupportTicketPage />} />

                {/* Analytics & Reporting Module Routes */}
                <Route path="analytics" element={<AnalyticsDashboardPage />} />
                <Route
                  path="analytics/dashboard"
                  element={<AnalyticsDashboardPage />}
                />
                <Route path="analytics/sales" element={<SalesAnalytics />} />
                <Route
                  path="analytics/performance"
                  element={<PerformanceMetrics />}
                />
                <Route
                  path="analytics/customers"
                  element={<CustomerInsights />}
                />
                <Route
                  path="analytics/operations"
                  element={<OperationalReports />}
                />
                <Route path="reports" element={<AnalyticsDashboardPage />} />
                <Route path="reports/sales" element={<SalesAnalytics />} />
                <Route
                  path="reports/performance"
                  element={<PerformanceMetrics />}
                />
                <Route path="reports/customers" element={<CustomerInsights />} />
                <Route
                  path="reports/operations"
                  element={<OperationalReports />}
                />

                {/* Placeholder routes - will be implemented in next phases */}
                <Route
                  path="vehicles"
                  element={
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Phương tiện</h1>
                      <p>Trang này sẽ được triển khai trong Phase 2</p>
                    </div>
                  }
                />
                {/* Settings Routes */}
                <Route path="settings/system" element={<SystemSettingsPage />} />
                <Route path="settings/profile" element={<UserProfilePage />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#fff",
                  color: "#374151",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </Router>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
