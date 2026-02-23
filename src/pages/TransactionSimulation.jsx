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
    const [engineStatus, setEngineStatus] = useState('Idle'); // Idle, Analyzing, Verified
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ─── TRAI Prefix Lookup Table (4-digit) ─────────────────────────────────
    const TRAI_PREFIX_MAP = {
        '9840': 'Tamil Nadu', '9841': 'Tamil Nadu', '9884': 'Tamil Nadu', '9894': 'Tamil Nadu',
        '9944': 'Tamil Nadu', '9003': 'Tamil Nadu', '8939': 'Tamil Nadu', '6382': 'Tamil Nadu',
        '9811': 'Delhi NCR', '9810': 'Delhi NCR', '9871': 'Delhi NCR', '9953': 'Delhi NCR',
        '9899': 'Delhi NCR', '9312': 'Delhi NCR', '8826': 'Delhi NCR', '9999': 'Delhi NCR',
        '9821': 'Mumbai', '9820': 'Mumbai', '9833': 'Mumbai', '8451': 'Mumbai',
        '7030': 'Maharashtra', '7031': 'Maharashtra', '8208': 'Maharashtra', '9075': 'Maharashtra',
        '9845': 'Karnataka', '9844': 'Karnataka', '9880': 'Karnataka', '9606': 'Karnataka',
        '9866': 'Andhra Pradesh', '9848': 'Andhra Pradesh', '8008': 'Andhra Pradesh',
        '9949': 'Telangana', '7013': 'Telangana', '8897': 'Telangana',
        '9447': 'Kerala', '9446': 'Kerala', '8129': 'Kerala', '7012': 'Kerala',
        '9830': 'West Bengal', '9831': 'West Bengal', '8013': 'West Bengal',
        '9426': 'Gujarat', '9925': 'Gujarat', '9974': 'Gujarat', '6359': 'Gujarat',
        '9413': 'Rajasthan', '9414': 'Rajasthan', '9829': 'Rajasthan',
        '9839': 'UP West', '9412': 'UP East', '9415': 'UP East', '7905': 'UP East',
        '9425': 'Madhya Pradesh', '9826': 'Madhya Pradesh', '9407': 'Chhattisgarh',
        '9815': 'Punjab', '9814': 'Punjab', '9812': 'Haryana', '9813': 'Haryana',
        '9939': 'Bihar', '9430': 'Bihar', '9437': 'Odisha', '9435': 'Assam',
        '9816': 'Himachal Pradesh', '9882': 'J&K', '7006': 'J&K',
    };
    const VOIP_PREFIXES = ['1000', '0001', '9560', '9400'];

    const handleMobileChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData({ ...formData, mobileNumber: value });

        if (value.length === 10) {
            setEngineStatus('Analyzing');
            setTimeout(() => {
                const firstDigit = parseInt(value[0]);
                const isInvalid = firstDigit < 6;

                // 4-digit prefix lookup → fallback to first digit
                const prefix4 = value.substring(0, 4);
                const circle = TRAI_PREFIX_MAP[prefix4]
                    || (firstDigit === 6 ? 'Jio Coverage Area' : 'Other Circle');

                // VoIP check
                const isVoip = VOIP_PREFIXES.some(p => value.startsWith(p));

                // Status: digit sum mod 5 → gives ~80% Active realistically
                const digitSum = value.split('').reduce((a, d) => a + parseInt(d), 0);
                const mobileStatus = isInvalid ? 'Invalid Format' : (digitSum % 5 === 0 ? 'Inactive' : 'Active');

                setFormData(prev => ({
                    ...prev,
                    circle: isInvalid ? 'Unknown' : circle,
                    mobileStatus,
                    isVoip
                }));
                setEngineStatus(isInvalid ? 'Invalid' : 'Verified');
            }, 900);
        } else {
            setEngineStatus('Idle');
        }
    };

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
            <h1 className="content-title">Mobile Verification Engine 2.0</h1>

            <div className="sim-grid">
                <div className="card">
                    <h3 className="card-title">Transaction & Subscriber Input</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Enter Mobile Number</label>
                            <div className="mobile-input-wrapper">
                                <span className="country-code">+91</span>
                                <input
                                    type="text"
                                    required
                                    className="form-input mobile-field"
                                    value={formData.mobileNumber}
                                    onChange={handleMobileChange}
                                    placeholder="98765 43210"
                                />
                                {engineStatus !== 'Idle' && (
                                    <div className={`engine-badge ${engineStatus.toLowerCase()}`}>
                                        {engineStatus === 'Analyzing' ? 'Scanning...' :
                                            engineStatus === 'Invalid' ? 'Format Error ✖' : 'Verified ✓'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Real-time Engine Results Displayed Below Number */}
                        <div className="engine-results-box animate-fade-in">
                            <div className="engine-header">
                                <Smartphone size={16} />
                                <span>Engine Insights</span>
                            </div>
                            <div className="engine-grid">
                                <div className="engine-item">
                                    <label>Circle</label>
                                    <div className="engine-val">{engineStatus === 'Verified' ? formData.circle : '---'}</div>
                                </div>
                                <div className="engine-item">
                                    <label>Status</label>
                                    <div className={`engine-val ${formData.mobileStatus === 'Active' ? 'text-success' : 'text-danger'}`}>
                                        {engineStatus === 'Verified' ? formData.mobileStatus : '---'}
                                    </div>
                                </div>
                                <div className="engine-item">
                                    <label>VoIP</label>
                                    <div className="engine-val">
                                        {engineStatus === 'Verified' ? (formData.isVoip ? 'High-Risk detected' : 'Standard Non-VoIP') : '---'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group-row" style={{ marginTop: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Transaction Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="form-input"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="e.g. 50000"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Auth Method</label>
                                <select className="form-input" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                                    <option value="UPI">UPI (BHIM/GPay)</option>
                                    <option value="Rupay">Rupay Card</option>
                                    <option value="Visa">Visa Card</option>
                                </select>
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
                                <label className="form-label">Device Info</label>
                                <select className="form-input" value={formData.deviceType} onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}>
                                    <option value="Mobile App (iPhone)">Mobile App (iPhone)</option>
                                    <option value="Mobile App (Android)">Mobile App (Android)</option>
                                    <option value="Emulator">Emulator (High Risk)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || engineStatus !== 'Verified'}
                            className={`btn-primary btn-full ${loading ? 'btn-loading' : ''}`}
                            style={{ marginTop: '1rem' }}
                        >
                            {loading ? 'Finalizing Fraud Analysis...' : 'Process Full Verification'}
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
