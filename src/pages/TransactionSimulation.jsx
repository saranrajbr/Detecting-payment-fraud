import React, { useState } from 'react';
import API from '../services/api';
import { CreditCard, MapPin, Smartphone, ShoppingBag, ShieldCheck } from 'lucide-react';

const TransactionSimulation = () => {
    const [formData, setFormData] = useState({
        amount: '',
        location: 'New York, USA',
        deviceType: 'MacBook Pro',
        merchantCategory: 'E-commerce',
        ipAddress: '192.168.1.1'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const { data } = await API.post('/transaction', formData);
            setResult(data);
        } catch (err) {
            console.error('Simulation error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 className="content-title">Simulate Transaction</h1>

            <div className="sim-grid">
                <div className="card">
                    <h3 className="card-title">Transaction Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Amount ($)</label>
                            <input
                                type="number"
                                required
                                className="form-input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <select className="form-input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}>
                                <option value="New York, USA">New York, USA</option>
                                <option value="London, UK">London, UK</option>
                                <option value="Dubai, UAE">Dubai, UAE</option>
                                <option value="Unknown">Unknown (High Risk)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Device Type</label>
                            <select className="form-input" value={formData.deviceType} onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}>
                                <option value="iPhone 15">iPhone 15</option>
                                <option value="MacBook Pro">MacBook Pro</option>
                                <option value="Android Phone">Android Phone</option>
                                <option value="Emulator">Emulator (High Risk)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Merchant Category</label>
                            <select className="form-input" value={formData.merchantCategory} onChange={(e) => setFormData({ ...formData, merchantCategory: e.target.value })}>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Food & Dining">Food & Dining</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Crypto Exchange">Crypto Exchange</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
                        >
                            {loading ? 'Processing...' : 'Run Detection'}
                        </button>
                    </form>
                </div>

                <div>
                    {result ? (
                        <div className="card result-card" style={{ borderColor: result.isFraud ? 'var(--danger)' : 'var(--success)' }}>
                            <h3 className="card-title">
                                <ShieldCheck color={result.isFraud ? 'var(--danger)' : 'var(--success)'} />
                                Detection Result
                            </h3>

                            <div className="risk-score-display">
                                <div className="risk-value" style={{ color: result.isFraud ? 'var(--danger)' : 'var(--success)' }}>
                                    {Math.round(result.finalRiskScore * 100)}%
                                </div>
                                <div className="text-secondary">Risk Probability</div>
                            </div>

                            <div className="result-details">
                                <ResultItem label="ML Score" value={result.mlRiskScore.toFixed(4)} />
                                <ResultItem label="Rule Score" value={result.ruleRiskScore.toFixed(2)} />
                                <ResultItem
                                    label="Final Status"
                                    value={result.isFraud ? 'FRAUDULENT' : 'LEGITIMATE'}
                                    bold
                                    color={result.isFraud ? 'var(--danger)' : 'var(--success)'}
                                />
                                <div className="action-badge">
                                    Action: {result.actionTaken.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card empty-result">
                            <ShieldCheck size={48} className="shield-icon-muted" />
                            <p>Submit transaction details to see the fraud detection analysis in real-time.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ResultItem = ({ label, value, bold, color }) => (
    <div className="result-item">
        <span className="text-secondary">{label}</span>
        <span style={{ fontWeight: bold ? 'bold' : 'normal', color: color || 'white' }}>{value}</span>
    </div>
);

export default TransactionSimulation;
