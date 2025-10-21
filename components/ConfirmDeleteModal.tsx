
import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  artworkTitle: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  artworkTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
          <p className="mt-2 text-gray-600">
            Are you sure you want to delete "<strong>{artworkTitle}</strong>"? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-stretch items-center bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-1/2 py-3 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors rounded-bl-2xl focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-3 px-4 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors rounded-br-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
