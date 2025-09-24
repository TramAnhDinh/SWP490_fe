import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { STORAGE_KEYS } from '../constants/api';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get current user từ localStorage
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => {
      // Return user from localStorage directly
      const currentUser = authService.getCurrentUser();

      // Check if we're on login page or if user explicitly logged out
      const isOnLoginPage = window.location.pathname === '/login';
      const hasLoggedOut = sessionStorage.getItem('hasLoggedOut') === 'true';

      // If no user found and we're not on login page and haven't logged out, return null
      if (!currentUser && !isOnLoginPage && !hasLoggedOut) {
        return null;
      }

      // Clear logout flag if we have a user
      if (currentUser) {
        sessionStorage.removeItem('hasLoggedOut');
      }

      return currentUser;
    },
    staleTime: 0, // Always refetch when needed
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false, // Don't retry on error
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Clear logout flag on successful login
      sessionStorage.removeItem('hasLoggedOut');
      queryClient.invalidateQueries(['auth', 'currentUser']);
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng nhập thất bại');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
    },
    onError: (error) => {
      toast.error(error.message || 'Đăng ký thất bại');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // Call backend logout API if available
        await authService.logout();
      } catch (error) {
        console.error('Backend logout failed:', error);
      } finally {
        // Clear all storage data
        authService.clearAllStorage();

        // Set logout flag to prevent auto-login
        sessionStorage.setItem('hasLoggedOut', 'true');
      }
      return { success: true };
    },
    onSuccess: () => {
      // Clear all query cache
      queryClient.setQueryData(['auth', 'currentUser'], null);
      queryClient.clear();

      // Show success message
      toast.success('Đăng xuất thành công!');

      // Redirect to login page
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);

      // Clear data even if logout fails
      queryClient.setQueryData(['auth', 'currentUser'], null);
      queryClient.clear();

      // Clear all storage data
      authService.clearAllStorage();

      // Set logout flag to prevent auto-login
      sessionStorage.setItem('hasLoggedOut', 'true');

      // Redirect to login page
      navigate('/login');
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công!');
    },
    onError: (error) => {
      toast.error(error.message || 'Đặt lại mật khẩu thất bại');
    },
  });

  // Helper functions
  const login = (credentials) => loginMutation.mutate(credentials);
  const register = (userData) => registerMutation.mutate(userData);
  const logout = () => logoutMutation.mutate();
  const resetPassword = (data) => resetPasswordMutation.mutate(data);

  // Check if user is authenticated based on current user data
  const isAuthenticated = !!user;
  const getUserRole = () => user?.role || user?.accountRoleName || null;
  const hasPermission = (requiredRole) => authService.hasPermission(requiredRole);
  const hasSpecificPermission = (permission) => authService.hasSpecificPermission(permission);
  const hasModulePermission = (module, action) => authService.hasModulePermission(module, action);
  const getAvailableModules = () => authService.getAvailableModules();
  const getAvailableActions = (module) => authService.getAvailableActions(module);

  // Update user function
  const updateUser = (userData) => {
    queryClient.setQueryData(['auth', 'currentUser'], userData);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  };

  return {
    // Data
    user,
    isAuthenticated,

    // Loading states
    isLoadingUser,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,

    // Errors
    userError,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    resetPasswordError: resetPasswordMutation.error,

    // Actions
    login,
    register,
    logout,
    resetPassword,

    // Helper functions
    getUserRole,
    hasPermission,
    hasSpecificPermission,
    hasModulePermission,
    getAvailableModules,
    getAvailableActions,
    updateUser,
  };
};