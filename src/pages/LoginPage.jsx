import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/simulate');
            }
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <h2 className="card-title text-center">User Login</h2>
                {error && <div className="text-danger text-center" style={{ marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            required
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary btn-full">
                        Login
                    </button>
                </form>
                <p className="text-secondary text-center" style={{ marginTop: '1.5rem' }}>
                    <Link to="/reset-password" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>Forgot Password?</Link>
                </p>
                <p className="text-secondary text-center" style={{ marginTop: '0.5rem' }}>
                    Don't have an account? <Link to="/register" className="text-primary">Register</Link>
                </p>
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <Link to="/admin-login" style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 'bold' }}>Staff/Admin Portal</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
