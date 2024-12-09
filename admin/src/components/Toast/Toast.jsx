import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const toastTypes = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-100 border-green-400 text-green-700',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-100 border-red-400 text-red-700',
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  },
  info: {
    icon: Info,
    className: 'bg-blue-100 border-blue-400 text-blue-700',
  },
};

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const { icon: Icon, className } = toastTypes[type] || toastTypes.info;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg border ${className}`}
      role="alert"
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="sr-only">{type}:</span>
      <div className="ml-3 text-sm font-medium mr-5">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 hover:bg-gray-100"
      >
        <span className="sr-only">Close</span>
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toast; 