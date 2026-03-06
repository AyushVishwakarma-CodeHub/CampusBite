import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import api from '../api';
import { generateTimeSlots } from '../utils/timeSlots';
import { CreditCard, CheckCircle2, ChevronRight, MapPin, Clock as ClockIcon, Info, ShoppingBag, Zap } from 'lucide-react';

const Checkout = () => {
    const { user } = useAuth();
    const { cart, activeOutlet, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    const [pickupType, setPickupType] = useState('Takeaway');
    const [timeSlot, setTimeSlot] = useState('');
    const [deliveryDetails, setDeliveryDetails] = useState({ hostel: '', block: '', room: '' });
    const [loading, setLoading] = useState(false);
    const [successToken, setSuccessToken] = useState(null);

    const timeSlots = generateTimeSlots();

    // Protection: Redirect if cart is empty
    useEffect(() => {
        if (!loading && cart.length === 0 && !successToken) {
            navigate('/student/dashboard');
        }
    }, [cart, navigate, loading, successToken]);

    if (cart.length === 0 && !successToken) return null;

    const handlePlaceOrder = async () => {
        if (!timeSlot) return alert('Please select a pickup time slot');
        if (pickupType === 'Delivery' && (!deliveryDetails.hostel || !deliveryDetails.block || !deliveryDetails.room)) {
            return alert('Please fill all delivery details');
        }

        setLoading(true);
        try {
            const orderPayload = {
                outletId: activeOutlet._id,
                items: cart.map(c => ({ menuItem: c.menuItem._id, quantity: c.quantity, price: c.price })),
                totalAmount: totalAmount + 10, // Including platform fee
                pickupType,
                timeSlot,
                ...(pickupType === 'Delivery' && { deliveryDetails })
            };

            const res = await api.post('/orders', orderPayload);
            setSuccessToken(res.data.tokenNumber);
            clearCart(); // Success! Wipe the cart
        } catch (error) {
            alert(error.response?.data?.message || 'Error placing order');
        } finally {
            setLoading(false);
        }
    };

    if (successToken) {
        return (
            <div className="auth-container" style={{ background: 'var(--light)' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '2rem', borderRadius: '50%', marginBottom: '2rem' }}>
                        <CheckCircle2 size={80} />
                    </div>
                    <h1 className="heading-1" style={{ color: 'var(--success)', marginBottom: '1rem' }}>Order Confirmed!</h1>
                    <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '500px', lineHeight: 1.6 }}>
                        Hooray! Your order has been fired to the kitchen at **{activeOutlet?.name || 'the outlet'}**.
                    </p>

                    <div className="card animate-slide-up" style={{ margin: '3rem 0', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', minWidth: '350px', border: '3px dashed var(--primary)', borderRadius: 'var(--radius-xl)' }}>
                        <p className="badge badge-primary" style={{ letterSpacing: '0.15em', padding: '0.4rem 1rem' }}>YOUR DIGITAL TOKEN</p>
                        <h2 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--dark)', margin: '1rem 0' }}>{successToken}</h2>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <p className="text-xs text-muted">SLOT</p>
                                <p className="font-bold">{timeSlot}</p>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border)' }}></div>
                            <div className="text-center">
                                <p className="text-xs text-muted">TYPE</p>
                                <p className="font-bold">{pickupType}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => navigate('/student/orders')} className="btn btn-outline" style={{ padding: '0.85rem 2rem' }}>View My Orders</button>
                        <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>Back to Dashboard</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <Navbar />

            {/* Breadcrumb */}
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="flex items-center gap-2 text-sm text-muted">
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/student/dashboard')}>Dashboard</span>
                    <ChevronRight size={14} />
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>{activeOutlet?.name}</span>
                    <ChevronRight size={14} />
                    <span className="font-semibold text-dark">Checkout</span>
                </div>
            </div>

            <div className="container flex flex-col md:flex-row gap-8" style={{ padding: '2rem 1.25rem' }}>

                {/* Left: Configuration */}
                <div style={{ flex: '1 1 65%' }}>
                    <h2 className="heading-2" style={{ marginBottom: '2.5rem' }}>Secure Checkout</h2>

                    {/* Step 1: Order Type */}
                    <div className="card shadow-sm" style={{ marginBottom: '2rem', padding: '2rem' }}>
                        <div className="flex items-center gap-3" style={{ marginBottom: '1.5rem' }}>
                            <MapPin size={24} color="var(--primary)" />
                            <h3 className="heading-3">1. How will you get your food?</h3>
                        </div>

                        <div className="flex gap-4">
                            <label
                                onClick={() => setPickupType('Takeaway')}
                                className={`card flex-1 cursor-pointer items-center justify-center flex-col gap-2 ${pickupType === 'Takeaway' ? 'border-primary' : ''}`}
                                style={{
                                    transition: 'var(--transition)',
                                    border: pickupType === 'Takeaway' ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                                    background: pickupType === 'Takeaway' ? 'rgba(255,90,95,0.02)' : 'white'
                                }}
                            >
                                <ShoppingBag size={24} color={pickupType === 'Takeaway' ? 'var(--primary)' : 'var(--gray)'} />
                                <span className="font-bold">Takeaway</span>
                            </label>

                            <label
                                onClick={() => setPickupType('Delivery')}
                                className={`card flex-1 cursor-pointer items-center justify-center flex-col gap-2 ${pickupType === 'Delivery' ? 'border-primary' : ''}`}
                                style={{
                                    transition: 'var(--transition)',
                                    border: pickupType === 'Delivery' ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                                    background: pickupType === 'Delivery' ? 'rgba(255,90,95,0.02)' : 'white'
                                }}
                            >
                                <Zap size={24} color={pickupType === 'Delivery' ? 'var(--primary)' : 'var(--gray)'} />
                                <span className="font-bold">Fast Delivery</span>
                            </label>
                        </div>

                        {pickupType === 'Delivery' && (
                            <div className="animate-slide-up" style={{ marginTop: '2rem', background: 'var(--light)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px dotted var(--border)' }}>
                                <h4 className="font-semibold" style={{ marginBottom: '1.25rem' }}>Delivery Address</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="input-group">
                                        <label>Hostel / Apartment</label>
                                        <input className="input-control" value={deliveryDetails.hostel} onChange={e => setDeliveryDetails({ ...deliveryDetails, hostel: e.target.value })} placeholder="e.g. Newton Hostel" />
                                    </div>
                                    <div className="input-group">
                                        <label>Block / Wing</label>
                                        <input className="input-control" value={deliveryDetails.block} onChange={e => setDeliveryDetails({ ...deliveryDetails, block: e.target.value })} placeholder="e.g. Block C" />
                                    </div>
                                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                        <label>Exact Room / Flat Number</label>
                                        <input className="input-control" value={deliveryDetails.room} onChange={e => setDeliveryDetails({ ...deliveryDetails, room: e.target.value })} placeholder="e.g. Room 402" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Time Slot */}
                    <div className="card shadow-sm" style={{ padding: '2rem' }}>
                        <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                            <ClockIcon size={24} color="var(--primary)" />
                            <h3 className="heading-3">2. Select a Pickup Slot</h3>
                        </div>
                        <p className="text-muted text-sm" style={{ marginBottom: '2rem' }}>
                            Choose a 10-minute window. We'll ensure your food is prepared just-in-time for this slot.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {timeSlots.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    className={`btn ${timeSlot === slot ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setTimeSlot(slot)}
                                    style={{ padding: '0.85rem', fontSize: '0.85rem' }}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div style={{ flex: '1 1 35%' }}>
                    <div className="card shadow-md" style={{ position: 'sticky', top: '100px', borderTop: '4px solid var(--secondary)' }}>
                        <h3 className="heading-3" style={{ marginBottom: '2rem' }}>Order Summary</h3>

                        <div className="flex flex-col gap-4" style={{ marginBottom: '2rem' }}>
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start">
                                    <div style={{ flex: 1 }}>
                                        <p className="font-medium" style={{ fontSize: '0.95rem' }}>{item.menuItem.name}</p>
                                        <p className="text-muted text-xs">{item.quantity} x ₹{item.price}</p>
                                    </div>
                                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Item Subtotal</span>
                                <span className="font-medium">₹{totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Platform Fee</span>
                                <span className="font-medium">₹10</span>
                            </div>
                            {pickupType === 'Delivery' && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Delivery Fee</span>
                                    <span className="text-success font-medium">FREE</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center" style={{ margin: '1.5rem 0 2rem' }}>
                            <span className="heading-3" style={{ fontSize: '1.3rem' }}>Total</span>
                            <span className="heading-3" style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>₹{totalAmount + 10}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem', borderRadius: 'var(--radius-lg)' }}
                            onClick={handlePlaceOrder}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CreditCard size={22} />
                                    <span>Place Order</span>
                                </div>
                            )}
                        </button>

                        <div className="flex items-center gap-2 justify-center" style={{ marginTop: '1.5rem', opacity: 0.6 }}>
                            <Info size={14} />
                            <p style={{ fontSize: '0.75rem' }}>Safe & Secure Campus Payment</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
