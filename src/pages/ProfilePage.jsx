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

    if (loading) return <div className="page-container"><div className="loading-spinner">Loading Profile...</div></div>;
    if (error) return <div className="page-container"><div className="error-banner">{error}</div></div>;

    return (
        <div className="page-container animate-fade-in">
            <h1 className="content-title">User Profile</h1>

            <div className="card profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <User size={48} color="var(--accent-primary)" />
                    </div>
                    <div>
                        <h2 className="profile-name">{profile.name}</h2>
                        <span className={`badge ${profile.role === 'admin' ? 'badge-danger' : 'badge-success'}`}>
                            {profile.role.toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-item">
                        <Mail size={20} className="detail-icon" />
                        <div>
                            <div className="detail-label">Email Address</div>
                            <div className="detail-value">{profile.email}</div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <Shield size={20} className="detail-icon" />
                        <div>
                            <div className="detail-label">Account Security</div>
                            <div className="detail-value">Active (Role-Based Access)</div>
                        </div>
                    </div>

                    <div className="detail-item">
                        <Calendar size={20} className="detail-icon" />
                        <div>
                            <div className="detail-label">Member Since</div>
                            <div className="detail-value">{new Date(profile.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="btn-secondary">Update Password</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
