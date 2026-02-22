import React, { useState } from 'react';
import API from '../services/api';
import { CreditCard, MapPin, Smartphone, ShoppingBag, ShieldCheck } from 'lucide-react';

const TransactionSimulation = () => {
    const [formData, setFormData] = useState({
        amount: '',
        location: 'Chennai, India',
        deviceType: 'iPhone 15',
        merchantCategory: 'UPI Payment',
        ipAddress: '103.117.20.1',
        paymentMethod: 'UPI',
        transactionTime: 'Noon'
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
            <h1 className="content-title">Fraud Detection Simulator (India Focus)</h1>

            <div className="sim-grid">
                <div className="card">
                    <h3 className="card-title">Transaction Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Amount (₹)</label>
                            <input
                                type="number"
                                required
                                className="form-input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="Enter amount in INR"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <select className="form-input" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}>
                                <optgroup label="India">
                                    <option value="Chennai, India">Chennai, India</option>
                                    <option value="Mumbai, India">Mumbai, India</option>
                                    <option value="Delhi, India">Delhi, India</option>
                                    <option value="Bangalore, India">Bangalore, India</option>
                                    <option value="Hyderabad, India">Hyderabad, India</option>
                                    <option value="Kolkata, India">Kolkata, India</option>
                                    <option value="Pune, India">Pune, India</option>
                                    <option value="Ahmedabad, India">Ahmedabad, India</option>
                                </optgroup>
                                <optgroup label="International">
                                    <option value="New York, USA">New York, USA</option>
                                    <option value="London, UK">London, UK</option>
                                    <option value="Dubai, UAE">Dubai, UAE</option>
                                    <option value="Singapore">Singapore</option>
                                    <option value="Paris, France">Paris, France</option>
                                    <option value="Berlin, Germany">Berlin, Germany</option>
                                </optgroup>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">IP Address</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.ipAddress}
                                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                                placeholder="e.g. 103.117.x.x"
                            />
                            <small className="help-text">Indian IPs: 49.x, 103.x, 106.x, 117.x</small>
                        </div>

                        <div className="form-group-row">
                            <div className="form-group">
                                <label className="form-label">Payment Method</label>
                                <select className="form-input" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                                    <option value="UPI">UPI (BHIM/GPay/PhonePe)</option>
                                    <option value="Rupay">Rupay Card</option>
                                    <option value="Visa">Visa Card</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="Net Banking">Net Banking</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Transaction Time</label>
                                <select className="form-input" value={formData.transactionTime} onChange={(e) => setFormData({ ...formData, transactionTime: e.target.value })}>
                                    <option value="Morning">Morning (6 AM - 12 PM)</option>
                                    <option value="Noon">Noon (12 PM - 6 PM)</option>
                                    <option value="Night">Night (6 PM - 12 AM)</option>
                                    <option value="Late Night">Late Night (12 AM - 6 AM)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Device & Terminal</label>
                            <select className="form-input" value={formData.deviceType} onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}>
                                <option value="Mobile App (iOS/Android)">Mobile App (iOS/Android)</option>
                                <option value="Web Browser">Desktop Browser</option>
                                <option value="POS Terminal">POS Terminal</option>
                                <option value="Emulator">Emulator (High Risk)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
                        >
                            {loading ? 'Analyzing Securely...' : 'Run Proper Risk Analysis'}
                        </button>
                    </form>
                </div>

                <div>
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
