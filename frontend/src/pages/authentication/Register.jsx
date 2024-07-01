import React, { useState } from "react";
import "./register.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEye,
    faEyeSlash,
    faCircleExclamation
} from "@fortawesome/free-solid-svg-icons";

const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleRegister = () => {
        if (!email || !username || !password || !confirmPassword) {
            setError(<><FontAwesomeIcon icon={faCircleExclamation} /> Check that all fields are filled!</>);
        } else if (password !== confirmPassword) {
            setError(<><FontAwesomeIcon icon={faCircleExclamation} /> Passwords do not match!</>);
        } else {
            setError("");
            // Proceed with registration logic
        }
    };

    return (
        <div className="registerPage">
            <Navbar />
            <div className="register">
                <div className="registerContainer">
                    <div className="registerTitle">Register</div>
                    <input
                        type="text"
                        placeholder="Enter a registered email, eg. someone123@gmail.com"
                        className="registerInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter your username"
                        className="registerInput"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="passwordInputContainer">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password."
                            className="registerInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="passwordToggleIcon">
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <div className="passwordInputContainer">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Re-enter your password."
                            className="registerInput"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="passwordToggleIcon">
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    {error && <div className="error">{error}</div>}
                    <div className="buttonContainer">
                        <button className="registerButton" onClick={handleRegister}>Register Now!</button>
                    </div>
                </div>
            </div> 
            <Footer />
        </div>
    );
};

export default Register;