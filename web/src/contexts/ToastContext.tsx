import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

import { MyToast } from '../models/MyToast';

interface ToastContextData {
  addToast: (toast: MyToast) => void;
  removeToast: (id: number) => void;
}

interface Toaste {
  id: number;
  toast: MyToast;
}

interface ToastContextProviderProps {
  children: ReactNode;
}

export const ToastContext = createContext({} as ToastContextData);

// let toastCount = 0;

export function ToastProvider({ children }: ToastContextProviderProps) {
  const [toasts, setToasts] = useState<Toaste[]>([]);
  const router = useRouter();

  useEffect(() => {
    const toastNotification: Toaste[] = Cookies.getJSON('toasts');

    if (toastNotification) {
      setToasts(toastNotification);
    }

  }, []);

  const addToast = toast => {
    const id = toasts.length + 1;
    const newToast = { toast, id };
    setToasts([...toasts, newToast]);
  }

  const removeToast = id => {
    const newToasts = toasts.filter(t => t.id !== id);
    setToasts(newToasts);
  };

  useEffect(() => {
    Cookies.set('toasts', toasts);
  }, [toasts])

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast
      }}
    >
      {children}
      <ToastContainer
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '100%',
          maxWidth: '30rem'
        }}
      >
        {toasts.map(({ toast, id }) => (
          <Toast
            key={id}
            show={true}
            onClose={() => removeToast(id)}
            delay={toast.delay}
            autohide={toast.autohide}
            bg={toast.variant}
          >
            <Toast.Header>
              {toast.img}
              <strong className="me-auto">{toast.title}</strong>
              <small>{toast.time}</small>
            </Toast.Header>
            <Toast.Body>{toast.content}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export const useToasts = () => React.useContext(ToastContext);