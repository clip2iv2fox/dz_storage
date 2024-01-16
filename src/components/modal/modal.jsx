import React from 'react';
import "./modal.css"

const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className='modal-header'>
                    <h3>{title}</h3>
                    <i className="fa fa-remove" style={{fontSize:"24px", cursor: "pointer"}} onClick={onClose}></i>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
