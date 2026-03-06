import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Activity, Users, Store, DollarSign, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [pendingOutlets, setPendingOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate('/');

        const fetchData = async () => {
            try {
                const [analyticsRes, pendingRes] = await Promise.all([
                    api.get('/admin/analytics'),
                    api.get('/outlets/admin/pending'),
                ]);
                setAnalytics(analyticsRes.data);
                setPendingOutlets(pendingRes.data);
            } catch (error) {
                console.error("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleApproval = async (outletId, approve) => {
        try {
            await api.put(`/outlets/${outletId}/approve`, { approve });
            setPendingOutlets(prev => prev.filter(o => o._id !== outletId));
        } catch (error) {
            alert("Failed to update approval status");
        }
    };

    if (loading) return <div className="text-center" style={{ marginTop: '5rem' }}>Loading Admin Console...</div>;

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
                <h2 className="heading-2" style={{ marginBottom: '2rem' }}>Admin Console</h2>

                {/* Top KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ marginBottom: '3rem' }}>
                    <div className="card text-center">
                        <div className="flex justify-center" style={{ marginBottom: '1rem', color: 'var(--primary)' }}><Activity size={32} /></div>
                        <h3 className="heading-2">{analytics?.totalOrders || 0}</h3>
                        <p className="text-muted">Total Orders</p>
                    </div>
                    <div className="card text-center">
                        <div className="flex justify-center" style={{ marginBottom: '1rem', color: 'var(--secondary)' }}><DollarSign size={32} /></div>
                        <h3 className="heading-2">₹{analytics?.totalRevenue || 0}</h3>
                        <p className="text-muted">Platform Revenue</p>
                    </div>
                    <div className="card text-center">
                        <div className="flex justify-center" style={{ marginBottom: '1rem', color: 'var(--warning)' }}><Users size={32} /></div>
                        <h3 className="heading-2">{analytics?.totalUsers || 0}</h3>
                        <p className="text-muted">Registered Users</p>
                    </div>
                    <div className="card text-center">
                        <div className="flex justify-center" style={{ marginBottom: '1rem', color: 'var(--success)' }}><Store size={32} /></div>
                        <h3 className="heading-2">{analytics?.totalOutlets || 0}</h3>
                        <p className="text-muted">Active Outlets</p>
                    </div>
                </div>

                {/* Pending Outlet Approvals */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
                        <Clock size={24} color="var(--warning)" />
                        <h3 className="heading-3">Pending Outlet Approvals</h3>
                        {pendingOutlets.length > 0 && (
                            <span style={{ background: 'var(--warning)', color: 'white', borderRadius: 'var(--radius-full)', padding: '0.15rem 0.6rem', fontSize: '0.8rem', fontWeight: 700 }}>
                                {pendingOutlets.length}
                            </span>
                        )}
                    </div>

                    {pendingOutlets.length === 0 ? (
                        <p className="text-muted">No outlets waiting for approval. 🎉</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {pendingOutlets.map(outlet => (
                                <div key={outlet._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ background: 'var(--light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{outlet.name}</h4>
                                        <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                            Owner: {outlet.ownerId?.name} ({outlet.ownerId?.email})
                                        </p>
                                        {outlet.location && <p className="text-muted" style={{ fontSize: '0.8rem' }}>📍 {outlet.location}</p>}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            className="btn flex items-center gap-2"
                                            style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)' }}
                                            onClick={() => handleApproval(outlet._id, true)}
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button
                                            className="btn flex items-center gap-2"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                                            onClick={() => handleApproval(outlet._id, false)}
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* AI Analytics Module */}
                <div className="card flex flex-col md:flex-row gap-6 items-center" style={{ background: 'linear-gradient(135deg, rgba(255,90,95,0.05) 0%, rgba(0,166,153,0.05) 100%)', border: '1px solid var(--border)' }}>
                    <div style={{ flex: 1 }}>
                        <h3 className="heading-3 flex items-center gap-2 text-primary" style={{ marginBottom: '1rem' }}>
                            <TrendingUp size={24} /> AI Demand Forecasting
                        </h3>
                        <p className="text-muted" style={{ marginBottom: '1rem' }}>
                            Predicted demand per outlet based on historical order patterns.
                        </p>
                        {analytics?.aiPredictions && analytics.aiPredictions.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {analytics.aiPredictions.map((pred, i) => (
                                    <div key={i} className="flex justify-between items-center" style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                        <span style={{ fontWeight: 600 }}>{pred.outletId || pred.error}</span>
                                        {!pred.error && (
                                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                                                ~{pred.predictedOrders} orders today
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                No prediction data currently available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
