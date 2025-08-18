import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const TestCard = ({ title, description, status, result, onTest, loading }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-md font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-xs">{description}</p>
        </div>
        <div className="ml-3">
          {getStatusIcon()}
        </div>
      </div>

      <button
        onClick={onTest}
        disabled={loading}
        className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Testing...' : 'Test'}
      </button>

      {result && (
        <div className="mt-3">
          <div className="text-xs font-medium text-gray-700 mb-1">Kết quả:</div>
          <div className="bg-gray-100 rounded-md p-2 overflow-auto max-h-32">
            <pre className="text-xs text-gray-800 whitespace-pre-wrap">
              {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCard;