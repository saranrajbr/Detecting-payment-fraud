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
                        <button className="btn-logout btn-small">
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
                                        <td className="text-secondary">{typeof log.userId === "string"? log.userId.substring(0, 8) + "...": log.userId?._id? log.userId._id.substring(0, 8) + "...": "N/A"}</td>
                                        
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
