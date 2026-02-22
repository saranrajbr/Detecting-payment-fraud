import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { ShieldCheck, Lock } from 'lucide-react';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });

            if (data.user.role !== 'admin') {
                setError('Access Denied: Standard users cannot access the Admin Portal.');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.error || 'Admin login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="card admin-auth-card" style={{ borderColor: 'var(--danger)' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <ShieldCheck size={48} color="var(--danger)" />
                    <h2 className="card-title">Admin Portal</h2>
                    <p className="text-secondary">Security Personnel Only</p>
                </div>

                {error && <div className="text-danger text-center" style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid var(--danger)', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Admin Email</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@sentinel.com"
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Security Password</label>
                        <input
                            type="password"
                            required
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-secondary btn-full" style={{ backgroundColor: 'var(--danger)' }}>
                        {loading ? 'Verifying...' : 'Authorize Login'}
                    </button>
                </form>

                <p className="text-secondary text-center" style={{ marginTop: '1.5rem' }}>
                    Not an admin? <Link to="/login" className="text-primary">Standard Login</Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
