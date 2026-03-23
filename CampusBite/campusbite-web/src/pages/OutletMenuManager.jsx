import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, EyeOff, Eye } from 'lucide-react';

const OutletMenuManager = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const outletId = state?.outletId;

    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Quick Add format state
    const [newItem, setNewItem] = useState({ name: '', price: '', description: '', isAvailable: true, image: '' });
    const [generatingImage, setGeneratingImage] = useState(false);

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
            setNewItem({ name: '', price: '', description: '', isAvailable: true, image: '' });
        } catch (error) {
            console.error(error);
            alert("Failed to add Item");
        }
    };

    const handleGenerateImage = async (e) => {
        e.preventDefault();
        if (!newItem.name) {
            alert("Please enter an Item Name first to let the AI know what to generate.");
            return;
        }
        setGeneratingImage(true);
        
        try {
            // Construct a highly detailed photography prompt
            const prompt = `Delicious appetizing ${newItem.name}, ${newItem.description || ''}, professional food photography, 4k resolution, restaurant studio lighting, close up`;
            const uniqueSeed = Math.floor(Math.random() * 1000000);
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=300&nologo=true&seed=${uniqueSeed}`;
            
            // Preload the image in browser background so the spinner spins until the AI physically finishes rendering
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                setNewItem(prev => ({ ...prev, image: imageUrl }));
                setGeneratingImage(false);
            };
            img.onerror = () => {
                 alert("AI Generation failed. The server might be overloaded. Please try again.");
                 setGeneratingImage(false);
            }
        } catch (error) {
            console.error(error);
            setGeneratingImage(false);
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        try {
            const res = await api.put(`/menu/${id}`, { isAvailable: !currentStatus });
            setMenuItems(prev => prev.map(m => m._id === id ? res.data : m));
        } catch (error) {
            console.error("Toggle Error:", error);
            alert("Failed to toggle item availability: " + (error.response?.data?.message || "Server Error"));
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
                                <textarea className="input-control" rows="3" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} placeholder="e.g. Crispy pastry filled with spiced potatoes"></textarea>
                            </div>

                            <div className="input-group">
                                <label>Hero Image</label>
                                {newItem.image ? (
                                    <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                                        <img src={newItem.image} alt="Generated Food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button 
                                            type="button" 
                                            onClick={() => setNewItem({...newItem, image: ''})}
                                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            ✕
                                        </button>
                                        <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>
                                            AI GENERATED
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input type="text" className="input-control" style={{ flex: 1 }} placeholder="Image URL..." value={newItem.image || ''} onChange={e => setNewItem({ ...newItem, image: e.target.value })} />
                                        <button type="button" className="btn btn-outline" disabled={generatingImage} onClick={handleGenerateImage} style={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            {generatingImage ? <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: 'rgba(0,0,0,0.1)', borderTopColor: 'var(--primary)' }}></span> : '🪄 AI Magic'}
                                        </button>
                                    </div>
                                )}
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
                                <div key={item._id} className="card flex justify-between items-center" style={{ opacity: item.isAvailable ? 1 : 0.6, padding: '1.25rem' }}>
                                    <div className="flex gap-4 items-center">
                                        {item.image ? (
                                            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        ) : (
                                            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', flexShrink: 0 }}>
                                                No Img
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="heading-3">{item.name}</h3>
                                            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                                            <div className="flex items-center gap-4">
                                                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{item.price}</span>
                                                {item.isAvailable ?
                                                <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 500 }}>Available</span> :
                                                <span style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>Out of Stock</span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 items-end">
                                        
                                        {/* Beautiful Custom Toggle Switch */}
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: item.isAvailable ? 'var(--dark)' : 'var(--muted)' }}>
                                                {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                            <div 
                                                onClick={() => toggleAvailability(item._id, item.isAvailable)}
                                                style={{ 
                                                    width: '44px', height: '24px', background: item.isAvailable ? 'var(--success)' : 'var(--gray)', 
                                                    borderRadius: '12px', position: 'relative', transition: 'background 0.3s ease' 
                                                }}
                                            >
                                                <div style={{ 
                                                    width: '20px', height: '20px', background: 'white', borderRadius: '50%', 
                                                    position: 'absolute', top: '2px', left: item.isAvailable ? '22px' : '2px', 
                                                    transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
                                                }} />
                                            </div>
                                        </label>

                                        <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }} onClick={() => deleteItem(item._id)}>
                                            <Trash2 size={14} /> Delete
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
