import React, { useState } from 'react';
import { Menu, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import { Button } from '../common';
import NotificationBell from '../notifications/NotificationBell';

const Header = ({ onMenuClick }) => {
  const { user, logout, getUserRole } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userRole = getUserRole();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/settings/profile');
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings/system');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Chào mừng trở lại, {user?.firstName || 'User'}!
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <NotificationBell />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-3 text-sm text-gray-700 hover:text-gray-900"
          >
            <div className="flex items-center justify-center h-8 w-8 bg-primary-100 rounded-full">
              {user?.firstName ? (
                <span className="text-primary-700 font-medium">
                  {user.firstName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-4 w-4 text-primary-700" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* User dropdown */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleProfileClick}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Hồ sơ cá nhân
                  </button>

                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleSettingsClick}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Cài đặt
                  </button>

                  <hr className="my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;