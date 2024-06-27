import React from "react";
import "./login.css";

const Login = () => {
    return (
        <div className="login">
            <div className="loginContainer">
            <img src="images/background_01.png" alt="" />
                <div className="loginTitle">Log in</div>
                <input
                    type="text"
                    placeholder="Enter your registered username/email."
                    className="loginInput"
                />
                <input
                    type="password"
                    placeholder="Enter your registered password."
                    className="loginInput"
                />
                <button className="loginButton">Login</button>
            </div>
        </div>
        
    );
};

export default Login;