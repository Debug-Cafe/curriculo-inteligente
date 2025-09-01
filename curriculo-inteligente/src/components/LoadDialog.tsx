import { useState, useEffect } from 'react';

interface Resume {
  id: string;
  personalData: { name: string };
}

interface Props {
  isOpen: boolean;
  resumes: Resume[];
  onLoad: (id: string) => void;
  onCancel: () => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
  };
}

export default function LoadDialog({
  isOpen,
  resumes,
  onLoad,
  onCancel,
  theme,
}: Props) {
  const [selectedId, setSelectedId] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setSelectedId('');
    }
  }, [isOpen]);

  const handleLoad = () => {
    if (selectedId) {
      setIsVisible(false);
      setTimeout(() => onLoad(selectedId), 150);
    }
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
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
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
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            📂
          </div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: theme.text,
              margin: 0,
            }}
          >
            Carregar Currículo
          </h3>
        </div>

        {resumes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '32px',
              color: theme.text,
              opacity: 0.7,
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>
              Nenhum currículo salvo
            </p>
            <p style={{ fontSize: '14px' }}>
              Salve um currículo primeiro para poder carregá-lo
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: '14px',
                color: theme.text,
                opacity: 0.8,
                marginBottom: '16px',
              }}
            >
              Selecione um currículo para carregar:
            </p>

            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '20px',
              }}
            >
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => setSelectedId(resume.id)}
                  style={{
                    padding: '12px 16px',
                    border: `1px solid ${selectedId === resume.id ? '#3b82f6' : theme.border}`,
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    background:
                      selectedId === resume.id ? '#eff6ff' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: theme.text,
                          margin: '0 0 4px 0',
                        }}
                      >
                        {resume.personalData.name || 'Sem nome'}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: theme.text,
                          opacity: 0.6,
                          margin: 0,
                        }}
                      >
                        ID: {resume.id}
                      </p>
                    </div>
                    {selectedId === resume.id && (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

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
          {resumes.length > 0 && (
            <button
              onClick={handleLoad}
              disabled={!selectedId}
              style={{
                padding: '10px 20px',
                background: selectedId ? '#3b82f6' : theme.border,
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                cursor: selectedId ? 'pointer' : 'not-allowed',
                opacity: selectedId ? 1 : 0.6,
                transition: 'all 0.2s ease',
              }}
            >
              Carregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
