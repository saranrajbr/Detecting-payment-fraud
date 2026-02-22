import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, BarChart3, Zap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="hero">
            <h1>
                Protect Your Payments with <span className="text-primary">AI-Powered</span> Security
            </h1>
            <p>
                Real-time fraud detection using advanced machine learning models to keep your digital transactions safe and secure.
            </p>

            <div className="hero-btns">
                <Link to="/register" className="btn-primary btn-large">Get Started Free</Link>
                <Link to="/login" className="btn-secondary btn-large">Live Demo</Link>
            </div>

            <div className="feature-grid">
                <FeatureCard
                    icon={<Zap color="var(--accent-primary)" />}
                    title="Instant Detection"
                    desc="Analyze transactions in milliseconds using our high-performance ML microservice."
                />
                <FeatureCard
                    icon={<Shield color="var(--accent-primary)" />}
                    title="Advanced ML"
                    desc="Deep Learning models trained on millions of transaction patterns for maximum accuracy."
                />
                <FeatureCard
                    icon={<BarChart3 color="var(--accent-primary)" />}
                    title="Real-time Analytics"
                    desc="Monitor fraud trends and risk factors through our interactive dashboard."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card feature-card">
        <div className="form-group">{icon}</div>
        <h3 className="form-group">{title}</h3>
        <p className="text-secondary">{desc}</p>
    </div>
);

export default LandingPage;
