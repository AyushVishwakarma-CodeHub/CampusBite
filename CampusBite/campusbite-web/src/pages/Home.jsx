import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Clock, ShoppingBag, Star, Zap, Shield } from 'lucide-react';

const FEATURES = [
    {
        icon: <ChefHat size={28} />,
        color: 'var(--primary)',
        title: 'Browse Campus Outlets',
        desc: 'Explore menus from all food joints across the campus with live crowd indicators.',
    },
    {
        icon: <Clock size={28} />,
        color: 'var(--secondary)',
        title: 'Pre-Book a Time Slot',
        desc: 'Select a precise 10-minute pickup window to avoid queues and waiting.',
    },
    {
        icon: <ShoppingBag size={28} />,
        color: 'var(--warning)',
        title: 'Grab & Go',
        desc: 'Get your digital token, show it at the counter, and collect freshly made food.',
    },
];

const STATS = [
    { value: '10+', label: 'Campus Outlets' },
    { value: '500+', label: 'Students Served' },
    { value: '0 min', label: 'Average Wait Time' },
    { value: '4.8 ★', label: 'Average Rating' },
];

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            {/* ──────────────── NAVBAR ──────────────── */}
            <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)' }}>
                <div className="container flex justify-between items-center" style={{ height: '70px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                        Campus<span style={{ color: 'var(--dark)' }}>Bite</span>
                    </span>
                    <div className="flex gap-3">
                        {user ? (
                            <button className="btn btn-primary" onClick={() => {
                                if (user.role === 'student') navigate('/student/dashboard');
                                else if (user.role === 'outlet') navigate('/outlet/dashboard');
                                else navigate('/admin/dashboard');
                            }}>
                                Go to Dashboard
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline">Login</Link>
                                <Link to="/register" className="btn btn-primary">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ──────────────── HERO ──────────────── */}
            <section style={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(255,90,95,0.15), transparent), radial-gradient(ellipse 60% 60% at 80% 100%, rgba(0,166,153,0.12), transparent), var(--light)',
                padding: '5rem 1rem',
            }}>
                <div className="container text-center" style={{ maxWidth: '760px', margin: '0 auto' }}>
                    <div className="badge badge-primary" style={{ marginBottom: '1.5rem', fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        🎓 Designed for Campus Life
                    </div>
                    <h1 className="heading-1" style={{ marginBottom: '1.5rem', lineHeight: 1.15 }}>
                        Campus Food Ordering,{' '}
                        <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Reinvented
                        </span>
                    </h1>
                    <p className="text-muted text-lg" style={{ maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
                        Pre-order your meals, choose your time slot, and collect your food without waiting. Powered by AI for zero food waste.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2.2rem' }}>
                            Order Now — It's Free
                        </Link>
                        <Link to="/login" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '0.85rem 2.2rem' }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ──────────────── STATS ──────────────── */}
            <section style={{ background: 'var(--dark)', color: 'white', padding: '3rem 1rem' }}>
                <div className="container grid md:grid-cols-4 gap-6 text-center">
                    {STATS.map((s, i) => (
                        <div key={i}>
                            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>{s.value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────── HOW IT WORKS ──────────────── */}
            <section className="container" style={{ padding: '6rem 1rem' }}>
                <div className="text-center" style={{ marginBottom: '4rem' }}>
                    <h2 className="heading-2">How CampusBite Works</h2>
                    <p className="text-muted" style={{ marginTop: '0.75rem', maxWidth: '500px', margin: '0.75rem auto 0' }}>
                        Three simple steps to get freshly prepared campus food without any hassle.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="card animate-fade-in text-center" style={{ padding: '2.5rem 2rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                background: `${f.color}18`,
                                color: f.color,
                                padding: '1rem',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: '1.5rem',
                            }}>
                                {f.icon}
                            </div>
                            <h3 className="heading-3" style={{ marginBottom: '0.75rem' }}>{f.title}</h3>
                            <p className="text-muted" style={{ lineHeight: 1.7 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────── EXTRA FEATURES ──────────────── */}
            <section style={{ background: 'var(--light)', padding: '5rem 1rem', borderTop: '1px solid var(--border)' }}>
                <div className="container grid md:grid-cols-3 gap-6">
                    <div className="card flex gap-4 items-start">
                        <div style={{ background: 'rgba(255,90,95,0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}><Zap size={20} /></div>
                        <div>
                            <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>AI Demand Forecasting</h4>
                            <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>Machine learning predicts peak hours so outlets can prep the right amount — reducing waste by up to 30%.</p>
                        </div>
                    </div>
                    <div className="card flex gap-4 items-start">
                        <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}><Star size={20} /></div>
                        <div>
                            <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>Ratings & Reviews</h4>
                            <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>Leave feedback on completed orders and help others discover the best campus food spots.</p>
                        </div>
                    </div>
                    <div className="card flex gap-4 items-start">
                        <div style={{ background: 'rgba(0,166,153,0.1)', color: 'var(--secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}><Shield size={20} /></div>
                        <div>
                            <h4 className="font-semibold" style={{ marginBottom: '0.25rem' }}>Secure & Role-Based</h4>
                            <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>JWT-based authentication with dedicated dashboards for Students, Outlet Owners, and Admins.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ──────────────── CTA ──────────────── */}
            <section style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '5rem 1rem', textAlign: 'center', color: 'white' }}>
                <h2 className="heading-2" style={{ marginBottom: '1rem', color: 'white' }}>Ready to Skip the Queue?</h2>
                <p style={{ marginBottom: '2rem', opacity: 0.9 }}>Join hundreds of students already using CampusBite.</p>
                <Link to="/register" className="btn" style={{ background: 'white', color: 'var(--primary)', padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 700 }}>
                    Create Free Account
                </Link>
            </section>

            {/* ──────────────── FOOTER ──────────────── */}
            <footer style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.5)', padding: '2rem 1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                © 2025 CampusBite · AI-Powered Smart Campus Food Ordering
            </footer>
        </div>
    );
};

export default Home;
