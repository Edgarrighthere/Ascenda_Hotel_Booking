import React from 'react';
import "./mailList.css";

const MailList = () => {
    return (
        <div className="mail">
            <h1 className="mailTitle">Save time, save money!</h1>
            <span className="mailDescription">Sign up now and get updated with the best deals!</span>
            <div className="mailInputContainer">
                <input type="text" placeholder="Your registered email address"/>
                <button>Subscribe now!</button>
            </div>
        </div>
    )
}

export default MailList;