import React from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

const ApiStatus = ({ isConnected, lastChecked, error }) => {
  const getStatusIcon = () => {
    if (error) {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    return isConnected ? (
      <Wifi className="w-5 h-5 text-green-500" />
    ) : (
      <WifiOff className="w-5 h-5 text-gray-400" />
    );
  };

  const getStatusText = () => {
    if (error) return 'Lỗi kết nối';
    return isConnected ? 'Đã kết nối' : 'Chưa kết nối';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    return isConnected ? 'text-green-600' : 'text-gray-600';
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      {getStatusIcon()}
      <div className="flex-1">
        <div className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
        {lastChecked && (
          <div className="text-xs text-gray-500">
            Kiểm tra lần cuối: {new Date(lastChecked).toLocaleTimeString('vi-VN')}
          </div>
        )}
        {error && (
          <div className="text-xs text-red-500 mt-1">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiStatus;