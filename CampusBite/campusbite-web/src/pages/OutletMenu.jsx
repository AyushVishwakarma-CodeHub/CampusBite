import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import api from '../api';
import { ShoppingCart, Plus, Minus, Info } from 'lucide-react';

const OutletMenu = () => {
    const { outletId } = useParams();
    const { user } = useAuth();
    const { cart, activeOutlet, addToCart, removeFromCart, getQuantity, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    const [outlet, setOutlet] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'student') navigate('/');

        const fetchOutletAndMenu = async () => {
            try {
                const outletRes = await api.get(`/outlets/${outletId}`);
                setOutlet(outletRes.data);

                const menuRes = await api.get(`/menu/outlet/${outletId}`);
                setMenuItems(menuRes.data.filter(item => item.isAvailable));
            } catch (error) {
                console.error("Error fetching menu", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOutletAndMenu();
    }, [outletId, user, navigate]);

    if (loading) return <div className="text-center" style={{ marginTop: '5rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div><p style={{ marginTop: '1rem' }}>Loading Menu...</p></div>;
    if (!outlet) return <div className="text-center" style={{ marginTop: '5rem' }}>Outlet not found.</div>;

    return (
        <div className="animate-fade-in">
            <Navbar />

            {/* Outlet Header */}
            <div style={{ position: 'relative', height: '300px', width: '100%', overflow: 'hidden' }}>
                <img
                    src={outlet.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1600"}
                    alt={outlet.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '3rem 0', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <div className="container">
                        <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>OPEN NOW</div>
                        <h1 className="heading-1" style={{ color: 'white' }}>{outlet.name}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', maxWidth: '600px' }}>{outlet.description}</p>
                        <div className="flex gap-4 items-center" style={{ marginTop: '1.5rem', color: 'white', fontSize: '0.9rem' }}>
                            <span>📍 {outlet.location}</span>
                            <span>🕒 {outlet.openingTime} - {outlet.closingTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container flex flex-col md:flex-row gap-8" style={{ padding: '3rem 1.25rem', alignItems: 'flex-start' }}>

                {/* Menu Items */}
                <div style={{ flex: '1 1 65%' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                        <h2 className="heading-2">Main Menu</h2>
                        <div className="badge badge-gray">{menuItems.length} items available</div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {menuItems.map(item => (
                            <div key={item._id} className="card hoverable-card flex justify-between items-center" style={{ padding: '1.25rem' }}>
                                <div className="flex gap-4 items-center">
                                    <div style={{ width: '85px', height: '85px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--border)' }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-2xl">🍲</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="heading-3" style={{ fontSize: '1.15rem' }}>{item.name}</h3>
                                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', maxWidth: '300px' }}>{item.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{item.price}</span>
                                            {item.isVeg && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>VEG</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {getQuantity(item._id) > 0 ? (
                                        <div className="flex items-center gap-3 bg-light" style={{ padding: '0.4rem', borderRadius: 'var(--radius-full)', background: 'var(--border)' }}>
                                            <button className="btn btn-outline" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }} onClick={() => removeFromCart(item._id)}><Minus size={14} /></button>
                                            <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{getQuantity(item._id)}</span>
                                            <button className="btn btn-primary" style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }} onClick={() => addToCart(item, outlet)}><Plus size={14} /></button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={() => addToCart(item, outlet)}>ADD</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {menuItems.length === 0 && (
                            <div className="text-center" style={{ padding: '4rem 0' }}>
                                <Info size={48} color="var(--gray)" style={{ margin: '0 auto 1rem' }} />
                                <p className="text-muted">No items available currently.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cart Sidebar */}
                <div style={{ flex: '1 1 35%', position: 'sticky', top: '100px' }}>
                    <div className="card shadow-lg" style={{ borderTop: '4px solid var(--primary)' }}>
                        <div className="flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                            <div style={{ background: 'rgba(255,90,95,0.1)', color: 'var(--primary)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
                                <ShoppingCart size={22} />
                            </div>
                            <div>
                                <h3 className="heading-3" style={{ fontSize: '1.1rem' }}>Order Basket</h3>
                                {activeOutlet && <p className="text-xs text-muted">From {activeOutlet.name}</p>}
                            </div>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center" style={{ padding: '3rem 0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🛒</div>
                                <p className="text-muted text-sm">Your basket is empty.<br />Browse the menu and add items!</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-4" style={{ marginBottom: '1.5rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {cart.map((cartItem, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div>
                                                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{cartItem.menuItem.name}</p>
                                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>₹{cartItem.price} x {cartItem.quantity}</p>
                                            </div>
                                            <p style={{ fontWeight: 700 }}>₹{cartItem.price * cartItem.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                                    <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                        <span className="text-muted">Subtotal</span>
                                        <span className="font-semibold">₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="heading-3">Total</span>
                                        <span className="heading-3" style={{ color: 'var(--primary)' }}>₹{totalAmount}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', gap: '0.5rem' }}
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    className="text-muted text-xs"
                                    style={{ width: '100%', marginTop: '1rem', textDecoration: 'underline' }}
                                    onClick={clearCart}
                                >
                                    Clear Basket
                                </button>
                            </>
                        )}
                    </div>

                    <div className="card" style={{ marginTop: '1.5rem', background: 'rgba(0,166,153,0.03)', padding: '1rem' }}>
                        <div className="flex gap-3 items-center">
                            <Clock size={18} color="var(--secondary)" />
                            <p className="text-xs" style={{ color: 'var(--secondary)', fontWeight: 600 }}>Usually ready in 15-20 mins</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutletMenu;
