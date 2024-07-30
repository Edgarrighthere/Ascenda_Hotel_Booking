import React from "react";
import "./modal.css"; // Add styles for your modal

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <p>{message}</p>
                <button className="deleteBtn" onClick={onConfirm}>Yes, Delete</button>
                <button className="cancelBtn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default Modal;
