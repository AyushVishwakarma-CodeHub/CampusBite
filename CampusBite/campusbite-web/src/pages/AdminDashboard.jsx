import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Activity, Users, Store, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, PlusCircle, Network, Inbox } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [pendingOutlets, setPendingOutlets] = useState([]);
    const [activeOutlets, setActiveOutlets] = useState([]);
    const [partnerRequests, setPartnerRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newOutlet, setNewOutlet] = useState({ ownerName: '', email: '', password: '', outletName: '', location: '' });
    const [creationLoading, setCreationLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate('/');

        const fetchData = async () => {
            try {
                const [analyticsRes, pendingRes, activeRes, partnerRes] = await Promise.all([
                    api.get('/admin/analytics'),
                    api.get('/outlets/admin/pending'),
                    api.get('/outlets'),
                    api.get('/partner-requests')
                ]);
                setAnalytics(analyticsRes.data);
                setPendingOutlets(pendingRes.data);
                setActiveOutlets(activeRes.data);
                setPartnerRequests(partnerRes.data);
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
            if (approve) {
                const updatedActive = await api.get('/outlets');
                setActiveOutlets(updatedActive.data);
            }
        } catch (error) {
            alert("Failed to update approval status");
        }
    };

    const handleMarkRequestReviewed = async (id) => {
        try {
            await api.put(`/partner-requests/${id}/status`, { status: 'Reviewed' });
            setPartnerRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'Reviewed' } : r));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleCreateOutlet = async (e) => {
        e.preventDefault();
        setCreationLoading(true);
        try {
            const res = await api.post('/admin/create-outlet', newOutlet);
            alert("Secure Franchise Created Successfully!");
            setNewOutlet({ ownerName: '', email: '', password: '', outletName: '', location: '' });
            // Refresh active outlets
            const updatedActive = await api.get('/outlets');
            setActiveOutlets(updatedActive.data);
            
            // Optionally update KPI metrics locally
            if(analytics) setAnalytics({...analytics, totalOutlets: analytics.totalOutlets + 1});
        } catch (error) {
            alert("Creation failed: " + (error.response?.data?.message || error.message));
        } finally {
            setCreationLoading(false);
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

                {/* Franchise Creation Terminal & Network Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ marginTop: '3rem' }}>
                    
                    {/* Creation Terminal */}
                    <div className="card shadow-lg" style={{ borderTop: '4px solid var(--primary)' }}>
                        <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
                            <PlusCircle size={24} color="var(--primary)" />
                            <h3 className="heading-3">Franchise Creation Terminal</h3>
                        </div>
                        <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Securely generate a new Outlet owner account login bound dynamically to a physical campus outlet. Let's grow the CampusBite network.
                        </p>
                        <form onSubmit={handleCreateOutlet} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem' }}>Owner Full Name</label>
                                    <input type="text" className="input-control" value={newOutlet.ownerName} onChange={e => setNewOutlet({...newOutlet, ownerName: e.target.value})} required placeholder="John Doe" />
                                </div>
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem' }}>Login Email</label>
                                    <input type="email" className="input-control" value={newOutlet.email} onChange={e => setNewOutlet({...newOutlet, email: e.target.value})} required placeholder="owner@campusbite.com" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem' }}>Secure Login Password</label>
                                    <input type="password" className="input-control" value={newOutlet.password} onChange={e => setNewOutlet({...newOutlet, password: e.target.value})} required placeholder="Password" minLength="6" />
                                </div>
                                <div className="input-group" style={{ marginBottom: 0 }}>
                                    <label style={{ fontSize: '0.8rem' }}>Physical Location</label>
                                    <input type="text" className="input-control" value={newOutlet.location} onChange={e => setNewOutlet({...newOutlet, location: e.target.value})} required placeholder="North Block Canteen" />
                                </div>
                            </div>

                            <div className="input-group">
                                <label style={{ fontSize: '0.8rem' }}>Outlet Name / Branding</label>
                                <input type="text" className="input-control" value={newOutlet.outletName} onChange={e => setNewOutlet({...newOutlet, outletName: e.target.value})} required placeholder="Bite Bistro" />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={creationLoading} style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                {creationLoading ? <span className="spinner" style={{ width: '20px', height: '20px' }}></span> : <><Store size={18} /> Spawn Franchise</>}
                            </button>
                        </form>
                    </div>

                    {/* Live Operating Network */}
                    <div className="card shadow-sm" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem', position: 'sticky', top: 0, background: 'white', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', zIndex: 10 }}>
                            <Network size={24} color="var(--secondary)" />
                            <div>
                                <h3 className="heading-3">Global Operating Network</h3>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>{activeOutlets.length} Active Franchisees</p>
                            </div>
                        </div>

                        {activeOutlets.length === 0 ? (
                            <div className="text-center text-muted" style={{ padding: '3rem 0' }}>No active outlets in network.</div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {activeOutlets.map(out => (
                                    <div key={out._id} className="flex justify-between items-center" style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--light)' }}>
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: '40px', height: '40px', background: 'var(--secondary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {out.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{out.name}</h4>
                                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>📍 {out.location || 'Campus'}</p>
                                            </div>
                                        </div>
                                        <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>LIVE</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Partnership Inquiry Inbox */}
                <div className="card shadow-sm" style={{ marginTop: '3rem' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                        <div className="flex items-center gap-3">
                            <Inbox size={24} color="var(--primary)" />
                            <h3 className="heading-3">Partnership Inquiry Inbox</h3>
                        </div>
                        <div className="badge badge-warning" style={{ fontSize: '0.8rem' }}>
                            {partnerRequests.filter(r => r.status === 'Pending').length} Pending Leads
                        </div>
                    </div>

                    {partnerRequests.length === 0 ? (
                        <div className="text-center text-muted" style={{ padding: '3rem 0' }}>No partnership inquiries yet. Inbox zero! 🎉</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {partnerRequests.map(req => (
                                <div key={req._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: req.status === 'Pending' ? '#fff9f0' : 'var(--light)' }}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                                            <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{req.outletName}</h4>
                                            {req.status === 'Pending' ? (
                                                <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>NEW LEAD</span>
                                            ) : (
                                                <span className="badge text-muted" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--gray)' }}>REVIEWED</span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted">
                                            <p><strong>Owner:</strong> {req.name}</p>
                                            <p><strong>Email:</strong> {req.email}</p>
                                            <p><strong>Phone:</strong> {req.phone}</p>
                                            <p><strong>Location:</strong> {req.location}</p>
                                        </div>
                                    </div>
                                    {req.status === 'Pending' && (
                                        <button 
                                            className="btn btn-outline"
                                            style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                            onClick={() => handleMarkRequestReviewed(req._id)}
                                        >
                                            Mark as Contacted
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};

export default AdminDashboard;
