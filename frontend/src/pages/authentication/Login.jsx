import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCircleExclamation, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [salutation, setSalutation] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/login", {
                identifier,
                password
            });

            if (response && response.data && response.status === 200) {
                setSuccess(<> <FontAwesomeIcon icon={faCheck} /> {response.data.message} </>);
                setError(""); // Clear any previous errors
                setSalutation(response.data.salutation); 
                setFirstName(response.data.firstName); 
                setLastName(response.data.lastName); 
                setTimeout(() => {
                    navigate("/inputOTP", { state: { email: identifier, salutation: response.data.salutation, firstName: response.data.firstName, lastName: response.data.lastName } }); // Pass email, salutation, firstName and lastName to inputOTP
                }, 2000);
            } else {
                setError("Invalid response from server."); // Handle unexpected response
            }
        } catch (err) {
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> {err.response?.data?.message} </> || "An error occurred. Please try again.");
            setSuccess(""); // Clear success message if there was any
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgotPassword");
    };

    return (
        <div className="loginPage">
            <Navbar />
            <div className="login">
                <div className="loginContainer">
                    <div className="loginTitle">Log in</div>
                    <input
                        type="text"
                        placeholder="Enter your registered email."
                        className="loginInput"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <div className="passwordInputContainer">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your registered password."
                            className="loginInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="passwordToggleIcon">
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <div className="loginbuttonContainer">
                        <button className="loginButton" onClick={handleLogin}>Login</button>
                        <button className="forgotPassword" onClick={handleForgotPassword}>Forgot Password?</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
