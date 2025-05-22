import React from "react";
import { FaTimesCircle } from "react-icons/fa";

export default function Message({ message, isOpen, onClose,type }) {
  if (!isOpen) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className={`flex items-center justify-between border px-4 py-2 rounded-md shadow-sm animate-fade-in ${type === 'error' ? 'bg-red-100 text-red-700 border-red-400' : 'bg-green-100 text-green-700 border-green-400'}`}>
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-lg" />
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button onClick={onClose} className="text-red-600 hover:text-red-800 text-sm">
          <FaTimesCircle />
        </button>
      </div>
    </div>
  );
}
