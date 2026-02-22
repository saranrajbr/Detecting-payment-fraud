import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ShieldAlert, Settings } from 'lucide-react';

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Simulate', path: '/simulate', icon: <CreditCard size={20} /> },
    ];

    if (user.role === 'admin') {
        navItems.push({ name: 'Admin Panel', path: '/admin', icon: <ShieldAlert size={20} /> });
    }

    return (
        <aside className="sidebar">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `sidebar-link ${isActive ? 'active' : ''}`
                    }
                >
                    {item.icon}
                    {item.name}
                </NavLink>
            ))}
        </aside>
    );
};

export default Sidebar;
