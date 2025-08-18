import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Eye, 
  User,
  Calendar,
  Filter,
  Search,
  Send,
  Edit,
  Trash2,
  History,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, Button, Input, LoadingSpinner, Badge } from '../../components/common';
import { designService } from '../../services/designService';
import { useAuth } from '../../hooks/useAuth';

const DesignApprovalPage = () => {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get designs based on current filter
  const { data: designs = [], isLoading, error } = useQuery({
    queryKey: ['designs', filterStatus, searchTerm],
    queryFn: () => designService.getDesigns({ 
      status: filterStatus === 'all' ? undefined : filterStatus,
      search: searchTerm 
    }),
  });

  // Get comments for selected design
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['design-comments', selectedDesign?.designID],
    queryFn: () => designService.getDesignComments(selectedDesign.designID),
    enabled: !!selectedDesign && showComments,
  });

  // Approval mutation
  const approveMutation = useMutation({
    mutationFn: ({ designId, comments }) => 
      designService.approveDesign(designId, { comments, approvedBy: user.userId }),
    onSuccess: () => {
      toast.success('Thiết kế đã được duyệt thành công!');
      queryClient.invalidateQueries(['designs']);
      setSelectedDesign(null);
    },
    onError: (error) => {
      toast.error('Lỗi khi duyệt thiết kế: ' + error.message);
    },
  });

  // Rejection mutation
  const rejectMutation = useMutation({
    mutationFn: ({ designId, comments, reason }) => 
      designService.rejectDesign(designId, { comments, reason, rejectedBy: user.userId }),
    onSuccess: () => {
      toast.success('Thiết kế đã bị từ chối!');
      queryClient.invalidateQueries(['designs']);
      setSelectedDesign(null);
    },
    onError: (error) => {
      toast.error('Lỗi khi từ chối thiết kế: ' + error.message);
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ designId, comment }) => 
      designService.addComment(designId, {
        comment,
        commentBy: user.userId,
        commentDate: new Date().toISOString()
      }),
    onSuccess: () => {
      toast.success('Bình luận đã được thêm!');
      setNewComment('');
      queryClient.invalidateQueries(['design-comments']);
    },
    onError: (error) => {
      toast.error('Lỗi khi thêm bình luận: ' + error.message);
    },
  });

  const handleApprove = (designId, comments = '') => {
    if (window.confirm('Bạn có chắc chắn muốn duyệt thiết kế này?')) {
      approveMutation.mutate({ designId, comments });
    }
  };

  const handleReject = (designId, reason, comments = '') => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối thiết kế này?')) {
      rejectMutation.mutate({ designId, reason, comments });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận!');
      return;
    }
    addCommentMutation.mutate({ 
      designId: selectedDesign.designID, 
      comment: newComment.trim() 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTabCount = (status) => {
    return designs.filter(design => 
      status === 'all' || design.approvalStatus === status
    ).length;
  };

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.designName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         design.designer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'pending' && design.approvalStatus === 'Pending') ||
                      (selectedTab === 'approved' && design.approvalStatus === 'Approved') ||
                      (selectedTab === 'rejected' && design.approvalStatus === 'Rejected');
    return matchesSearch && matchesTab;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Lỗi: {error.message}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyệt Thiết kế</h1>
          <p className="text-gray-600">Quản lý quy trình duyệt thiết kế và phản hồi</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'pending', label: 'Chờ duyệt', count: getTabCount('Pending') },
            { key: 'approved', label: 'Đã duyệt', count: getTabCount('Approved') },
            { key: 'rejected', label: 'Từ chối', count: getTabCount('Rejected') },
            { key: 'all', label: 'Tất cả', count: designs.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm thiết kế hoặc người thiết kế..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Design List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDesigns.map((design) => (
          <Card key={design.designID} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              {design.designURL ? (
                <img
                  src={design.designURL}
                  alt={design.designName || 'Design'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge className={getStatusColor(design.approvalStatus)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(design.approvalStatus)}
                    {design.approvalStatus}
                  </div>
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {design.designName || `Design ${design.designID.slice(0, 8)}`}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{design.designer?.name || 'Chưa xác định'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>v{design.version}</span>
                  </div>
                  {design.designPrice && (
                    <div className="text-green-600 font-medium">
                      {design.designPrice.toLocaleString()} VNĐ
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedDesign(design);
                    setShowComments(true);
                  }}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Xem chi tiết
                </Button>
                
                {design.approvalStatus === 'Pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(design.designID)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const reason = prompt('Lý do từ chối:');
                        if (reason) handleReject(design.designID, reason);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={rejectMutation.isPending}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDesigns.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không có thiết kế nào phù hợp với bộ lọc hiện tại</p>
          </div>
        </Card>
      )}

      {/* Design Detail Modal with Comments */}
      {selectedDesign && showComments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {selectedDesign.designName || `Design ${selectedDesign.designID.slice(0, 8)}`}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDesign(null);
                  setShowComments(false);
                }}
              >
                Đóng
              </Button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Design Preview */}
              <div className="flex-1 p-6">
                <div className="h-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {selectedDesign.designURL ? (
                    <img
                      src={selectedDesign.designURL}
                      alt={selectedDesign.designName}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-24 h-24 text-gray-400" />
                  )}
                </div>
                
                {/* Design Info */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Người thiết kế:</span> {selectedDesign.designer?.name || 'Chưa xác định'}
                  </div>
                  <div>
                    <span className="font-medium">Phiên bản:</span> v{selectedDesign.version}
                  </div>
                  <div>
                    <span className="font-medium">Trạng thái:</span>{' '}
                    <Badge className={getStatusColor(selectedDesign.approvalStatus)}>
                      {selectedDesign.approvalStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Giá:</span>{' '}
                    {selectedDesign.designPrice ? `${selectedDesign.designPrice.toLocaleString()} VNĐ` : 'Chưa định giá'}
                  </div>
                  {selectedDesign.size && (
                    <div className="col-span-2">
                      <span className="font-medium">Kích thước:</span> {selectedDesign.size}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedDesign.approvalStatus === 'Pending' && (
                  <div className="flex gap-2 mt-6">
                    <Button
                      onClick={() => handleApprove(selectedDesign.designID)}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Duyệt thiết kế
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const reason = prompt('Lý do từ chối:');
                        if (reason) handleReject(selectedDesign.designID, reason);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                      disabled={rejectMutation.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Từ chối
                    </Button>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="w-80 border-l bg-gray-50 flex flex-col">
                <div className="p-4 border-b bg-white">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Bình luận & Phản hồi
                  </h3>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {commentsLoading ? (
                    <LoadingSpinner />
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.commentID} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            {comment.commentBy?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-medium">{comment.commentBy || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.commentDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm">
                      Chưa có bình luận nào
                    </div>
                  )}
                </div>

                {/* Add Comment */}
                <div className="p-4 bg-white border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Thêm bình luận..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={addCommentMutation.isPending || !newComment.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignApprovalPage;