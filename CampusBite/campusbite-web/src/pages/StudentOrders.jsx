import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Clock, RefreshCw, Star } from 'lucide-react';

const StudentOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Feedback state
    const [feedbackOrder, setFeedbackOrder] = useState(null);
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState('');

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/myorders');
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'student') fetchOrders();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'var(--warning)';
            case 'Preparing': return 'var(--primary)';
            case 'Ready': return 'var(--success)';
            case 'Completed': return 'var(--gray)';
            default: return 'var(--gray)';
        }
    };

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            await api.post('/feedback', { orderId: feedbackOrder, rating, comments });
            setFeedbackSuccess(feedbackOrder);
            setFeedbackOrder(null);
            setComments('');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit feedback');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="heading-2">My Orders & Queue</h2>
                    <button className="btn btn-outline flex items-center gap-2" onClick={fetchOrders}>
                        <RefreshCw size={16} /> Refresh Status
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-muted">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                        <p className="text-muted text-lg">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {orders.map(order => (
                            <div key={order._id} className="card flex flex-col md:flex-row gap-6 justify-between items-center">

                                <div className="flex items-center gap-6" style={{ flex: 1 }}>
                                    <div style={{ textAlign: 'center', background: 'var(--light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', minWidth: '120px' }}>
                                        <p className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Token No.</p>
                                        <h3 className="heading-2" style={{ color: 'var(--dark)' }}>{order.tokenNumber}</h3>
                                    </div>

                                    <div>
                                        <h3 className="heading-3">{order.outletId?.name}</h3>
                                        <p className="text-muted" style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                                            {order.items.map(i => `${i.quantity}x ${i.menuItem?.name} `).join(', ')}
                                        </p>
                                        <div className="flex items-center gap-2" style={{ marginTop: '0.75rem' }}>
                                            <Clock size={16} color="var(--gray)" />
                                            <span style={{ fontSize: '0.9rem', color: 'var(--dark)', fontWeight: 500 }}>{order.pickupType} @ {order.timeSlot}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-2" style={{ minWidth: '150px' }}>
                                    <span style={{
                                        background: `rgba(${getStatusColor(order.status) === 'var(--warning)' ? '245, 158, 11' : getStatusColor(order.status) === 'var(--success)' ? '16, 185, 129' : '255, 90, 95'}, 0.1)`,
                                        color: getStatusColor(order.status),
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontWeight: 600,
                                        fontSize: '0.9rem'
                                    }}>
                                        {order.status}
                                    </span>
                                    <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>Total: ₹{order.totalAmount}</p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default StudentOrders;
