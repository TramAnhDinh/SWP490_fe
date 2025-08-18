import React from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const CustomerSearchModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  onCreateNew, 
  customers = [], 
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Tìm Kiếm Khách Hàng
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
                <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
              </div>
            ) : customers.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">
                  Tìm thấy {customers.length} khách hàng. Vui lòng chọn một khách hàng:
                </p>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {customers.map((customer) => (
                    <div
                      key={customer.customerID}
                      onClick={() => onSelect(customer)}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {customer.phoneNumber}
                          </p>
                          {customer.email && (
                            <p className="text-sm text-gray-500">
                              {customer.email}
                            </p>
                          )}
                        </div>
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Không tìm thấy khách hàng
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Không có khách hàng nào phù hợp với thông tin tìm kiếm.
                </p>
              </div>
            )}

            {/* Create new customer button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={onCreateNew}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus className="h-4 w-4" />
                Tạo Khách Hàng Mới
              </button>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSearchModal;