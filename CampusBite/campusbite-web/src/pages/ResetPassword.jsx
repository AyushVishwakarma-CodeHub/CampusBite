import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Extract the token dynamically from the secure URL parameters
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, { password });
            setMessage(res.data.message || 'Password successfully reset!');

            // Redirect to login after successful reset
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token. Please try requesting a new reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '400px', width: '90%' }}>
                <h2 className="login-title">Create New Password</h2>
                <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>
                    Enter your new secure password below to regain access to your CampusBite account.
                </p>

                {message && <div style={{ padding: '10px', backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{message} Redirecting to login...</div>}
                {error && <div style={{ padding: '10px', backgroundColor: 'rgba(244, 67, 54, 0.2)', color: '#f44336', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

                {!message && (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter secure new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: '15px' }}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button" disabled={loading} style={{ marginTop: '20px' }}>
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <p className="register-link" style={{ marginTop: '20px' }}>
                    <Link to="/login" style={{ color: '#aaa' }}>Return to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
