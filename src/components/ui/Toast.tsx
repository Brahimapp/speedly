import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: <Check className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const bgColors = {
  success: 'bg-green-50 border-green-300',
  error: 'bg-red-50 border-red-300',
  warning: 'bg-yellow-50 border-yellow-300',
  info: 'bg-blue-50 border-blue-300',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'max-w-md rounded-lg border shadow-lg transform transition-all duration-300',
        bgColors[type],
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
      role="alert"
    >
      <div className="flex p-4">
        <div className={cn('flex-shrink-0', iconColors[type])}>
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          <div className="font-medium text-gray-900">{title}</div>
          {message && <div className="mt-1 text-sm text-gray-600">{message}</div>}
        </div>
        <button
          type="button"
          className="ml-auto flex-shrink-0 rounded-md p-1.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleClose}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;