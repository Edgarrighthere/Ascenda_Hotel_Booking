import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './resetPwd.css';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEye,
    faEyeSlash,
    faCircleExclamation, 
    faCheck 
} from "@fortawesome/free-solid-svg-icons";

const ResetPwd = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState("");
    const { token } = useParams();

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${token}`, { password, confirmPassword });
            if (response.status === 200) {
                setSuccess(<> <FontAwesomeIcon icon={faCheck} /> {response.data.message} </>);
                setError(""); // Clear any previous errors
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> {error.response?.data?.message} </> || "An error occurred. Please try again.");
            setSuccess(""); // Clear success message if there was any
        }
    };

    return (
        <div className="resetPasswordPage">
            <Navbar />
            <div className="resetPassword">
                <div className="resetPasswordContainer">
                    <div className="resetPasswordTitle">Reset Password</div>
                    <div className="resetPasswordInputContainer">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="resetPasswordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="passwordToggleIcon">
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <div className="confirmPasswordInputContainer">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className="confirmPasswordInput"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="passwordToggleIcon">
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <div className="resetPasswordButtonContainer">
                        <button className="resetPasswordButton" onClick={handleResetPassword}>Reset Password</button>
                    </div>
                    {success && <div className="sucess">{success}</div>}
                    {error && <div className="error">{error}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResetPwd;
