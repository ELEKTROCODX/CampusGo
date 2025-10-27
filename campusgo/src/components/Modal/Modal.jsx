import React from 'react';
import './Modal.css';

// 'onClose' se llama cuando se hace clic en el fondo
function Modal({ children, onClose }) {
  return (
    <div className="Modal__overlay" onClick={onClose}>
      {/* Detenemos la propagación para que el clic en el modal no lo cierre */}
      <div className="Modal__box" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;