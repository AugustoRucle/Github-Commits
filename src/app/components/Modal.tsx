'use client';

import type React from 'react';

/**
 * @summary A simple modal component.
 * @param {object} props - The properties for the component.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {Function} props.onClose - The function to call to close the modal.
 * @param {string} props.title - The title of the modal.
 * @param {React.ReactNode} props.children - The content of the modal.
 * @returns {JSX.Element | null} A modal element or null.
 */
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-black">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
