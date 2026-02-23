import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import API from '../services/api';
import { Activity, ShieldAlert, Percent, List } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalTransactions: 0, fraudulentTransactions: 0, fraudRate: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsRes, transRes] = await Promise.all([
                API.get('/transaction/stats'),
                API.get('/transaction')
            ]);

            if (statsRes && statsRes.data) {
                setStats(statsRes.data);
            }

            if (transRes && Array.isArray(transRes.data)) {
                setTransactions(transRes.data.slice(0, 10));
            } else {
                setTransactions([]);
            }
        } catch (err) {
            console.error('Error fetching dashboard data', err);
            setError('Failed to load transaction data. Please ensure you are logged in as an Admin.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-container"><div className="loading-spinner">Loading Secure Data...</div></div>;
    if (error) return <div className="page-container"><div className="error-banner">{error}</div><button onClick={fetchData} className="btn-secondary">Retry</button></div>;

    const chartData = {
        labels: ['Safe', 'Fraudulent'],
        datasets: [{
            label: 'Transactions',
            data: [stats.totalTransactions - stats.fraudulentTransactions, stats.fraudulentTransactions],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0,
        }]
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    return (
        <div className="page-container animate-fade-in">
            <h1 className="content-title">
                {isAdmin ? 'Admin Intelligence Dashboard' : 'My Security Dashboard'}
            </h1>

            <div className="stat-grid">
                <StatCard
                    icon={<Activity color="var(--accent-primary)" />}
                    label={isAdmin ? "Total System Activity" : "My Recent Activity"}
                    value={stats.totalTransactions}
                />
                <StatCard
                    icon={<ShieldAlert color="var(--danger)" />}
                    label={isAdmin ? "Total Flagged Fraud" : "My Flagged Alerts"}
                    value={stats.fraudulentTransactions}
                />
                <StatCard
                    icon={<Percent color="var(--warning)" />}
                    label="Risk Index"
                    value={`${stats.fraudRate}%`}
                />
            </div>

            <div className="data-grid responsive-grid">
                <div className="card full-width-mobile">
                    <h3 className="card-title">
                        <List size={20} />
                        {isAdmin ? 'Recent Global Transactions' : 'My Recent Transactions'}
                    </h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    {isAdmin && <th>User</th>}
                                    <th>Amount (₹)</th>
                                    <th>Mobile</th>
                                    <th>Location</th>
                                    <th>Risk Rating</th>
                                    <th>Verdict</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? transactions.map((t) => (
                                    <tr key={t._id}>
                                        {isAdmin && (
                                            <td>
                                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t.userId?.name || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.userId?.email || ''}</div>
                                            </td>
                                        )}
                                        <td style={{ fontWeight: 'bold' }}>₹{Number(t.amount || 0).toLocaleString('en-IN')}</td>
                                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.mobileNumber ? `+91 ${t.mobileNumber}` : '---'}</td>
                                        <td>{t.location}</td>
                                        <td>{Math.round((t.finalRiskScore || 0) * 100)}%</td>
                                        <td>
                                            <span className={`badge ${t.actionTaken === 'Approve' ? 'badge-success' :
                                                t.actionTaken === 'Block' ? 'badge-danger' : 'badge-warning'
                                                }`}>
                                                {t.actionTaken || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={isAdmin ? '6' : '4'} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No recent activity detected.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Fraud Probability Ratio</h3>
                    <div className="chart-container">
                        <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 12 } } } } }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
    <div className="card stat-card">
        <div className="stat-icon">{icon}</div>
        <div>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
        </div>
    </div>
);

export default Dashboard;
