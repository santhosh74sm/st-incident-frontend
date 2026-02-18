import React from 'react';
import { Bell, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4 lg:hidden">
                <Menu className="text-gray-600" />
                <span className="font-bold text-primary">ST System</span>
            </div>

            <div className="hidden lg:block">
                <h1 className="text-gray-500 font-medium">Welcome back, <span className="text-primary font-bold">{user?.name}</span></h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800 leading-none">{user?.name}</p>
                        <p className="text-xs text-secondary font-medium mt-1">{user?.role}</p>
                    </div>
                    <UserCircle size={32} className="text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;