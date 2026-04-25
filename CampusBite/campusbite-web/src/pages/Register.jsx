import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const { register, googleLogin } = useAuth();
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
            const user = await register(formData.name, formData.email, formData.password, formData.role);
            redirectByRole(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const user = await googleLogin(credentialResponse.credential);
            redirectByRole(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-up failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card">
                <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
                {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" name="name" className="input-control" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" className="input-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" className="input-control" value={formData.password} onChange={handleChange} minLength="6" required />
                    </div>
                    <div className="input-group">
                        <label>I am a...</label>
                        <select name="role" className="input-control" value={formData.role} onChange={handleChange} disabled>
                            <option value="student">Student</option>
                        </select>
                        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--gray)' }}>
                            Are you a Cafeteria Owner? <Link to="/partner" style={{ color: 'var(--primary)', fontWeight: '600' }}>Partner with us.</Link>
                        </p>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Register
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ color: 'var(--gray)', fontSize: '0.85rem', fontWeight: 500 }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>

                {/* Google Sign-Up Button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google sign-up was cancelled or failed.')}
                        size="large"
                        width="100%"
                        text="signup_with"
                        shape="rectangular"
                        theme="outline"
                    />
                </div>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
