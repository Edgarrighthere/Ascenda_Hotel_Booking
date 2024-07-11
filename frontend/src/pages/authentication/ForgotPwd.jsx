import React, { useState } from "react";
import axios from "axios";
import "./forgotPwd.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCircleExclamation, 
    faCheck 
} from "@fortawesome/free-solid-svg-icons";

const ForgotPwd = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        try {
            const response = await axios.post("http://localhost:5000/forgotPassword", { email });
            setMessage(<> <FontAwesomeIcon icon={faCheck} /> {response.data.message} </>);
        } catch (error) {
            setMessage(<> <FontAwesomeIcon icon={faCircleExclamation} /> {error.response.data.message} </>);
        }
    };

    return (
        <div className="fgtpwdPage">
            <Navbar />
            <div className="fgtpwd">
                <div className="fgtpwdContainer">
                    <div className="fgtpwdTitle">Forgot Password</div>
                    <div>
                        An email will be sent to your registered email.
                        <br />
                        Please follow the instructions to reset your password.
                    </div>
                    <input
                        type="text"
                        placeholder="Enter your registered email."
                        className="fgtpwdInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="buttonContainer">
                        <button className="fgtpwdButton" onClick={handleResetPassword}>Reset password</button>
                    </div>
                    {message && <div className="message">{message}</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPwd;