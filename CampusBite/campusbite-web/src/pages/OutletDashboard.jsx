import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../api';

const OutletDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'outlet') navigate('/');

        const fetchOutletInfo = async () => {
            try {
                const res = await api.get('/outlets');
                // Hacky way: outlets returns all authorized/approved. In a real system we'd hit /outlets/myoutlet
                // We'll simulate by filtering the logged-in user's outlet
                const myOutlet = res.data.find(o => o.ownerId?._id === user._id || o.ownerId === user._id);

                if (myOutlet) {
                    setOutlet(myOutlet);
                } else {
                    console.warn("User doesn't have an outlet configured yet.");
                    // In a real app we'd redirect to an `create-outlet` form
                }
            } catch (error) {
                console.error("Error fetching outlet:", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOutletInfo();
    }, [user, navigate]);


    if (loading) return <div className="text-center" style={{ marginTop: '5rem' }}>Loading Dashboard...</div>;

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
                <h2 className="heading-2" style={{ marginBottom: '2rem' }}>Outlet Dashboard</h2>

                {!outlet ? (
                    <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                        <h3 className="heading-3">No Outlet Found</h3>
                        <p className="text-muted" style={{ margin: '1rem 0 2rem' }}>You need to configure your outlet profile first.</p>
                        <button className="btn btn-primary" onClick={() => alert("Outlet registration flow not fully implemented in this demo")}>Create Outlet Profile</button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div
                            className="card hoverable-card"
                            style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem' }}
                            onClick={() => navigate('/outlet/orders', { state: { outletId: outlet._id } })}
                        >
                            <h3 className="heading-2 text-primary" style={{ marginBottom: '1rem' }}>Manage Orders</h3>
                            <p className="text-muted">View live order queue, update statuses, and track tokens coming in per time slot.</p>
                        </div>

                        <div
                            className="card hoverable-card"
                            style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem' }}
                            onClick={() => navigate('/outlet/manage-menu', { state: { outletId: outlet._id } })}
                        >
                            <h3 className="heading-2 text-primary" style={{ marginBottom: '1rem' }}>Manage Menu</h3>
                            <p className="text-muted">Add new items, update prices, or toggle item availability to students.</p>
                        </div>

                        <div
                            className="card hoverable-card"
                            style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem' }}
                            onClick={() => navigate('/outlet/feedback', { state: { outletId: outlet._id } })}
                        >
                            <h3 className="heading-2 text-primary" style={{ marginBottom: '1rem' }}>Customer Feedback</h3>
                            <p className="text-muted">Read reviews and check the overall star ratings provided by students to your outlet.</p>
                        </div>

                        <div
                            className="card hoverable-card"
                            style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem' }}
                            onClick={() => navigate('/outlet/analytics', { state: { outletId: outlet._id } })}
                        >
                            <h3 className="heading-2 text-primary" style={{ marginBottom: '1rem' }}>Live Analytics</h3>
                            <p className="text-muted">Track your realtime revenue, total order volume, and top-selling dishes.</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OutletDashboard;
