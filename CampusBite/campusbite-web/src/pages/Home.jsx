import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Clock, ShoppingBag, Star, Zap, Shield, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';

const FEATURES = [
    {
        icon: <ChefHat size={28} />,
        color: '#FF5A5F',
        title: 'Browse Campus Outlets',
        desc: 'Explore menus from all food joints across the campus with live availability.',
        step: '01',
    },
    {
        icon: <Clock size={28} />,
        color: '#00A699',
        title: 'Pre-Book a Time Slot',
        desc: 'Select a precise 10-minute pickup window to skip the queue entirely.',
        step: '02',
    },
    {
        icon: <ShoppingBag size={28} />,
        color: '#F59E0B',
        title: 'Grab & Go',
        desc: 'Show your digital token at the counter and collect freshly made food.',
        step: '03',
    },
];

const STATS = [
    { value: '10+', label: 'Campus Outlets' },
    { value: '500+', label: 'Students Served' },
    { value: '0 min', label: 'Average Wait' },
    { value: '4.8★', label: 'User Rating' },
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
        <div style={{ minHeight: '100vh', background: 'var(--light)' }}>

            {/* ──────────────── NAVBAR ──────────────── */}
            <nav style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: '1.25rem 0',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                        <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FF5A5F', letterSpacing: '-0.02em' }}>Campus</span>
                        <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Bite</span>
                    </Link>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {user ? (
                            <button
                                onClick={() => {
                                    if (user.role === 'student') navigate('/student/dashboard');
                                    else if (user.role === 'outlet') navigate('/outlet/dashboard');
                                    else navigate('/admin/dashboard');
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #FF5A5F, #e04045)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '0.7rem 1.8rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 20px rgba(255,90,95,0.4)',
                                }}
                            >
                                Go to Dashboard
                            </button>
                        ) : (
                            <>
                                <Link to="/login" style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    textDecoration: 'none',
                                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                                    padding: '0.5rem 0.75rem',
                                }}>
                                    Login
                                </Link>
                                <Link to="/register" style={{
                                    background: 'linear-gradient(135deg, #FF5A5F, #e04045)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '0.65rem 1.6rem',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 20px rgba(255,90,95,0.4)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}>
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
            }}>
                {/* Background Video */}
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 0,
                    }}
                >
                    <source src="/campus-food-queue.mp4" type="video/mp4" />
                </video>

                {/* Cinematic overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.85) 100%)',
                    zIndex: 1,
                }} />

                {/* Unmute button */}
                <button
                    onClick={toggleMute}
                    style={{
                        position: 'absolute',
                        bottom: '2rem',
                        right: '2rem',
                        zIndex: 3,
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: 'white',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '999px',
                        backdropFilter: 'blur(12px)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.2s',
                    }}
                >
                    {isMuted ? <><VolumeX size={16} /> Unmute</> : <><Volume2 size={16} /> Mute</>}
                </button>

                {/* Hero content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    maxWidth: '780px',
                    margin: '0 auto',
                    padding: '0 2rem',
                }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255,90,95,0.15)',
                        border: '1px solid rgba(255,90,95,0.4)',
                        color: '#ff9a9d',
                        borderRadius: '999px',
                        padding: '0.4rem 1.2rem',
                        fontSize: '0.78rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        marginBottom: '2rem',
                        backdropFilter: 'blur(8px)',
                    }}>
                        🎓 Designed for Campus Life
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
                        fontWeight: 800,
                        color: '#ffffff',
                        lineHeight: 1.12,
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.03em',
                    }}>
                        Skip the Queue.
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #FF5A5F 0%, #FF8A8D 50%, #00A699 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Order Smarter.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        color: 'rgba(255,255,255,0.75)',
                        fontSize: 'clamp(1rem, 2vw, 1.18rem)',
                        maxWidth: '520px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.75,
                    }}>
                        Pre-order your campus meals, choose a pickup time slot, and collect your food — no more waiting in long cafeteria lines.
                    </p>

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            background: 'linear-gradient(135deg, #FF5A5F, #e04045)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '1rem 2.2rem',
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            boxShadow: '0 8px 30px rgba(255,90,95,0.45)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}>
                            Order Now — It's Free <ArrowRight size={18} />
                        </Link>
                        <Link to="/login" style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '12px',
                            padding: '1rem 2.2rem',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            backdropFilter: 'blur(12px)',
                            transition: 'transform 0.2s, background 0.2s',
                        }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ──────────────── STATS BAR ──────────────── */}
            <section style={{
                background: 'var(--dark)',
                padding: '2.5rem 2rem',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '2rem',
                    textAlign: 'center',
                }}>
                    {STATS.map((s, i) => (
                        <div key={i}>
                            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FF5A5F', marginBottom: '0.25rem' }}>{s.value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────── HOW IT WORKS ──────────────── */}
            <section style={{ padding: '6rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(255,90,95,0.08)',
                            color: '#FF5A5F',
                            borderRadius: '999px',
                            padding: '0.35rem 1rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                        }}>
                            How It Works
                        </div>
                        <h2 style={{
                            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                            fontWeight: 800,
                            color: 'var(--dark)',
                            letterSpacing: '-0.03em',
                            marginBottom: '0.75rem',
                        }}>
                            Three Steps. Zero Hassle.
                        </h2>
                        <p style={{ color: 'var(--gray)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.05rem' }}>
                            From browsing menus to collecting food — it takes less than 2 minutes.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                    }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={{
                                background: 'white',
                                border: '1px solid var(--border)',
                                borderRadius: '1.25rem',
                                padding: '2.5rem 2rem',
                                textAlign: 'center',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {/* Step number watermark */}
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1.5rem',
                                    fontSize: '4rem',
                                    fontWeight: 900,
                                    color: 'rgba(0,0,0,0.04)',
                                    lineHeight: 1,
                                }}>
                                    {f.step}
                                </div>

                                <div style={{
                                    display: 'inline-flex',
                                    background: `${f.color}14`,
                                    color: f.color,
                                    padding: '1rem',
                                    borderRadius: '1rem',
                                    marginBottom: '1.5rem',
                                }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--dark)' }}>{f.title}</h3>
                                <p style={{ color: 'var(--gray)', lineHeight: 1.7, fontSize: '0.95rem' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────────────── EXTRA FEATURES ──────────────── */}
            <section style={{ background: 'var(--light)', padding: '5rem 2rem', borderTop: '1px solid var(--border)' }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {[
                        { icon: <Zap size={20} />, color: '#FF5A5F', bg: 'rgba(255,90,95,0.08)', title: 'AI Demand Forecasting', desc: 'ML predicts peak hours so outlets prep right — reducing food waste by up to 30%.' },
                        { icon: <Star size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.08)', title: 'Ratings & Reviews', desc: 'Leave feedback on orders and help others discover the best campus food spots.' },
                        { icon: <Shield size={20} />, color: '#00A699', bg: 'rgba(0,166,153,0.08)', title: 'Secure & Role-Based', desc: 'JWT auth with dedicated dashboards for Students, Outlet Owners, and Admins.' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '1rem',
                            padding: '1.75rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start',
                            transition: 'box-shadow 0.3s',
                        }}
                            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'}
                            onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{ background: item.bg, color: item.color, padding: '0.7rem', borderRadius: '0.7rem', flexShrink: 0 }}>{item.icon}</div>
                            <div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.35rem', fontSize: '1rem', color: 'var(--dark)' }}>{item.title}</h4>
                                <p style={{ color: 'var(--gray)', fontSize: '0.9rem', lineHeight: 1.65 }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────── CTA ──────────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #FF5A5F 0%, #00A699 100%)',
                padding: '5rem 2rem',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em',
                    }}>
                        Ready to Skip the Queue?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2.5rem', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        Join hundreds of students already using CampusBite to order smarter.
                    </p>
                    <Link to="/register" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'white',
                        color: '#FF5A5F',
                        padding: '1rem 2.5rem',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        borderRadius: '12px',
                        textDecoration: 'none',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s',
                    }}>
                        Create Free Account <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ──────────────── PARTNERSHIP CTA ──────────────── */}
            <section style={{ padding: '5rem 2rem', textAlign: 'center', background: 'white', borderTop: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '580px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'rgba(16,185,129,0.08)',
                        color: '#10b981',
                        borderRadius: '999px',
                        padding: '0.35rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        marginBottom: '1.25rem',
                    }}>
                        Business Partnerships
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        fontWeight: 800,
                        color: 'var(--dark)',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em',
                    }}>
                        Run a Campus Cafeteria?
                    </h2>
                    <p style={{ color: 'var(--gray)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
                        Partner with CampusBite to digitize your menu, eliminate chaotic queues, and boost your sales with our AI forecasting engine.
                    </p>
                    <Link to="/partner" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '2px solid #FF5A5F',
                        color: '#FF5A5F',
                        background: 'transparent',
                        padding: '0.85rem 2rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        borderRadius: '12px',
                        textDecoration: 'none',
                        transition: 'background 0.2s, color 0.2s',
                    }}>
                        Partner with CampusBite <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ──────────────── FOOTER ──────────────── */}
            <footer style={{
                background: 'var(--dark)',
                color: 'rgba(255,255,255,0.6)',
                padding: '3rem 2rem',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ fontWeight: 600, color: 'white', letterSpacing: '0.03em', fontSize: '0.95rem' }}>
                        Developed by <span style={{ color: '#FF5A5F' }}>Ayush Raj</span>
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {[
                            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayushraj2908' },
                            { label: 'GitHub', href: 'https://github.com/AyushVishwakarma-CodeHub/' },
                            { label: 'Website', href: 'https://ayushrajvishwakarma.in' },
                            { label: 'Contact', href: 'mailto:ayushthesweetdabang@gmail.com' },
                        ].map((link, i) => (
                            <a key={i} href={link.href} target="_blank" rel="noreferrer" style={{
                                color: '#FF5A5F',
                                textDecoration: 'none',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                transition: 'color 0.2s',
                            }}>
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <p style={{ fontSize: '0.78rem', opacity: 0.4, marginTop: '0.5rem' }}>
                        © {new Date().getFullYear()} CampusBite · AI-Powered Smart Campus Food Ordering
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
