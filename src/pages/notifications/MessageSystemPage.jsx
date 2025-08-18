import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    MessageSquare, Send, Search, Filter, RefreshCw, Check, Trash2, Eye, Clock, AlertTriangle,
    CheckCircle, XCircle, Plus, Settings, Users, Calendar, ArrowUpDown, Mail, Phone, Video,
    Star, Archive, Tag, Filter as FilterIcon, MoreHorizontal, ExternalLink, User, UserCheck,
    UserX, PhoneCall, Video as VideoIcon, Paperclip, Smile, Mic, Send as SendIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, LoadingSpinner } from '../../components/common';
import { notificationService } from '../../services/notificationService';
import { employeeService } from '../../services/employeeService';
import { customerService } from '../../services/customerService';

const MessageSystemPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const messagesEndRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // Mock data for conversations (in real app, this would come from API)
    const mockConversations = [
        {
            id: 1,
            type: 'individual',
            participants: [
                { id: 1, name: 'Nguyễn Văn A', role: 'Customer', avatar: null, online: true },
                { id: 2, name: 'Trần Thị B', role: 'Sales Staff', avatar: null, online: false }
            ],
            lastMessage: {
                id: 101,
                content: 'Tôi muốn đặt dịch vụ dán decal xe máy',
                sender: { id: 1, name: 'Nguyễn Văn A' },
                timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                unread: true
            },
            unreadCount: 2
        },
        {
            id: 2,
            type: 'group',
            name: 'Nhóm thiết kế Store 001',
            participants: [
                { id: 3, name: 'Lê Văn C', role: 'Designer', avatar: null, online: true },
                { id: 4, name: 'Phạm Thị D', role: 'Manager', avatar: null, online: true },
                { id: 5, name: 'Hoàng Văn E', role: 'Sales Staff', avatar: null, online: false }
            ],
            lastMessage: {
                id: 102,
                content: 'Design mới đã hoàn thành, anh chị review giúp em',
                sender: { id: 3, name: 'Lê Văn C' },
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                unread: false
            },
            unreadCount: 0
        },
        {
            id: 3,
            type: 'individual',
            participants: [
                { id: 6, name: 'Vũ Thị F', role: 'Customer', avatar: null, online: false },
                { id: 7, name: 'Đặng Văn G', role: 'Installation Technician', avatar: null, online: true }
            ],
            lastMessage: {
                id: 103,
                content: 'Lắp đặt đã hoàn thành, anh chị có thể đến nhận xe',
                sender: { id: 7, name: 'Đặng Văn G' },
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                unread: true
            },
            unreadCount: 1
        }
    ];

    // Mock messages for selected conversation
    const mockMessages = selectedConversation ? [
        {
            id: 1,
            content: 'Chào anh/chị, tôi muốn đặt dịch vụ dán decal xe máy',
            sender: { id: 1, name: 'Nguyễn Văn A', role: 'Customer' },
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            type: 'text'
        },
        {
            id: 2,
            content: 'Chào anh/chị, em có thể tư vấn cho anh/chị về dịch vụ dán decal. Anh/chị có thể cho em biết loại xe và yêu cầu cụ thể không?',
            sender: { id: 2, name: 'Trần Thị B', role: 'Sales Staff' },
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
            type: 'text'
        },
        {
            id: 3,
            content: 'Tôi có xe Honda Wave Alpha, muốn dán decal phong cách thể thao',
            sender: { id: 1, name: 'Nguyễn Văn A', role: 'Customer' },
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
            type: 'text'
        },
        {
            id: 4,
            content: 'Tuyệt vời! Em có một số mẫu decal thể thao phù hợp với Honda Wave Alpha. Em sẽ gửi catalog cho anh/chị xem nhé',
            sender: { id: 2, name: 'Trần Thị B', role: 'Sales Staff' },
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            type: 'text'
        },
        {
            id: 5,
            content: 'Tôi muốn đặt dịch vụ dán decal xe máy',
            sender: { id: 1, name: 'Nguyễn Văn A', role: 'Customer' },
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            type: 'text'
        }
    ] : [];

    // Fetch employees and customers for new conversation
    const { data: employees = [] } = useQuery({
        queryKey: ['employees'],
        queryFn: () => employeeService.getEmployees()
    });

    const { data: customers = [] } = useQuery({
        queryKey: ['customers'],
        queryFn: () => customerService.getCustomers()
    });

    // Mutations
    const sendMessageMutation = useMutation({
        mutationFn: (messageData) => {
            // In real app, this would call the API
            return Promise.resolve({ id: Date.now(), ...messageData });
        },
        onSuccess: () => {
            setNewMessage('');
            // In real app, this would invalidate the messages query
            toast.success('Đã gửi tin nhắn');
        }
    });

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mockMessages]);

    // Handle sending message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const messageData = {
            conversationId: selectedConversation.id,
            content: newMessage,
            type: 'text',
            timestamp: new Date()
        };

        sendMessageMutation.mutate(messageData);
    };

    // Handle key press in message input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Get conversation display name
    const getConversationName = (conversation) => {
        if (conversation.type === 'group') {
            return conversation.name;
        }
        // For individual conversations, show the other participant's name
        const currentUserId = 2; // Mock current user ID
        const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
        return otherParticipant ? otherParticipant.name : 'Unknown';
    };

    // Get conversation avatar
    const getConversationAvatar = (conversation) => {
        if (conversation.type === 'group') {
            return (
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                </div>
            );
        }
        const currentUserId = 2; // Mock current user ID
        const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
        return (
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
            </div>
        );
    };

    // Filter conversations
    const filteredConversations = mockConversations.filter(conversation => {
        const name = getConversationName(conversation);
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="h-screen flex bg-gray-50">
            {/* Sidebar - Conversations List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Tin nhắn</h2>
                        <Button
                            onClick={() => setShowNewConversation(true)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>Không có cuộc trò chuyện nào</p>
                        </div>
                    ) : (
                        filteredConversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                onClick={() => setSelectedConversation(conversation)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        {getConversationAvatar(conversation)}
                                        {conversation.participants.some(p => p.online) && (
                                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {getConversationName(conversation)}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {conversation.lastMessage.timestamp.toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">
                                            {conversation.lastMessage.sender.name}: {conversation.lastMessage.content}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <div className="flex items-center justify-between mt-1">
                                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                    {conversation.unreadCount} tin nhắn mới
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getConversationAvatar(selectedConversation)}
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {getConversationName(selectedConversation)}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedConversation.participants.length} người tham gia
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <VideoIcon className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {mockMessages.map((message) => {
                                const isOwnMessage = message.sender.id === 2; // Mock current user ID
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                                            {!isOwnMessage && (
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <User className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {message.sender.name}
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className={`p-3 rounded-lg ${isOwnMessage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                                                    }`}>
                                                    {message.timestamp.toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex items-end gap-2">
                                <Button variant="ghost" size="sm">
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                                <div className="flex-1">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn..."
                                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={1}
                                    />
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <SendIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Chọn cuộc trò chuyện
                            </h3>
                            <p className="text-gray-500">
                                Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Conversation Modal */}
            {showNewConversation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Cuộc trò chuyện mới</h3>
                            <Button
                                onClick={() => setShowNewConversation(false)}
                                variant="ghost"
                                size="sm"
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại cuộc trò chuyện
                                </label>
                                <select className="w-full p-2 border border-gray-300 rounded-lg">
                                    <option value="individual">Cá nhân</option>
                                    <option value="group">Nhóm</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chọn người tham gia
                                </label>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {employees.map((employee) => (
                                        <label key={employee.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">{employee.firstName} {employee.lastName}</span>
                                        </label>
                                    ))}
                                    {customers.map((customer) => (
                                        <label key={customer.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">{customer.firstName} {customer.lastName}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setShowNewConversation(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Hủy
                                </Button>
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    Tạo cuộc trò chuyện
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageSystemPage;
