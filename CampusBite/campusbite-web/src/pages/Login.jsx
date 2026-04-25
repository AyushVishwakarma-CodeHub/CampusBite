import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const redirectByRole = (user) => {
        if (user.role === 'student') navigate('/student/dashboard');
        else if (user.role === 'outlet') navigate('/outlet/dashboard');
        else if (user.role === 'admin') navigate('/admin/dashboard');
        else navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            redirectByRole(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const user = await googleLogin(credentialResponse.credential);
            redirectByRole(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed');
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card">
                <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Welcome Back</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'none' }}>
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Login
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ color: 'var(--gray)', fontSize: '0.85rem', fontWeight: 500 }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>

                {/* Google Sign-In Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google sign-in was cancelled or failed.')}
                        size="large"
                        width="100%"
                        text="signin_with"
                        shape="rectangular"
                        theme="outline"
                    />
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
