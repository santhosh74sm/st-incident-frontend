import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    PlusCircle, 
    Users, 
    LogOut, 
    ShieldAlert, 
    FileSpreadsheet 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

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

        // ✅ NEW MENU ITEM (Step 3)
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
        <div className="h-screen w-64 bg-primary text-white flex flex-col sticky top-0 hidden lg:flex">

            {/* Header */}
            <div className="p-6 flex items-center gap-3 border-b border-blue-800">
                <ShieldAlert className="text-secondary" size={32} />
                <span className="font-bold text-xl tracking-tight">
                    ST System
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 mt-4">
                {filteredMenu.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
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
    );
};

export default Sidebar;
