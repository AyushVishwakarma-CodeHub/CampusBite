import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            if (user.role === 'student') navigate('/student/dashboard');
            else if (user.role === 'outlet') navigate('/outlet/dashboard');
            else if (user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
