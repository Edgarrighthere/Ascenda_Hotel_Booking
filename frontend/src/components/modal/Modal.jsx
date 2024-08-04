import React from "react";
import "./modal.css"; // Add styles for your modal

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modalOverlay">
            <div data-testid="deleteAccountModal" className="modalContent">
                <p>{message}</p>
                <button data-testid="confirmDelete" className="deleteBtn" onClick={onConfirm}>Yes, Delete</button>
                <button data-testid="cancelDelete" className="cancelBtn" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default Modal;
