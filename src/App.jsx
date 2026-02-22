import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TransactionSimulation from './pages/TransactionSimulation';
import AdminPanel from './pages/AdminPanel';
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!localStorage.getItem('token');
    const isAdmin = user?.role === 'admin';

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div className="main-layout">
                    {isAuthenticated && <Sidebar />}
                    <main className="content">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route
                                path="/profile"
                                element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/dashboard"
                                element={isAuthenticated ? (isAdmin ? <Dashboard /> : <Navigate to="/simulate" />) : <Navigate to="/login" />}
                            />
                            <Route
                                path="/simulate"
                                element={isAuthenticated ? <TransactionSimulation /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/admin"
                                element={isAuthenticated ? (isAdmin ? <AdminPanel /> : <Navigate to="/simulate" />) : <Navigate to="/login" />}
                            />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default App;
