import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // espera a animação antes de remover
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        background:
          type === 'success'
            ? 'linear-gradient(135deg, var(--caramel), var(--toffee))'
            : 'linear-gradient(135deg, var(--error), #b91c1c)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '600',
        animation: `${isVisible ? 'slideIn' : 'slideOut'} 0.3s ease`,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <span style={{ fontSize: '18px' }}>
        {type === 'success' ? '✅' : '❌'}
      </span>
      {message}

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%) scale(0.9);
              opacity: 0;
            }
            to {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
            to {
              transform: translateX(100%) scale(0.9);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
