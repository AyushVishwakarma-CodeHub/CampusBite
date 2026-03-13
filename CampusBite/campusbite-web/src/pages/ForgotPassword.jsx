import React, { useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message || 'If an account exists, a reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process request. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card" style={{ maxWidth: '400px', width: '90%' }}>
                <h2 className="heading-2" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Reset Password</h2>
                <p style={{ color: 'var(--gray)', textAlign: 'center', marginBottom: '20px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message && <div style={{ padding: '12px', backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)', color: '#4CAF50', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>}
                {error && <div style={{ padding: '12px', backgroundColor: 'rgba(244, 67, 54, 0.1)', border: '1px solid rgba(244, 67, 54, 0.3)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input-control"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)' }}>
                    Remembered your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
