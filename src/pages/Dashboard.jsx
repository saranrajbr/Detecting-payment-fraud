import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import API from '../services/api';
import { Activity, ShieldAlert, Percent, List } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalTransactions: 0, fraudulentTransactions: 0, fraudRate: 0 });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsRes = await API.get('/transaction/stats');
            const transRes = await API.get('/transaction');
            setStats(statsRes.data);
            setTransactions(transRes.data.slice(0, 10)); // Show last 10
        } catch (err) {
            console.error('Error fetching dashboard data', err);
        }
    };

    const chartData = {
        labels: ['Safe', 'Fraudulent'],
        datasets: [{
            label: 'Transactions',
            data: [stats.totalTransactions - stats.fraudulentTransactions, stats.fraudulentTransactions],
            backgroundColor: ['#10b981', '#ef4444'],
            borderWidth: 0,
        }]
    };

    return (
        <div>
            <h1 className="content-title">Dashboard Overview</h1>

            <div className="stat-grid">
                <StatCard icon={<Activity color="var(--accent-primary)" />} label="Total Transactions" value={stats.totalTransactions} />
                <StatCard icon={<ShieldAlert color="var(--danger)" />} label="Fraudulent" value={stats.fraudulentTransactions} />
                <StatCard icon={<Percent color="var(--warning)" />} label="Fraud Rate" value={`${stats.fraudRate}%`} />
            </div>

            <div className="data-grid">
                <div className="card">
                    <h3 className="card-title">Recent Transactions</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Location</th>
                                <th>Risk Score</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t._id}>
                                    <td>${t.amount}</td>
                                    <td>{t.location}</td>
                                    <td>{t.finalRiskScore.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${t.actionTaken === 'Approve' ? 'badge-success' :
                                                t.actionTaken === 'Block' ? 'badge-danger' : 'badge-warning'
                                            }`}>
                                            {t.actionTaken}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3 className="card-title">Fraud Ratio</h3>
                    <div className="chart-container">
                        <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }} />
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
