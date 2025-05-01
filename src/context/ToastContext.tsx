import React, { createContext, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { ToastProps, ToastType } from '@/components/ui/Toast';

// Types
type ToastAction = 
  | { type: 'ADD_TOAST'; payload: Omit<ToastProps, 'id' | 'onClose'> }
  | { type: 'REMOVE_TOAST'; payload: { id: string } };

interface ToastContextType {
  toasts: ToastProps[];
  toast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Reducer
function toastReducer(state: ToastProps[], action: ToastAction): ToastProps[] {
  switch (action.type) {
    case 'ADD_TOAST':
      return [
        ...state,
        {
          id: uuidv4(),
          ...action.payload,
          onClose: () => {},
        },
      ];
    case 'REMOVE_TOAST':
      return state.filter((toast) => toast.id !== action.payload.id);
    default:
      return state;
  }
}

// Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const toast = (type: ToastType, title: string, message?: string, duration = 5000) => {
    dispatch({
      type: 'ADD_TOAST',
      payload: { type, title, message, duration },
    });
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: { id } });
  };

  const contextValue: ToastContextType = {
    toasts,
    toast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts.map((toast) => ({
          ...toast,
          onClose: removeToast,
        }))}
      />
    </ToastContext.Provider>
  );
};

// Hook
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};