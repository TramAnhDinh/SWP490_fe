import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Button, Input, Card } from '../../components/common';
import { designService } from '../../services/designService';

const DesignTestPage = () => {
  const [testData, setTestData] = useState({
    designName: 'Test Design',
    description: 'Test description',
    category: 'Test',
    tags: 'test, demo',
    price: 100000,
    designURL: 'https://via.placeholder.com/300x200/0066cc/ffffff?text=Test+Design'
  });

  // Test mutation without file
  const testMutation = useMutation({
    mutationFn: (data) => designService.createDesignWithoutFile(data),
    onSuccess: (data) => {
      toast.success('Test thành công! API hoạt động bình thường.');
      console.log('Success response:', data);
    },
    onError: (error) => {
      console.error('Test error:', error);
      toast.error(`Test thất bại: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  });

  // Test minimal mutation
  const testMinimalMutation = useMutation({
    mutationFn: designService.testCreateDesign,
    onSuccess: (data) => {
      toast.success('Test minimal thành công!');
      console.log('Minimal success response:', data);
    },
    onError: (error) => {
      console.error('Minimal test error:', error);
      toast.error(`Test minimal thất bại: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  });

  // Test simple mutation
  const testSimpleMutation = useMutation({
    mutationFn: designService.testCreateDesignSimple,
    onSuccess: (data) => {
      toast.success('Test simple thành công!');
      console.log('Simple success response:', data);
    },
    onError: (error) => {
      console.error('Simple test error:', error);
      toast.error(`Test simple thất bại: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }
  });

  const handleTest = () => {
    testMutation.mutate(testData);
  };

  const handleTestMinimal = () => {
    testMinimalMutation.mutate();
  };

  const handleTestSimple = () => {
    testSimpleMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Test API Designs</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Design Name</label>
            <Input
              value={testData.designName}
              onChange={(e) => setTestData(prev => ({ ...prev, designName: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={testData.description}
              onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Input
              value={testData.category}
              onChange={(e) => setTestData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <Input
              value={testData.tags}
              onChange={(e) => setTestData(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input
              type="number"
              value={testData.price}
              onChange={(e) => setTestData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Design URL</label>
            <Input
              type="url"
              value={testData.designURL}
              onChange={(e) => setTestData(prev => ({ ...prev, designURL: e.target.value }))}
              placeholder="https://example.com/design.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={handleTest}
              disabled={testMutation.isPending}
              className="w-full"
            >
              {testMutation.isPending ? 'Đang test...' : 'Test API (Full payload)'}
            </Button>
            
            <Button
              onClick={handleTestMinimal}
              disabled={testMinimalMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {testMinimalMutation.isPending ? 'Đang test...' : 'Test API (Minimal payload)'}
            </Button>

            <Button
              onClick={handleTestSimple}
              disabled={testSimpleMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {testSimpleMutation.isPending ? 'Đang test...' : 'Test API (Simple payload)'}
            </Button>
          </div>
        </div>
        
        {testMutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium text-green-800">Test thành công!</h3>
            <pre className="text-sm text-green-700 mt-2">
              {JSON.stringify(testMutation.data, null, 2)}
            </pre>
          </div>
        )}
        
        {testMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800">Test Full thất bại!</h3>
            <pre className="text-sm text-red-700 mt-2">
              {JSON.stringify(testMutation.error.response?.data, null, 2)}
            </pre>
          </div>
        )}

        {testMinimalMutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium text-green-800">Test Minimal thành công!</h3>
            <pre className="text-sm text-green-700 mt-2">
              {JSON.stringify(testMinimalMutation.data, null, 2)}
            </pre>
          </div>
        )}
        
        {testMinimalMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800">Test Minimal thất bại!</h3>
            <pre className="text-sm text-red-700 mt-2">
              {JSON.stringify(testMinimalMutation.error.response?.data, null, 2)}
            </pre>
          </div>
        )}

        {testSimpleMutation.isSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="font-medium text-green-800">Test Simple thành công!</h3>
            <pre className="text-sm text-green-700 mt-2">
              {JSON.stringify(testSimpleMutation.data, null, 2)}
            </pre>
          </div>
        )}
        
        {testSimpleMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
            <h3 className="font-medium text-red-800">Test Simple thất bại!</h3>
            <pre className="text-sm text-red-700 mt-2">
              {JSON.stringify(testSimpleMutation.error.response?.data, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DesignTestPage;