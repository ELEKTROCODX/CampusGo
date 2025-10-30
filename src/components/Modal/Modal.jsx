import React from 'react';
import './Modal.css';

function Modal({ children, onClose }) {
  return (
    <div className="Modal__overlay" onClick={onClose}>
      <div className="Modal__box" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;