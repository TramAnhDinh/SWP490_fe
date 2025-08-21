// Utility functions for role management
export const getRoleNameInVietnamese = (role) => {
    const roleMap = {
        'Admin': 'Quản trị viên',
        'Manager': 'Quản lý',
        'Sales': 'Nhân viên bán hàng',
        'Designer': 'Thiết kế',
        'Technician': 'Kỹ thuật viên'
    };
    return roleMap[role] || role || 'Chưa phân quyền';
};

export const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
        case 'admin': return 'bg-purple-100 text-purple-800';
        case 'manager': return 'bg-blue-100 text-blue-800';
        case 'sales': return 'bg-green-100 text-green-800';
        case 'technician': return 'bg-orange-100 text-orange-800';
        case 'designer': return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export const getRoleInfo = (role) => {
    const roleConfig = {
        'Admin': {
            color: 'bg-red-100 text-red-800',
            name: 'Quản trị viên',
            description: 'Quản lý toàn bộ hệ thống',
            icon: 'Settings'
        },
        'Manager': {
            color: 'bg-blue-100 text-blue-800',
            name: 'Quản lý',
            description: 'Quản lý cửa hàng và nhân viên',
            icon: 'Users'
        },
        'Sales': {
            color: 'bg-green-100 text-green-800',
            name: 'Nhân viên bán hàng',
            description: 'Tư vấn và bán hàng',
            icon: 'DollarSign'
        },
        'Designer': {
            color: 'bg-purple-100 text-purple-800',
            name: 'Thiết kế',
            description: 'Thiết kế decal và mẫu',
            icon: 'Palette'
        },
        'Technician': {
            color: 'bg-orange-100 text-orange-800',
            name: 'Kỹ thuật viên',
            description: 'Lắp đặt và bảo hành',
            icon: 'Car'
        }
    };
    return roleConfig[role] || {
        color: 'bg-gray-100 text-gray-800',
        name: role || 'Chưa phân quyền',
        description: 'Chưa có mô tả',
        icon: 'User'
    };
};
