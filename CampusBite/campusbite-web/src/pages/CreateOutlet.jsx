import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api';
import { Store, Clock, MapPin } from 'lucide-react';

const CreateOutlet = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        location: '',
        openingTime: '08:00',
        closingTime: '20:00',
        image: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/outlets', form);
            navigate('/outlet/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create outlet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in" style={{ maxWidth: '680px', padding: '3rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(255,90,95,0.1)', borderRadius: '50%', padding: '1.25rem', marginBottom: '1rem' }}>
                        <Store size={36} color="var(--primary)" />
                    </div>
                    <h2 className="heading-1">Set Up Your Outlet</h2>
                    <p className="text-muted" style={{ marginTop: '0.5rem' }}>Fill in the details below. Your outlet will be visible to students after admin approval.</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <div className="input-group">
                            <label>Outlet Name *</label>
                            <input name="name" className="input-control" placeholder="e.g. Punjabi Tadka, Café CampusBite" value={form.name} onChange={handleChange} required />
                        </div>

                        <div className="input-group">
                            <label>Description</label>
                            <textarea name="description" className="input-control" rows="3" placeholder="Tell students what makes your outlet special..." value={form.description} onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={15} /> Location / Block</label>
                            <input name="location" className="input-control" placeholder="e.g. Block 32, Ground Floor, Sector 5" value={form.location} onChange={handleChange} />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={15} /> Opening Time</label>
                                <input type="time" name="openingTime" className="input-control" value={form.openingTime} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={15} /> Closing Time</label>
                                <input type="time" name="closingTime" className="input-control" value={form.closingTime} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Cover Image URL (Optional)</label>
                            <input name="image" className="input-control" placeholder="https://example.com/your-outlet-photo.jpg" value={form.image} onChange={handleChange} />
                        </div>

                        {form.image && (
                            <div>
                                <img src={form.image} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '0.5rem' }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit for Approval'}
                        </button>

                        <p className="text-muted text-center" style={{ fontSize: '0.85rem' }}>
                            ⏳ Once submitted, an admin will review and approve your outlet listing.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateOutlet;
