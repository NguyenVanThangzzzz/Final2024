import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-gray-800 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex justify-center px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 