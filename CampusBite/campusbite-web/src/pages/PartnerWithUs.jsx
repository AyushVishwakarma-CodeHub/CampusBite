import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import { Store, MapPin, Mail, Phone, CheckCircle } from 'lucide-react';

const PartnerWithUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        outletName: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await api.post('/partner-requests', formData);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in flex flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '3rem 1rem' }}>
                
                <div style={{ maxWidth: '800px', width: '100%' }}>
                    
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <div className="badge badge-success" style={{ marginBottom: '1rem' }}>B2B PARTNERSHIPS</div>
                        <h1 className="heading-1 highlight">Grow Your Cafeteria on CampusBite.</h1>
                        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto 0' }}>
                            Join the university's exclusive digital food network. Streamline your kitchen, eliminate queues, and track your revenue in real-time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        
                        {/* Value Proposition */}
                        <div className="flex flex-col gap-6" style={{ padding: '1rem' }}>
                            <div className="flex gap-4">
                                <div style={{ background: 'rgba(255, 90, 95, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                                    <Store size={24} />
                                </div>
                                <div>
                                    <h3 className="heading-3">Instant Ordering Pipeline</h3>
                                    <p className="text-muted text-sm">Receive digital orders directly to your admin dashboard. Stop dealing with chaotic physical queues.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div style={{ background: 'rgba(0, 166, 153, 0.1)', color: 'var(--secondary)', padding: '1rem', borderRadius: '12px', height: 'fit-content' }}>
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="heading-3">AI Demand Prediction</h3>
                                    <p className="text-muted text-sm">Our heuristic engine analyzes your sales data to predict exactly how much food you need to prep.</p>
                                </div>
                            </div>
                        </div>

                        {/* Intake Form */}
                        <div className="card shadow-lg" style={{ borderTop: '4px solid var(--primary)' }}>
                            {success ? (
                                <div className="text-center" style={{ padding: '3rem 1rem' }}>
                                    <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem' }} />
                                    <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Request Received!</h2>
                                    <p className="text-muted" style={{ marginBottom: '2rem' }}>
                                        Our administrative team will review your application and contact you directly to set up your God-Mode franchise account.
                                    </p>
                                    <Link to="/" className="btn btn-outline" style={{ display: 'inline-block' }}>Return Home</Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>Partnership Application</h3>
                                    
                                    {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(239,68,68,0.1)', borderRadius: '4px' }}>{error}</div>}

                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label><Store size={14} style={{ display: 'inline', marginRight: '5px' }} /> Cafeteria/Brand Name</label>
                                        <input type="text" className="input-control" required value={formData.outletName} onChange={e => setFormData({...formData, outletName: e.target.value})} placeholder="e.g. Campus Fusion" />
                                    </div>

                                    <div className="input-group" style={{ marginBottom: 0 }}>
                                        <label><MapPin size={14} style={{ display: 'inline', marginRight: '5px' }} /> Physical Campus Location</label>
                                        <input type="text" className="input-control" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. North Block, Gate 2" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <label>Owner Full Name</label>
                                            <input type="text" className="input-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                                        </div>
                                        <div className="input-group" style={{ marginBottom: 0 }}>
                                            <label><Phone size={14} style={{ display: 'inline', marginRight: '5px' }} /> Phone Number</label>
                                            <input type="tel" className="input-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 XXXXX XXXXX" />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label><Mail size={14} style={{ display: 'inline', marginRight: '5px' }} /> Business Email</label>
                                        <input type="email" className="input-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contact@brand.com" />
                                    </div>

                                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center' }}>
                                        {loading ? <span className="spinner" style={{ width: '20px', height: '20px' }}></span> : 'Submit Partnership Application'}
                                    </button>
                                </form>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
};

export default PartnerWithUs;
