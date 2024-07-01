import React, { useState, useNavigate } from "react";
import "./login.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEye,
    faEyeSlash 
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    //const navigate = useNavigate(); //use to redirect between pages

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    //const handleForgetPassword = () => {
        //navigate("/resetPassword");
    //};

    return (
        <div className="loginPage">
            <Navbar />
            <div className="login">
                <div className="loginContainer">
                    <div className="loginTitle">Log in</div>
                    <input
                        type="text"
                        placeholder="Enter your registered username/email."
                        className="loginInput"
                    />
                    <div className="passwordInputContainer">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your registered password."
                            className="loginInput"
                        />
                        <span onClick={togglePasswordVisibility} className="passwordToggleIcon">
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <div className="buttonContainer">
                        <button className="loginButton">Login</button>
                        <button className="forgotPassword">Forgot Password?</button>
                    </div>
                </div>
            </div> 
            <Footer />
        </div>
    );
};

export default Login;
