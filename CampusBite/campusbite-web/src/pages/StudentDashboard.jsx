import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api';

const StudentDashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [outlets, setOutlets] = useState([]);
    const [loadingOutlets, setLoadingOutlets] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (!loading && user?.role !== 'student') {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const res = await api.get('/outlets');
                setOutlets(res.data);
            } catch (error) {
                console.error("Error fetching outlets", error);
            } finally {
                setLoadingOutlets(false);
            }
        };
        if (user && user.role === 'student') {
            fetchOutlets();
        }
    }, [user]);

    if (loading || loadingOutlets) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading CampusBite...</div>;

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <h2 className="heading-2" style={{ marginBottom: '0.5rem' }}>Welcome, {user?.name} 👋</h2>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>Where are you eating today?</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {outlets.map(outlet => (
                        <div key={outlet._id} className="card hoverable-card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/outlet/${outlet._id}`)}>
                            {outlet.image ? (
                                <img src={outlet.image} alt={outlet.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, rgba(255,90,95,0.15), rgba(0,166,153,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                    🍽️
                                </div>
                            )}
                            <div style={{ padding: '1.5rem' }}>
                                <h3 className="heading-3" style={{ marginBottom: '0.5rem' }}>{outlet.name}</h3>
                                <p className="text-muted">{outlet.description || "A great place to grab a bite."}</p>
                                <div className="flex justify-between items-center" style={{ marginTop: '1.5rem' }}>
                                    {/* Crowd indicator mock */}
                                    <span style={{ fontSize: '0.875rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                                        🟢 Low Crowd
                                    </span>
                                    <button className="btn btn-secondary" style={{ padding: '0.25rem 1rem' }}>View Menu</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {outlets.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
                            No outlets available yet.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentDashboard;
