import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import './inputOTP.css';

const InputOTP = ({ onVerify }) => {
    const location = useLocation();
    const email = location.state?.email;
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            if (otp[index] === '') {
                if (index > 0) {
                    newOtp[index - 1] = '';
                    inputRefs.current[index - 1].focus();
                }
            } else {
                newOtp[index] = '';
            }
            setOtp(newOtp);
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        try {
            const response = await fetch('/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpString })
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
                    <div className="otpTitle1">Please check your email for the OPT sent.</div>
                    <div className="otpInputContainer">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => inputRefs.current[index] = el}
                                maxLength="1"
                            />
                        ))}
                    </div>
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
