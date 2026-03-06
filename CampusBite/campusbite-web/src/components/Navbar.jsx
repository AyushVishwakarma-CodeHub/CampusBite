import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ShoppingBag, LayoutDashboard, Store, Shield } from 'lucide-react';

const NAV_LINKS = {
    student: [
        { to: '/student/dashboard', label: 'Outlets', icon: <Store size={16} /> },
        { to: '/student/orders', label: 'My Orders', icon: <ShoppingBag size={16} /> },
    ],
    outlet: [
        { to: '/outlet/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    ],
    admin: [
        { to: '/admin/dashboard', label: 'Console', icon: <Shield size={16} /> },
    ],
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const homeLink = user
        ? user.role === 'student'
            ? '/student/dashboard'
            : `/${user.role}/dashboard`
        : '/';

    const links = user ? NAV_LINKS[user.role] || [] : [];

    return (
        <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)' }}>
            <div className="container flex justify-between items-center" style={{ height: '70px' }}>
                {/* Logo */}
                <Link to={homeLink} className="flex items-center gap-2">
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.05em' }}>
                        Campus<span style={{ color: 'var(--dark)' }}>Bite</span>
                    </span>
                </Link>

                {/* Nav Links */}
                {user && (
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center gap-2"
                                style={{
                                    padding: '0.4rem 0.9rem',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: 'var(--dark)',
                                    textDecoration: 'none',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--light)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </div>
                )}

                {/* User Info & Actions */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2" style={{ fontWeight: 500, color: 'var(--dark)' }}>
                                <div style={{ background: 'var(--primary)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.875rem', fontWeight: 700 }}>
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="hidden md:block">
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray)', textTransform: 'capitalize' }}>{user.role}</div>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2" style={{ padding: '0.4rem 0.9rem' }}>
                                <LogOut size={15} /> <span className="hidden md:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
