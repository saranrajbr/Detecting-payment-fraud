import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/profile');
                setProfile(data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                setError('Could not load profile details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [updating, setUpdating] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMsg({ type: '', text: '' });
        try {
            await API.patch('/auth/update-password', passwords);
            setMsg({ type: 'success', text: 'Security key updated successfully!' });
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update password' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="page-container"><div className="loading-spinner">Loading Profile...</div></div>;
    if (error) return <div className="page-container"><div className="error-banner">{error}</div></div>;

    return (
        <div className="page-container animate-fade-in">
            <h1 className="content-title">Secured Account Profile</h1>

            <div className="profile-layout-grid">
                <div className="card profile-card no-padding">
                    <div className="profile-hero">
                        <div className="avatar-wrapper">
                            <User size={64} className="hero-avatar-icon" />
                        </div>
                        <div className="hero-text">
                            <h2 className="profile-name">{profile.name}</h2>
                            <div className={`role-tag ${profile.role}`}>
                                <Shield size={14} style={{ marginRight: '6px' }} />
                                {profile.role.toUpperCase()} ACCESS
                            </div>
                        </div>
                    </div>

                    <div className="profile-info-grid">
                        <InfoRow icon={<Mail size={20} />} label="Registered Email" value={profile.email} />
                        <InfoRow icon={<Calendar size={20} />} label="Security Activated" value={new Date(profile.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                        <InfoRow icon={<Shield size={20} />} label="Authentication Status" value="JWT Verified" badge="success" />
                    </div>

                    <div className="profile-footer">
                        <button className="btn-danger-ghost" onClick={handleLogout}>Log Out Securely</button>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Security Settings</h3>
                    <p className="small text-secondary mb-4">Update your account password regularly to stay protected.</p>

                    <form onSubmit={handlePasswordChange}>
                        {msg.text && (
                            <div className={`alert-banner ${msg.type}`} style={{ marginBottom: '1.5rem' }}>
                                {msg.text}
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label text-dark">Current Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label text-dark">New Secure Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" disabled={updating} className="btn-primary btn-full">
                            {updating ? 'Updating Key...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value, badge }) => (
    <div className="info-row high-contrast">
        <div className="info-icon-box">{icon}</div>
        <div className="info-content">
            <label className="info-label">{label}</label>
            <div className="info-value text-dark">{value}</div>
        </div>
        {badge && <span className={`mini-badge ${badge}`}>{badge}</span>}
    </div>
);

export default ProfilePage;
