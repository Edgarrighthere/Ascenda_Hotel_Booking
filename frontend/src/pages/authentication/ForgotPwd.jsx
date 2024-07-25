import React, { useState } from 'react';
import axios from 'axios';
import './forgotPwd.css';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCircleExclamation, 
    faCheck 
} from "@fortawesome/free-solid-svg-icons";

const ForgotPwd = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('http://localhost:4999/forgot-password', { email });
            if (response.status === 200) {
                setSuccess(<> <FontAwesomeIcon icon={faCheck} /> {response.data.message} </>);
                setError(""); // Clear any previous errors
            }
        } catch (error) {
            setError(<><FontAwesomeIcon icon={faCircleExclamation} /> {error.response?.data?.message || 'An error occurred. Please try again.'}</>);
            setSuccess(""); // Clear success message if there was any
        }
    };

    return (
        <div className="forgotPasswordPage">
            <Navbar />
            <div className="forgotPwd">
                <div data-test="forgotPwdContainer" className="forgotPasswordContainer">
                    <h1 data-test="forgotPwdTitle" className="forgotPasswordTitle">Forgot Password</h1>
                    <input
                        type="email"
                        placeholder="Enter your registered email."
                        className="forgotPasswordInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="fgtpwdbuttonContainer">
                        <button data-testid="forgotPwdBtn" data-test="forgotPwdBtn" className="forgotPasswordButton" onClick={handleForgotPassword}>Send Reset Password Email</button>
                    </div>
                    {success && <div className="success">{success}</div>}
                    {error && <div data-testid="error-message" className="error">{error}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPwd;
