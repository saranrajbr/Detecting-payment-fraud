import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const ProfilePage = () => {
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
        window.location.href = '/login';
    };

    if (loading) return <div className="page-container"><div className="loading-spinner">Loading Profile...</div></div>;
    if (error) return <div className="page-container"><div className="error-banner">{error}</div></div>;

    return (
        <div className="page-container animate-fade-in">
            <h1 className="content-title">Secured Account Profile</h1>

            <div className="card profile-card">
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
                    <InfoRow icon={<Shield size={20} />} label="Authentication Status" value="JWT Verified" color="var(--success)" />
                </div>

                <div className="profile-actions">
                    <button className="btn-secondary" onClick={() => alert('Password update feature coming soon.')}>Change Password</button>
                    <button className="btn-danger" onClick={handleLogout}>Log Out Securely</button>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value, color }) => (
    <div className="info-row">
        <div className="info-icon-box">{icon}</div>
        <div className="info-content">
            <label className="info-label">{label}</label>
            <div className="info-value" style={{ color: color || 'white' }}>{value}</div>
        </div>
    </div>
);

export default ProfilePage;
