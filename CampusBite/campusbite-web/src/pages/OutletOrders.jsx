import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Clock, RefreshCcw, Check, MoveRight } from 'lucide-react';

const OutletOrders = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const outletId = state?.outletId;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/orders/outlet/${outletId}`);
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'outlet') navigate('/');
        if (!outletId) navigate('/outlet/dashboard');
        fetchOrders();
    }, [user, navigate, outletId]);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            // Optimistic update
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    // Grouping orders by time slot logic
    const timeSlotGroups = orders.reduce((groups, order) => {
        const slot = order.timeSlot;
        if (!groups[slot]) groups[slot] = [];
        groups[slot].push(order);
        return groups;
    }, {});

    // Sorting slots roughly 
    const sortedSlots = Object.keys(timeSlotGroups).sort();

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="heading-2">Order Queue by Slot</h2>
                    <button className="btn btn-outline flex items-center gap-2" onClick={fetchOrders}>
                        <RefreshCcw size={16} /> Sync
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-muted">Loading live queue...</div>
                ) : sortedSlots.length === 0 ? (
                    <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                        <p className="text-muted text-lg">No orders assigned to your outlet yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {sortedSlots.map(slot => (
                            <div key={slot} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                    <h3 className="heading-3 flex items-center gap-2">
                                        <Clock size={20} color="var(--primary)" /> {slot}
                                    </h3>
                                    <span style={{ fontWeight: 600, background: 'var(--light)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                                        {timeSlotGroups[slot].length} Orders
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {timeSlotGroups[slot].map(order => (
                                        <div key={order._id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ background: 'var(--light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                            <div style={{ flex: 1 }}>
                                                <div className="flex items-center gap-3" style={{ marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Token #{order.tokenNumber}</span>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, background: order.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'white', color: order.status === 'Completed' ? 'var(--success)' : 'var(--dark)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                                    {order.studentId?.name} • {order.items.map(i => `${i.quantity}x ${i.menuItem?.name}`).join(', ')}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {order.status === 'Pending' && (
                                                    <button className="btn btn-outline flex items-center gap-1" onClick={() => updateStatus(order._id, 'Preparing')}>
                                                        Start <MoveRight size={14} />
                                                    </button>
                                                )}
                                                {order.status === 'Preparing' && (
                                                    <button className="btn btn-primary flex items-center gap-1" onClick={() => updateStatus(order._id, 'Ready')}>
                                                        Mark Ready <Check size={14} />
                                                    </button>
                                                )}
                                                {order.status === 'Ready' && (
                                                    <button className="btn btn-secondary flex items-center gap-1" onClick={() => updateStatus(order._id, 'Completed')}>
                                                        Collect Token
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default OutletOrders;
