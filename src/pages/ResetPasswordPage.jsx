import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const { data } = await API.post('/auth/reset-password', { email, newPassword });
            setMessage(data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <h2 className="card-title text-center">Reset Password</h2>
                {error && <div className="text-danger text-center" style={{ marginBottom: '1rem' }}>{error}</div>}
                {message && <div className="text-success text-center" style={{ marginBottom: '1rem' }}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            required
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 6 characters"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary btn-full">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                <p className="text-secondary text-center" style={{ marginTop: '1.5rem' }}>
                    Remember your password? <Link to="/login" className="text-primary">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
