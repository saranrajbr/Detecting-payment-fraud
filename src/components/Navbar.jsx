import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <ShieldCheck size={28} />
                FraudSentinel
            </Link>

            <div className="nav-links">
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="btn-logout">
                        <LogOut size={18} />
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="text-secondary">Login</Link>
                        <Link to="/register" className="btn-primary">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
