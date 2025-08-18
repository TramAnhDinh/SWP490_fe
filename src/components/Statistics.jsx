import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const Statistics = ({ testResults, testCases }) => {
  const totalTests = testCases.length;
  const successCount = testCases.filter(testCase => testResults[testCase.id]?.status === 'success').length;
  const errorCount = testCases.filter(testCase => testResults[testCase.id]?.status === 'error').length;
  const pendingCount = totalTests - successCount - errorCount;
  
  const successRate = totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0;

  const stats = [
    {
      label: 'Tổng APIs',
      value: totalTests,
      icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
      color: 'text-gray-900'
    },
    {
      label: 'Thành công',
      value: successCount,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      color: 'text-green-600'
    },
    {
      label: 'Lỗi',
      value: errorCount,
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      color: 'text-red-600'
    },
    {
      label: 'Chưa test',
      value: pendingCount,
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg border p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Thống kê Test APIs</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
          <div className="text-sm text-gray-500">Tỉ lệ thành công</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Tiến độ test</span>
          <span>{successCount + errorCount}/{totalTests}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((successCount + errorCount) / totalTests) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;