import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, TrendingUp, BrainCircuit, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

const OutletAnalytics = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const outletId = state?.outletId;

    const [analytics, setAnalytics] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [resAnalytics, resPredictions] = await Promise.all([
                api.get(`/analytics/outlet/${outletId}`),
                api.get(`/analytics/predictions/outlet/${outletId}`)
            ]);
            setAnalytics(resAnalytics.data);
            setPredictions(resPredictions.data.insights);
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

                {/* AI Demand Forecast Section */}
                {predictions && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 className="heading-3 flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                            <BrainCircuit size={24} color="#8b5cf6" /> 
                            <span style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                                AI Demand Forecast
                            </span>
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            {predictions.map((insight, idx) => {
                                let icon = <Lightbulb size={24} color="#3b82f6" />;
                                let color = '#3b82f6';
                                let bg = 'rgba(59,130,246,0.1)';
                                
                                if (insight.type === 'warning') {
                                    icon = <AlertTriangle size={24} color="#f59e0b" />;
                                    color = '#f59e0b';
                                    bg = 'rgba(245,158,11,0.1)';
                                } else if (insight.type === 'success') {
                                    icon = <CheckCircle2 size={24} color="#10b981" />;
                                    color = '#10b981';
                                    bg = 'rgba(16,185,129,0.1)';
                                }

                                return (
                                    <div key={idx} className="card shadow-md animate-slide-up" style={{ 
                                        animationDelay: `${idx * 0.1}s`, 
                                        borderTop: `4px solid ${color}`,
                                        display: 'flex', flexDirection: 'column', padding: '1.5rem'
                                    }}>
                                        <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                                            <div style={{ background: bg, padding: '0.75rem', borderRadius: '50%' }}>
                                                {icon}
                                            </div>
                                            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark)' }}>{insight.title}</h4>
                                        </div>
                                        <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>
                                            {insight.description}
                                        </p>
                                        <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${color}` }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)' }}>⚡ ACTION:</p>
                                            <p style={{ fontSize: '0.9rem', color: color, fontWeight: 500, marginTop: '0.25rem' }}>{insight.action}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

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
