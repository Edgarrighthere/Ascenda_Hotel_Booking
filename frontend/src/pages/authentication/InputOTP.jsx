import React, { useState } from 'react';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import './inputOTP.css';

const InputOTP = ({ email, onVerify }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    
    const handleChange = (e) => {
        setOtp(e.target.value);
    };
    
    const handleVerify = async () => {
        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        try {
            const response = await fetch('/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await response.json();

            if (data.success) {
                onVerify();
            } else {
                setError('Invalid OTP');
            }
        } catch (error) {
            setError('Error verifying OTP');
        }
    };

    return (
        <div className="otpPage">
            <Navbar />
            <div className="inputotp">
                <div className="otpContainer">
                    <div className="otpTitle">2FA Authentication</div>
                    <input 
                        type="text" 
                        value={otp} 
                        onChange={handleChange} 
                        placeholder="Enter your OTP"
                        maxLength="6"
                    />
                    <div className="buttonContainer">
                        <button className="verifyButton" onClick={handleVerify}>Verify OTP</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InputOTP;
