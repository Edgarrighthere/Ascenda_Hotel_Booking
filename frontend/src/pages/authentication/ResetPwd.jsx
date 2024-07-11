import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './resetPwd.css';

const ResetPwd = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${token}`, { password });
            if (response.status === 200) {
                setMessage(response.data.message);
                setError('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="resetPasswordPage">
            <div className="resetPasswordContainer">
                <h1>Reset Password</h1>
                <input
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleResetPassword}>Reset Password</button>
                {message && <div className="message">{message}</div>}
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
};

export default ResetPwd;