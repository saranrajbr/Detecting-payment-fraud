import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Settings, ShieldAlert, FileText, Download } from 'lucide-react';

const AdminPanel = () => {
    const [threshold, setThreshold] = useState(0.7);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const { data } = await API.get('/transaction');
            setLogs(data);
        } catch (err) {
            console.error('Error fetching logs', err);
        }
    };

    const handleUpdateThreshold = async () => {
        try {
            // Simulation of threshold update
            alert(`Fraud threshold updated to ${threshold}`);
        } catch (err) {
            console.error('Error updating threshold', err);
        }
    };

    const handleExportCSV = () => {
        if (logs.length === 0) {
            alert('No data to export.');
            return;
        }

        const headers = [
            'Date', 'Time', 'User ID', 'Amount ($)', 'Location', 'Device Type',
            'Merchant Category', 'Mobile Number', 'Circle', 'ML Risk Score',
            'Rule Risk Score', 'Final Risk Score (%)', 'Is Fraud', 'Action Taken'
        ];

        const rows = logs.map(log => {
            const userId = typeof log.userId === 'string'
                ? log.userId
                : log.userId?._id || 'N/A';
            const date = new Date(log.createdAt);
            return [
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                userId,
                log.amount,
                log.location || '',
                log.deviceType || '',
                log.merchantCategory || '',
                log.mobileNumber || '',
                log.circle || '',
                (log.mlRiskScore ?? 0).toFixed(4),
                (log.ruleRiskScore ?? 0).toFixed(2),
                ((log.finalRiskScore ?? 0) * 100).toFixed(0),
                log.isFraud ? 'Yes' : 'No',
                log.actionTaken || ''
            ].map(v => `"${String(v).replace(/"/g, '""')}"`);
        });

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fraud_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <h1 className="content-title">Admin Control Panel</h1>

            <div className="data-grid admin-grid">
                <div className="card">
                    <h3 className="card-title">
                        <Settings size={20} />
                        System Configuration
                    </h3>
                    <div className="form-group threshold-config">
                        <label className="form-label">Fraud Decision Threshold</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            className="form-range"
                            value={threshold}
                            onChange={(e) => setThreshold(e.target.value)}
                        />
                        <div className="threshold-labels">
                            <span>Highly Sensitive (0.0)</span>
                            <span className="text-primary" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{threshold}</span>
                            <span>More Lenient (1.0)</span>
                        </div>
                    </div>
                    <button
                        onClick={handleUpdateThreshold}
                        className="btn-primary btn-full">
                        Save Configuration
                    </button>
                </div>

                <div className="card overflow-hidden">
                    <div className="card-header">
                        <h3 className="card-title no-margin">
                            <FileText size={20} />
                            System Audit Logs
                        </h3>
                        <button className="btn-primary btn-small" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>

                    <div className="scroll-table">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>User ID</th>
                                    <th>Amount</th>
                                    <th>Risk</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log._id}>
                                        <td>{new Date(log.createdAt).toLocaleTimeString()}</td>
                                        <td className="text-secondary">{typeof log.userId === "string" ? log.userId.substring(0, 8) + "..." : log.userId?._id ? log.userId._id.substring(0, 8) + "..." : "N/A"}</td>

                                        <td>${log.amount}</td>
                                        <td className={log.isFraud ? 'text-danger' : 'text-success'}>
                                            {((log.finalRiskScore ?? 0) * 100).toFixed(0)}%
                                        </td>
                                        <td>{log.actionTaken}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
