import React from 'react';
import './index.css';

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-75 flex items-center justify-center"
      style={{ zIndex: 1000 }}
    >
      <div
        className="modal-content"
      >
        <button
          onClick={onClose}
          className="modal-close-button"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
