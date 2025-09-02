import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        background: type === 'success' 
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
        animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <span>{type === 'success' ? '✓' : '✗'}</span>
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
        `}
      </style>
    </div>
  );
}