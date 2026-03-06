import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Star, MessageSquare } from 'lucide-react';

const OutletFeedback = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const outletId = state?.outletId;

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'outlet') navigate('/');
        if (!outletId) navigate('/outlet/dashboard');

        const fetchFeedback = async () => {
            try {
                const res = await api.get(`/feedback/outlet/${outletId}`);
                setFeedbacks(res.data);
            } catch (error) {
                console.error("Failed to load feedback");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, [user, navigate, outletId]);

    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    return (
        <>
            <Navbar />
            <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                    <h2 className="heading-2">Customer Feedback</h2>
                    {feedbacks.length > 0 && (
                        <div className="flex items-center gap-2" style={{ background: 'var(--light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                            <Star fill="var(--warning)" color="var(--warning)" size={20} />
                            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{averageRating}</span>
                            <span className="text-muted text-sm">({feedbacks.length} reviews)</span>
                        </div>
                    )}
                </div>

                {loading ? <p className="text-muted text-center">Loading reviews...</p> : feedbacks.length === 0 ? (
                    <div className="card text-center" style={{ padding: '4rem 2rem' }}>
                        <p className="text-muted text-lg">No feedback received yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {feedbacks.map(fb => (
                            <div key={fb._id} className="card flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-1" style={{ color: 'var(--warning)' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < fb.rating ? 'var(--warning)' : 'none'} color={i < fb.rating ? 'var(--warning)' : 'var(--border)'} />
                                        ))}
                                    </div>
                                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                        {new Date(fb.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={{ fontSize: '1rem', fontStyle: fb.comments ? 'normal' : 'italic', color: fb.comments ? 'var(--dark)' : 'var(--gray)' }}>
                                    "{fb.comments || 'No comments provided.'}"
                                </p>
                                <div className="flex items-center gap-2 mt-auto text-muted" style={{ fontSize: '0.875rem' }}>
                                    <MessageSquare size={14} />
                                    <span>{fb.studentId?.name || 'Anonymous User'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default OutletFeedback;
