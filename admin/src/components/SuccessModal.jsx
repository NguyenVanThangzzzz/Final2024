import React, { useEffect } from 'react';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-modal-content">
          <div className="checkmark"></div>
          <p className="success-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 