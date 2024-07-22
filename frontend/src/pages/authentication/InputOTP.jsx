import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCircleExclamation, 
    faCheck 
} from "@fortawesome/free-solid-svg-icons";
import './inputOTP.css';

const InputOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const salutation  = location.state?.salutation;
    const firstName  = location.state?.firstName;
    const lastName  = location.state?.lastName;
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); 
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
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> OTP must be 6 digits. </>);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/verify_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpString })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(<> <FontAwesomeIcon icon={faCheck} /> Valid OTP entered. Redirecting you to home page... </>);
                setError(""); // Clear any previous errors
                setTimeout(() => {
                    navigate('/', { state: { salutation, firstName, lastName } });
                }, 3000); // Redirect after 3 seconds
            } else {
                setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Invalid OTP. Please make sure you entered the correct OTP sent. </>);
            }
        } catch (error) {
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Error verifying OTP. </>);
            setSuccess(""); // Clear success message if there was any
        }
    };

    const handleResend = async () => {
        try {
            const response = await fetch('http://localhost:5000/resend_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                alert('Check your registered email for the code.');
            } else {
                setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Invalid email. </>);
            }
        } catch (error) {
            setError('Error resending OTP');
        }
    };

    return (
        <div className="otpPage">
            <Navbar />
            <div className="inputotp">
                <div data-test="otpContainer" className="otpContainer">
                    <div data-test="otpTitle" className="otpTitle">2FA Authentication</div>
                    <div data-test="otpTitle1" className="otpTitle1">Please check your email for the OTP sent.</div>
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
                        <button data-test="verifyOTPBtn" className="verifyButton" onClick={handleVerify}>Verify OTP</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>} 
                    <div className="resendContainer">
                        <span>Didn't receive code?</span>
                        <button className="resendButton" onClick={handleResend}>Resend code</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InputOTP;
