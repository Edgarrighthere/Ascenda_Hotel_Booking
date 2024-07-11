import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./resetPwd.css";

const ResetPwd = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleResetPassword = async () => {
        try {
            const response = await axios.post("http://localhost:5000/resetPassword", { token, newPassword });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div className="resetpwdPage">
            <div className="resetpwdContainer">
                <div className="resetpwdTitle">Reset Password</div>
                <input
                    type="password"
                    placeholder="Enter your new password"
                    className="resetpwdInput"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="resetpwdButton" onClick={handleResetPassword}>Reset Password</button>
                {message && <div className="message">{message}</div>}
            </div>
        </div>
    );
};

export default ResetPwd;
