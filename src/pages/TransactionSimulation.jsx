import React, { useState } from 'react';
import API from '../services/api';
import { CreditCard, MapPin, Smartphone, ShoppingBag, ShieldCheck } from 'lucide-react';

const TransactionSimulation = () => {
    const [formData, setFormData] = useState({
        amount: '',
        location: 'Chennai, India',
        deviceType: 'Mobile App (iPhone 15)',
        merchantCategory: 'UPI Payment',
        mobileNumber: '',
        mobileStatus: 'Active',
        circle: 'Tamil Nadu',
        isVoip: false,
        paymentMethod: 'UPI',
        transactionTime: 'Noon'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const { data } = await API.post('/transaction', formData);
            setResult(data);
        } catch (err) {
            console.error('Simulation error', err);
            const msg = err.response?.data?.details || err.response?.data?.error || 'Server error. Please check your backend logs.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 className="content-title">Mobile-First Fraud Analysis Engine</h1>

            <div className="sim-grid">
                <div className="card">
                    <h3 className="card-title">Transaction & Subscriber Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label className="form-label">Amount (₹)</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mobile Number</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input"
                                    value={formData.mobileNumber}
                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

                        <div className="form-group-row">
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <select className="form-input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}>
                                    <option value="Chennai, India">Chennai, India</option>
                                    <option value="Mumbai, India">Mumbai, India</option>
                                    <option value="Delhi, India">Delhi, India</option>
                                    <option value="Bangalore, India">Bangalore, India</option>
                                    <option value="International/VPN">International/VPN</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Telecom Circle</label>
                                <select className="form-input" value={formData.circle} onChange={(e) => setFormData({ ...formData, circle: e.target.value })}>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Delhi NCR">Delhi NCR</option>
                                    <option value="Karnataka">Karnataka</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group-row">
                            <div className="form-group">
                                <label className="form-label">Subscriber Status</label>
                                <select className="form-input" value={formData.mobileStatus} onChange={(e) => setFormData({ ...formData, mobileStatus: e.target.value })}>
                                    <option value="Active">Active (Live)</option>
                                    <option value="Inactive">Inactive (Suspended)</option>
                                    <option value="Ported Recently">Ported Recently</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">VoIP Detection</label>
                                <select className="form-input" value={formData.isVoip} onChange={(e) => setFormData({ ...formData, isVoip: e.target.value === 'true' })}>
                                    <option value="false">Real SIM Card</option>
                                    <option value="true">VoIP / Virtual Number</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group-row">
                            <div className="form-group">
                                <label className="form-label">Payment Method</label>
                                <select className="form-input" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                                    <option value="UPI">UPI (BHIM/GPay)</option>
                                    <option value="Rupay">Rupay Card</option>
                                    <option value="Visa">Visa Card</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Terminal Info</label>
                                <select className="form-input" value={formData.deviceType} onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}>
                                    <option value="Mobile App (iPhone)">Mobile App (iPhone)</option>
                                    <option value="Mobile App (Android)">Mobile App (Android)</option>
                                    <option value="Emulator">Emulator (High Risk)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
                        >
                            {loading ? 'Analyzing Securely...' : 'Run Depth Verification'}
                        </button>
                    </form>
                </div>

                <div>
                    {error && (
                        <div className="card result-card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', marginBottom: '1rem' }}>
                            <h3 className="card-title" style={{ color: 'var(--danger)' }}>⚠️ Proper Deployment Error</h3>
                            <p className="small">{error}</p>
                            <p className="small" style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.8 }}>
                                💡 Tip: Ensure <strong>MONGODB_URI</strong> is added to Vercel Environment Variables.
                            </p>
                        </div>
                    )}

                    {result ? (
                        <div className="card result-card" style={{ borderColor: result.isFraud ? 'var(--danger)' : 'var(--success)' }}>
                            <h3 className="card-title">
                                <ShieldCheck color={result.isFraud ? 'var(--danger)' : 'var(--success)'} />
                                Proper Risk Analysis Result
                            </h3>

                            <div className="risk-score-display">
                                <div className="risk-value" style={{ color: result.isFraud ? 'var(--danger)' : 'var(--success)' }}>
                                    {Math.round(result.finalRiskScore * 100)}%
                                </div>
                                <div className="text-secondary">Composite Risk Score</div>
                            </div>

                            <div className="result-details">
                                <div className="risk-breakdown-section">
                                    <h4 className="detail-subtitle">Proper Analysis Breakdown</h4>
                                    {result.mlBreakdown && Object.keys(result.mlBreakdown).length > 0 ? (
                                        Object.entries(result.mlBreakdown).map(([factor, impact]) => (
                                            <div key={factor} className="breakdown-item">
                                                <span>{factor}</span>
                                                <span className="impact-text">+{Math.round(impact * 100)}%</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-secondary small">No significant risk factors detected.</p>
                                    )}
                                </div>

                                <div className="status-divider"></div>

                                <ResultItem
                                    label="Overall Verdict"
                                    value={result.isFraud ? 'SUSPICIOUS / FRAUD' : 'SAFE / LEGITIMATE'}
                                    bold
                                    color={result.isFraud ? 'var(--danger)' : 'var(--success)'}
                                />
                                <div className="action-badge" style={{ backgroundColor: result.isFraud ? 'rgba(255, 71, 71, 0.1)' : 'rgba(0, 230, 118, 0.1)' }}>
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
