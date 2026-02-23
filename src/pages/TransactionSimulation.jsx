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

    // ─── Mobile Intelligence Engine v3.0 ──────────────────────────────────────
    // Maps 4-digit prefixes to { operator, circle } based on TRAI allocations
    const getMobileInfo = (number) => {
        const p4 = number.substring(0, 4);
        const p3 = number.substring(0, 3);
        const p2 = number.substring(0, 2);
        const first = parseInt(number[0]);

        // Invalid: Indian mobile numbers must start with 6-9
        if (first < 6) return { operator: 'Invalid', circle: 'Unknown', isVoip: false, status: 'Invalid Format' };

        // ── Jio (Reliance) – covers most of the 6x series and some 7x/8x ──
        const jioMap = {
            '600': 'Andhra Pradesh', '601': 'Delhi', '602': 'Tamil Nadu',
            '603': 'Maharashtra', '604': 'Karnataka', '605': 'UP East',
            '606': 'Rajasthan', '607': 'West Bengal', '608': 'MP',
            '609': 'Kerala',
            '620': 'Tamil Nadu', '621': 'Delhi', '622': 'AP',
            '623': 'Gujarat', '624': 'Bihar', '625': 'Rajasthan',
            '626': 'Karnataka', '627': 'UP East', '628': 'MP',
            '629': 'West Bengal',
            '630': 'Tamil Nadu', '631': 'Andhra Pradesh', '632': 'Kerala',
            '633': 'Tamil Nadu', '634': 'Maharashtra', '635': 'Karnataka',
            '636': 'Gujarat', '637': 'UP East', '638': 'Rajasthan',
            '639': 'West Bengal',
            '700': 'Delhi', '701': 'Maharashtra', '702': 'Karnataka',
            '703': 'Tamil Nadu', '704': 'AP', '705': 'UP West',
            '706': 'Gujarat', '707': 'Rajasthan', '708': 'Kerala',
            '709': 'Punjab',
            '800': 'Delhi', '801': 'UP East', '802': 'MP',
            '803': 'Bihar', '804': 'Karnataka', '805': 'Rajasthan',
            '806': 'Tamil Nadu', '807': 'Haryana', '808': 'Maharashtra',
            '809': 'AP',
            '890': 'Tamil Nadu', '891': 'AP', '892': 'Karnataka',
            '893': 'Odisha', '894': 'Bihar',
        };
        if (jioMap[p3]) return { operator: 'Jio', circle: jioMap[p3], isVoip: false, status: null };
        if (p2 === '60' || p2 === '61' || p2 === '62' || p2 === '63' || p2 === '64' || p2 === '65' || p2 === '66')
            return { operator: 'Jio', circle: 'Pan-India (Jio)', isVoip: false, status: null };

        // ── Airtel ──
        const airtelMap = {
            '9810': 'Delhi NCR', '9811': 'Delhi NCR', '9871': 'Delhi NCR', '9999': 'Delhi NCR',
            '9820': 'Mumbai', '9821': 'Mumbai', '9833': 'Mumbai',
            '9840': 'Tamil Nadu', '9841': 'Tamil Nadu', '9884': 'Tamil Nadu',
            '9845': 'Karnataka', '9880': 'Karnataka',
            '9848': 'AP', '9866': 'AP',
            '9447': 'Kerala', '9446': 'Kerala',
            '9830': 'West Bengal', '9831': 'West Bengal',
            '9426': 'Gujarat', '9925': 'Gujarat',
            '9413': 'Rajasthan', '9414': 'Rajasthan',
            '9415': 'UP East', '9412': 'UP East',
            '9426': 'Gujarat',
            '9815': 'Punjab', '9814': 'Punjab',
            '9812': 'Haryana', '9813': 'Haryana',
            '9430': 'Bihar', '9939': 'Bihar',
            '9816': 'Himachal Pradesh',
            '9437': 'Odisha', '9435': 'Assam',
            '9882': 'J&K',
        };
        if (airtelMap[p4]) return { operator: 'Airtel', circle: airtelMap[p4], isVoip: false, status: null };
        if (p2 === '98' || p2 === '94') return { operator: 'Airtel', circle: 'Pan-India (Airtel)', isVoip: false, status: null };

        // ── Vi (Vodafone-Idea) ──
        const viMap = {
            '9212': 'Delhi NCR', '9911': 'Delhi NCR',
            '9819': 'Mumbai', '9322': 'Mumbai',
            '9942': 'Tamil Nadu', '9003': 'Tamil Nadu',
            '9886': 'Karnataka', '9844': 'Karnataka',
            '9949': 'Telangana',
            '8129': 'Kerala', '9496': 'Kerala',
            '9007': 'West Bengal',
            '9712': 'Gujarat', '9427': 'Gujarat',
            '9829': 'Rajasthan',
            '9839': 'UP West',
            '9826': 'MP',
            '9878': 'Punjab',
            '9872': 'Punjab',
        };
        if (viMap[p4]) return { operator: 'Vi (Vodafone-Idea)', circle: viMap[p4], isVoip: false, status: null };
        if (p2 === '99' || p2 === '82' || (p2 >= '70' && p2 <= '79'))
            return { operator: 'Vi (Vodafone-Idea)', circle: 'Pan-India (Vi)', isVoip: false, status: null };

        // ── BSNL ──
        if (p2 === '94' || p2 === '87' || p2 === '85')
            return { operator: 'BSNL', circle: 'Pan-India (BSNL)', isVoip: false, status: null };

        // ── VoIP ──
        if (['100', '000'].some(v => number.startsWith(v)))
            return { operator: 'VoIP/Virtual', circle: 'Unknown', isVoip: true, status: 'Flagged' };

        return { operator: 'Unknown Operator', circle: 'Other Circle', isVoip: false, status: null };
    };

    const handleMobileChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData({ ...formData, mobileNumber: value });

        if (value.length === 10) {
            setEngineStatus('Analyzing');
            setTimeout(() => {
                const { operator, circle, isVoip, status } = getMobileInfo(value);
                const isInvalid = operator === 'Invalid';

                // Status: digit sum mod 5 → ~80% Active
                const digitSum = value.split('').reduce((a, d) => a + parseInt(d), 0);
                const mobileStatus = status || (digitSum % 5 === 0 ? 'Inactive' : 'Active');

                setFormData(prev => ({ ...prev, circle, mobileStatus, isVoip, operator }));
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
                            <div className="engine-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                <div className="engine-item">
                                    <label>Operator</label>
                                    <div className="engine-val" style={{ color: 'var(--accent-primary)' }}>
                                        {engineStatus === 'Verified' ? (formData.operator || '---') : '---'}
                                    </div>
                                </div>
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
                                        {engineStatus === 'Verified' ? (formData.isVoip ? 'High-Risk' : 'Standard') : '---'}
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
