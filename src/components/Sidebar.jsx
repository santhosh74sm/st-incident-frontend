import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Users,
    LogOut,
    ShieldAlert,
    FileSpreadsheet,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: <LayoutDashboard size={20} />,
            roles: ['Admin', 'Teacher', 'Student', 'Parent']
        },
        {
            name: 'All Incidents',
            path: '/incidents',
            icon: <FileText size={20} />,
            roles: ['Admin', 'Teacher', 'Student', 'Parent']
        },
        {
            name: 'Report Incident',
            path: '/create-incident',
            icon: <PlusCircle size={20} />,
            roles: ['Admin', 'Teacher', 'Student']
        },
        {
            name: 'User Management',
            path: '/users',
            icon: <Users size={20} />,
            roles: ['Admin']
        },
        {
            name: 'Upload Students',
            path: '/upload-students',
            icon: <FileSpreadsheet size={20} />,
            roles: ['Admin']
        }
    ];

    const filteredMenu = menuItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-primary text-white">
                <button onClick={() => setIsOpen(true)}>
                    <Menu size={24} />
                </button>
                <span className="font-bold text-lg">ST System</span>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed lg:static top-0 left-0 h-screen w-64 bg-primary text-white flex flex-col z-50 transform transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >

                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-blue-800">
                    <div className="flex items-center gap-3">
                        <ShieldAlert size={28} />
                        <span className="font-bold text-xl">
                            ST System
                        </span>
                    </div>

                    {/* Close button mobile */}
                    <button
                        className="lg:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {filteredMenu.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                location.pathname === item.path
                                    ? 'bg-secondary text-white'
                                    : 'hover:bg-blue-800 text-blue-100'
                            }`}
                        >
                            {item.icon}
                            <span className="font-medium">
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-blue-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-red-900/30 transition"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
