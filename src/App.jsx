import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TransactionSimulation from './pages/TransactionSimulation';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './App.css';

const App = () => {
    const isAuthenticated = !!localStorage.getItem('token');

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
                            <Route
                                path="/dashboard"
                                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/simulate"
                                element={isAuthenticated ? <TransactionSimulation /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/admin"
                                element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />}
                            />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default App;
