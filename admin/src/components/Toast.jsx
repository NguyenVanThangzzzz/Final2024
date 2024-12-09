import React, { useEffect } from 'react';
import { FaCheck, FaTimes, FaInfo, FaExclamationTriangle } from 'react-icons/fa';
import './Toast.css';

const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

const ToastIcon = ({ type }) => {
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return <FaCheck />;
    case TOAST_TYPES.ERROR:
      return <FaTimes />;
    case TOAST_TYPES.WARNING:
      return <FaExclamationTriangle />;
    case TOAST_TYPES.INFO:
      return <FaInfo />;
    default:
      return null;
  }
};

const Toast = ({ message, type = TOAST_TYPES.SUCCESS, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast-container ${type}`}>
      <div className="toast-content">
        <div className="toast-icon">
          <ToastIcon type={type} />
        </div>
        <div className="toast-message">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
export { TOAST_TYPES }; 