import React from "react";
import "./modal.css"; // Add styles for your modal

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <p>{message}</p>
                <button onClick={onConfirm}>Yes, Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default Modal;
