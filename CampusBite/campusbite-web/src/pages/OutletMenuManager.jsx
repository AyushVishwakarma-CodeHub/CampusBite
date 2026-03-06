import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const OutletMenuManager = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const outletId = state?.outletId;

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Quick Add format state
    const [newItem, setNewItem] = useState({ name: '', price: '', description: '', isAvailable: true });

    useEffect(() => {
        if (!user || user.role !== 'outlet') navigate('/');
        if (!outletId) navigate('/outlet/dashboard');

        const fetchMenu = async () => {
            try {
                const res = await api.get(`/menu/outlet/${outletId}`);
                setMenuItems(res.data);
            } catch (error) {
                console.error("Failed to load menu");
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [user, navigate, outletId]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/menu', { ...newItem, outletId });
            setMenuItems([...menuItems, res.data]);
            setNewItem({ name: '', price: '', description: '', isAvailable: true });
        } catch (error) {
            console.error(error);
            alert("Failed to add Item");
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            const res = await api.put(`/menu/${id}`, { isAvailable: !currentStatus });
            setMenuItems(prev => prev.map(m => m._id === id ? res.data : m));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteItem = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await api.delete(`/menu/${id}`);
                setMenuItems(prev => prev.filter(m => m._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in flex flex-col md:flex-row gap-6" style={{ padding: '3rem 1rem' }}>

                {/* Form Add */}
                <div style={{ flex: '1 1 35%' }}>
                    <div className="card" style={{ position: 'sticky', top: '100px' }}>
                        <h3 className="heading-3 flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
                            <Plus size={20} color="var(--primary)" /> Add Menu Item
                        </h3>
                        <form onSubmit={handleAddItem}>
                            <div className="input-group">
                                <label>Item Name</label>
                                <input type="text" className="input-control" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Price (₹)</label>
                                <input type="number" className="input-control" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea className="input-control" rows="3" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Item</button>
                        </form>
                    </div>
                </div>

                {/* List View */}
                <div style={{ flex: '1 1 60%' }}>
                    <h2 className="heading-2" style={{ marginBottom: '2rem' }}>Current Catalog</h2>

                    {loading ? <p className="text-muted text-center">Loading catalogue...</p> : menuItems.length === 0 ? (
                        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                            <p className="text-muted">Your menu is empty. Start adding items.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {menuItems.map(item => (
                                <div key={item._id} className="card flex justify-between items-center" style={{ opacity: item.isAvailable ? 1 : 0.6 }}>
                                    <div>
                                        <h3 className="heading-3">{item.name}</h3>
                                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{item.description}</p>
                                        <div className="flex items-center gap-4">
                                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{item.price}</span>
                                            {item.isAvailable ?
                                                <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 500 }}>Available</span> :
                                                <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>Out of Stock</span>
                                            }
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => toggleAvailability(item._id, item.isAvailable)}>
                                            Toggle Stock
                                        </button>
                                        <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => deleteItem(item._id)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default OutletMenuManager;
