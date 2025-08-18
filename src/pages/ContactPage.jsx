import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    ArrowLeft,
    Send,
    CheckCircle,
    LogIn
} from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Form submitted:', formData);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                service: '',
                message: ''
            });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Địa chỉ',
            content: '245 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP.HCM',
            color: 'text-blue-600'
        },
        {
            icon: Phone,
            title: 'Điện thoại',
            content: '0909 123 456',
            color: 'text-green-600'
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'info@decalxe.com',
            color: 'text-red-600'
        },
        {
            icon: Clock,
            title: 'Giờ làm việc',
            content: 'Thứ 2 - Chủ nhật: 8:00 - 20:00',
            color: 'text-purple-600'
        }
    ];

    const services = [
        'Dán decal xe',
        'Thiết kế decal',
        'Bảo hành & bảo trì',
        'Tư vấn miễn phí',
        'Khác'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Quay lại trang chủ
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">DecalXe</h1>
                        </div>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            Đăng nhập hệ thống
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Liên hệ với chúng tôi
                    </h2>
                    <p className="text-xl text-gray-600">
                        Hãy để chúng tôi tư vấn và báo giá miễn phí cho bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                            Thông tin liên hệ
                        </h3>
                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <info.icon className={`w-6 h-6 ${info.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                                        <p className="text-gray-600">{info.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map placeholder */}
                        <div className="mt-8">
                            <h4 className="font-semibold text-gray-900 mb-4">Vị trí của chúng tôi</h4>
                            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                                    <p>Bản đồ sẽ được hiển thị ở đây</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                            Gửi tin nhắn cho chúng tôi
                        </h3>

                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h4 className="text-lg font-semibold text-green-900 mb-2">
                                    Gửi tin nhắn thành công!
                                </h4>
                                <p className="text-green-700">
                                    Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập email"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dịch vụ quan tâm
                                        </label>
                                        <select
                                            name="service"
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Chọn dịch vụ</option>
                                            {services.map((service, index) => (
                                                <option key={index} value={service}>{service}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung tin nhắn <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Mô tả chi tiết yêu cầu của bạn..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                    Gửi tin nhắn
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
