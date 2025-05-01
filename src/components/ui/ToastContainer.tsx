import React from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const positionClasses = {
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-center': 'top-0 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts,
  position = 'bottom-center'
}) => {
  const containerEl = document.getElementById('toast-container');
  
  if (!containerEl) {
    // Create container if it doesn't exist
    const newContainer = document.createElement('div');
    newContainer.id = 'toast-container';
    document.body.appendChild(newContainer);
  }

  return createPortal(
    <div
      className={`fixed z-50 m-4 flex flex-col gap-2 ${positionClasses[position]}`}
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.getElementById('toast-container') || document.body
  );
};

export default ToastContainer;