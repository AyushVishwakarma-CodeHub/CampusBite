import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const OutletAnalytics = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const outletId = state?.outletId;

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/analytics/outlet/${outletId}`);
            setAnalytics(res.data);
        } catch (error) {
            console.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'outlet') navigate('/');
        if (!outletId) navigate('/outlet/dashboard');
        fetchAnalytics();
    }, [user, navigate, outletId]);

    if (loading) return <div className="text-center" style={{ marginTop: '5rem' }}>Loading live analytics...</div>;
    if (!analytics) return <div className="text-center" style={{ marginTop: '5rem' }}>No data available.</div>;

    const { stats, topItems } = analytics;

    return (
        <div className="animate-fade-in" style={{ background: 'var(--light)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container" style={{ padding: '3rem 1.25rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="heading-2" style={{ margin: 0 }}>Real-Time Business Analytics</h2>
                    <button className="btn btn-outline" onClick={() => navigate('/outlet/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid md:grid-cols-4 gap-6" style={{ marginBottom: '3rem' }}>
                    
                    {/* Revenue Card */}
                    <div className="card shadow-md flex items-center gap-4" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <div style={{ background: 'rgba(255,90,95,0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <IndianRupee size={28} color="var(--primary)" />
                        </div>
                        <div>
                            <p className="text-muted text-sm font-semibold uppercase tracking-wider">Total Revenue</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
                                ₹{stats.totalRevenue.toLocaleString()}
                            </h3>
                        </div>
                    </div>

                    {/* Total Orders Card */}
                    <div className="card shadow-md flex items-center gap-4" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <ShoppingBag size={28} color="#3b82f6" />
                        </div>
                        <div>
                            <p className="text-muted text-sm font-semibold uppercase tracking-wider">Total Orders</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
                                {stats.totalOrders}
                            </h3>
                        </div>
                    </div>

                    {/* Completed Orders Card */}
                    <div className="card shadow-md flex items-center gap-4" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                        <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <CheckCircle size={28} color="#10b981" />
                        </div>
                        <div>
                            <p className="text-muted text-sm font-semibold uppercase tracking-wider">Completed</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
                                {stats.completedOrders}
                            </h3>
                        </div>
                    </div>

                    {/* Pending Orders Card */}
                    <div className="card shadow-md flex items-center gap-4" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ background: 'rgba(245,158,11,0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <Clock size={28} color="#f59e0b" />
                        </div>
                        <div>
                            <p className="text-muted text-sm font-semibold uppercase tracking-wider">Active Queue</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)', margin: 0 }}>
                                {stats.pendingOrders}
                            </h3>
                        </div>
                    </div>

                </div>

                {/* Top Selling Items Section */}
                <h3 className="heading-3 flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                    <TrendingUp size={24} color="var(--primary)" /> Top Performing Dishes
                </h3>

                <div className="card shadow-lg" style={{ overflow: 'hidden', padding: 0 }}>
                    {topItems.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray)' }}>
                            <p>No completed orders yet to generate popularity metrics.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '2px solid var(--border)' }}>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--dark)' }}>Dish Name</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--dark)' }}>Units Sold</th>
                                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--dark)' }}>Revenue Generated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topItems.map((item, idx) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,90,95,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>
                                            <span style={{ display: 'inline-block', width: '24px', color: idx === 0 ? 'var(--primary)' : 'var(--gray)' }}>#{idx + 1}</span> 
                                            {item.name}
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem', color: 'var(--dark)' }}>{item.totalQuantitySold}</td>
                                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: '#10b981' }}>₹{item.revenueGenerated.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OutletAnalytics;
