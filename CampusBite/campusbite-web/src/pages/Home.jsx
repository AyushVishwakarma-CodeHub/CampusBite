import React, { useState, useRef, useEffect } from 'react';
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

    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* ──────────────── NAVBAR ──────────────── */}
            <nav className="absolute top-0 left-0 w-full z-50 bg-transparent py-2">
                <div className="container flex justify-between items-center py-3">
                    <Link to="/" className="text-2xl font-bold tracking-tight">
                        <span style={{ color: '#FF5A5F' }}>Campus</span>
                        <span className="text-white drop-shadow-sm">Bite</span>
                    </Link>

                    <div className="flex gap-5 items-center">
                        {user ? (
                            <button className="btn btn-primary shadow-lg shadow-primary/30" onClick={() => {
                                if (user.role === 'student') navigate('/student/dashboard');
                                else if (user.role === 'outlet') navigate('/outlet/dashboard');
                                else navigate('/admin/dashboard');
                            }}>
                                Go to Dashboard
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="font-semibold text-white/90 hover:text-white transition-colors" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary shadow-lg shadow-primary/30 px-6 py-2">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ──────────────── HERO ──────────────── */}
            <section style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '5rem 1rem',
            }}>
                {/* Background Video - Campus Cafeteria Queue */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="hero-video"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100vw',
                        minHeight: '100%',
                        objectFit: 'cover',
                        transform: 'translate(-50%, -50%) scale(1.15)',
                        transformOrigin: 'center center',
                        zIndex: 0,
                    }}
                >
                    <source src="/campus-food-queue.mp4" type="video/mp4" />
                </video>

                {/* Dark cinematic gradient overlay (like Zomato) */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.70) 60%, rgba(0,0,0,0.85) 100%)',
                    zIndex: 1
                }}></div>

                {/* Unmute Button */}
                <button
                    onClick={toggleMute}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        right: '2rem',
                        zIndex: 3,
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        backdropFilter: 'blur(8px)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                    {isMuted ? '🔇 Unmute Video' : '🔊 Mute Video'}
                </button>

                {/* Hero Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '820px',
                    margin: '0 auto',
                }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(255,90,95,0.2)',
                        border: '1px solid rgba(255,90,95,0.6)',
                        color: '#ff7a7e',
                        borderRadius: '999px',
                        padding: '0.35rem 1.1rem',
                        fontSize: '0.78rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        marginBottom: '1.8rem',
                    }}>
                        🎓 Designed for Campus Life
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                        fontWeight: 800,
                        color: '#ffffff',
                        lineHeight: 1.15,
                        marginBottom: '1.2rem',
                        textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                    }}>
                        Skip the Queue.<br />
                        <span style={{
                            background: 'linear-gradient(135deg, #FF5A5F, #00A699)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Order Smarter.
                        </span>
                    </h1>

                    <p style={{
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: '1.15rem',
                        maxWidth: '560px',
                        margin: '0 auto 2.8rem',
                        lineHeight: 1.8,
                        textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                    }}>
                        No more standing in long cafeteria lines. Pre-order your campus meals, choose a pickup time slot, and collect your food instantly.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            background: 'linear-gradient(135deg, #FF5A5F, #e04045)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.9rem 2.4rem',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            boxShadow: '0 4px 20px rgba(255,90,95,0.4)',
                            transition: 'transform 0.2s',
                        }}>
                            Order Now — It's Free
                        </Link>
                        <Link to="/login" style={{
                            background: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.4)',
                            borderRadius: '8px',
                            padding: '0.9rem 2.4rem',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            backdropFilter: 'blur(8px)',
                            transition: 'transform 0.2s',
                        }}>
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

            {/* ──────────────── PARTNERSHIP CTA ──────────────── */}
            <section style={{ background: 'var(--light)', padding: '5rem 1rem', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div className="badge badge-success" style={{ marginBottom: '1rem', display: 'inline-block' }}>BUSINESS PARTNERSHIPS</div>
                    <h2 className="heading-2" style={{ marginBottom: '1rem' }}>Run a Campus Cafeteria?</h2>
                    <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Partner with CampusBite to digitize your menu, eliminate chaotic physical queues, and boost your sales with our AI forecasting engine.
                    </p>
                    <Link to="/partner" className="btn btn-outline" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                        Partner with CampusBite
                    </Link>
                </div>
            </section>

            {/* ──────────────── FOOTER ──────────────── */}
            <footer style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.7)', padding: '3rem 1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                <div className="container flex flex-col items-center gap-4">
                    <p style={{ fontWeight: 600, color: 'white', letterSpacing: '0.05em' }}>
                        Developed by <span style={{ color: 'var(--primary)' }}>Ayush Raj</span>
                    </p>
                    <div className="flex gap-4" style={{ marginBottom: '1rem' }}>
                        <a href="https://www.linkedin.com/in/ayushraj2908" target="_blank" rel="noreferrer"
                            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.target.style.color = 'white'}
                            onMouseOut={(e) => e.target.style.color = 'var(--primary)'}>
                            LinkedIn
                        </a>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <a href="https://github.com/AyushVishwakarma-CodeHub/" target="_blank" rel="noreferrer"
                            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.target.style.color = 'white'}
                            onMouseOut={(e) => e.target.style.color = 'var(--primary)'}>
                            GitHub
                        </a>
                        <span style={{ opacity: 0.3 }}>|</span>
                        <a href="mailto:ayushthesweetdabang@gmail.com"
                            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.target.style.color = 'white'}
                            onMouseOut={(e) => e.target.style.color = 'var(--primary)'}>
                            Contact
                        </a>
                    </div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                        © {new Date().getFullYear()} CampusBite · AI-Powered Smart Campus Food Ordering
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
