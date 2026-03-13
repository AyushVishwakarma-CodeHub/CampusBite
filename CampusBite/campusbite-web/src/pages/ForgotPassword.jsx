import React, { useState } from 'react';
import axios from 'axios';
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
            setMessage(res.data.message || 'If an account exists, a reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process request. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '400px', width: '90%' }}>
                <h2 className="login-title">Reset Password</h2>
                <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {message && <div style={{ padding: '10px', backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{message}</div>}
                {error && <div style={{ padding: '10px', backgroundColor: 'rgba(244, 67, 54, 0.2)', color: '#f44336', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="register-link" style={{ marginTop: '20px' }}>
                    Remembered your password? <Link to="/login" style={{ color: '#FF5A5F' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
