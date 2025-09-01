import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
  };
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  theme,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(onConfirm, 150);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(onCancel, 150);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease',
      }}
    >
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.15s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            ⚠️
          </div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.text,
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: theme.text,
            opacity: 0.8,
            lineHeight: '1.5',
            margin: '0 0 24px 0',
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
