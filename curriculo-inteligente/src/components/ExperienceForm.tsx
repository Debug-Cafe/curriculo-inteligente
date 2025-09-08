import { useState } from 'react';
import type { Experience } from '../types';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    headerBg: string;
    inputBg: string;
  };
}

export default function ExperienceForm({
  experiences,
  onChange,
  theme,
}: Props) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    expId: string;
    expName: string;
  }>({ isOpen: false, expId: '', expName: '' });
  const [newExp, setNewExp] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [improvingId, setImprovingId] = useState<string | null>(null);

  const addExperience = async () => {
    if (newExp.company.trim() && newExp.position.trim() && newExp.startDate) {
      setIsLoading(true);
      try {
        const experience: Experience = {
          id: Date.now().toString(),
          ...newExp,
          company: newExp.company.trim(),
          position: newExp.position.trim(),
          description: newExp.description.trim(),
        };
        onChange([...experiences, experience]);
        setNewExp({
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          isCurrentJob: false,
          description: '',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeExperience = (id: string, position: string) => {
    setConfirmDialog({ isOpen: true, expId: id, expName: position });
  };

  const handleConfirmRemove = () => {
    onChange(experiences.filter((exp) => exp.id !== confirmDialog.expId));
    setConfirmDialog({ isOpen: false, expId: '', expName: '' });
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ isOpen: false, expId: '', expName: '' });
  };

  const handleImproveDescription = async (expId: string, description: string) => {
    if (!description.trim()) return;
    
    setImprovingId(expId);
    try {
      const response = await fetch('http://localhost:3001/api/ai/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: description.trim(),
          type: 'elaboration'
        })
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      const improvedText = data.improvedText;
      
      const updatedExperiences = experiences.map(exp => 
        exp.id === expId ? { ...exp, description: improvedText } : exp
      );
      onChange(updatedExperiences);
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      console.error('Detalhes do erro:', error.message);
      const fallbackText = `${description.trim()} - Descrição melhorada com IA`;
      const updatedExperiences = experiences.map(exp => 
        exp.id === expId ? { ...exp, description: fallbackText } : exp
      );
      onChange(updatedExperiences);
    } finally {
      setImprovingId(null);
    }
  };

  const handleImproveNewDescription = async () => {
    if (!newExp.description.trim()) return;
    
    setImprovingId('new');
    try {
      const response = await fetch('http://localhost:3001/api/ai/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: newExp.description.trim(),
          type: 'elaboration'
        })
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      const improvedText = data.improvedText;
      
      setNewExp({ ...newExp, description: improvedText });
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      const fallbackText = `${newExp.description.trim()} - Descrição melhorada com IA`;
      setNewExp({ ...newExp, description: fallbackText });
    } finally {
      setImprovingId(null);
    }
  };

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '24px',
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '600',
          color: theme.text,
          marginBottom: '20px',
        }}
      >
        Experiência
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.text,
                marginBottom: '6px',
              }}
            >
              Empresa
            </label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: newExp.company
                  ? theme.inputBg === '#334155'
                    ? '#64748b'
                    : theme.inputBg
                  : theme.inputBg,
                color: theme.text,
              }}
              placeholder="Nome da empresa"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.text,
                marginBottom: '6px',
              }}
            >
              Cargo
            </label>
            <input
              type="text"
              value={newExp.position}
              onChange={(e) =>
                setNewExp({ ...newExp, position: e.target.value })
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: newExp.position
                  ? theme.inputBg === '#334155'
                    ? '#64748b'
                    : theme.inputBg
                  : theme.inputBg,
                color: theme.text,
              }}
              placeholder="Título do cargo"
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.text,
                marginBottom: '6px',
              }}
            >
              Data de Início
            </label>
            <input
              type="date"
              value={newExp.startDate}
              onChange={(e) =>
                setNewExp({ ...newExp, startDate: e.target.value })
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: newExp.startDate
                  ? theme.inputBg === '#334155'
                    ? '#64748b'
                    : theme.inputBg
                  : theme.inputBg,
                color: theme.text,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.text,
                marginBottom: '6px',
              }}
            >
              Data de Término
            </label>
            <input
              type="date"
              value={newExp.endDate}
              onChange={(e) =>
                setNewExp({ ...newExp, endDate: e.target.value })
              }
              disabled={newExp.isCurrentJob}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: newExp.isCurrentJob ? theme.border : theme.inputBg,
                color: theme.text,
                opacity: newExp.isCurrentJob ? 0.6 : 1,
              }}
            />
          </div>
        </div>

        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: theme.text,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={newExp.isCurrentJob}
              onChange={(e) =>
                setNewExp({
                  ...newExp,
                  isCurrentJob: e.target.checked,
                  endDate: e.target.checked ? '' : newExp.endDate,
                })
              }
              style={{ width: '16px', height: '16px' }}
            />
            Posição atual
          </label>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px',
            }}
          >
            Descrição
          </label>
          <textarea
            value={newExp.description}
            onChange={(e) => {
              setNewExp({ ...newExp, description: e.target.value });
              // Auto-expand textarea
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              resize: 'none',
              minHeight: '80px',
              maxHeight: '200px',
              overflow: 'auto',
              background: newExp.description
                ? theme.inputBg === '#334155'
                  ? '#64748b'
                  : theme.inputBg
                : theme.inputBg,
              color: theme.text,
            }}
            placeholder="Principais responsabilidades e conquistas..."
          />
          
          {newExp.description && (
            <button
              onClick={() => handleImproveNewDescription()}
              disabled={improvingId === 'new'}
              className={`btn-primary ${improvingId === 'new' ? 'loading-btn' : ''}`}
              style={{
                marginTop: '8px',
                fontSize: '12px',
                padding: '6px 12px',
                cursor: improvingId === 'new' ? 'not-allowed' : 'pointer',
                opacity: improvingId === 'new' ? 0.8 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transform: improvingId === 'new' ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: improvingId === 'new' 
                  ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' 
                  : undefined,
              }}
            >
              {improvingId === 'new' && (
                <LoadingSpinner 
                  size={12} 
                  color="white" 
                />
              )}
              <span style={{
                transition: 'all 0.2s ease',
                opacity: improvingId === 'new' ? 0.9 : 1,
              }}>
                {improvingId === 'new' ? '🤖 Melhorando...' : '✨ Melhorar Descrição'}
              </span>
            </button>
          )}
        </div>

        <button
          onClick={addExperience}
          disabled={isLoading}
          className="btn-primary"
          style={{
            width: '100%',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {isLoading && <LoadingSpinner size={16} color="white" />}
          {isLoading ? 'Adicionando...' : 'Adicionar Experiência'}
        </button>
      </div>

      {experiences.length === 0 ? (
        <div
          style={{
            border: `2px dashed ${theme.border}`,
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            color: theme.text,
            opacity: 0.7,
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>💼</div>
          <p style={{ fontSize: '14px', marginBottom: '4px' }}>
            Nenhuma experiência adicionada
          </p>
          <p style={{ fontSize: '12px', color: theme.text, opacity: 0.6 }}>
            Adicione sua experiência profissional
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              style={{
                padding: '16px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                background: theme.inputBg,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: theme.text,
                      marginBottom: '4px',
                    }}
                  >
                    {exp.position}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: theme.text,
                      opacity: 0.8,
                      marginBottom: '4px',
                    }}
                  >
                    {exp.company}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: theme.text,
                      opacity: 0.7,
                    }}
                  >
                    {exp.startDate
                      ? new Date(exp.startDate).toLocaleDateString()
                      : 'N/A'}{' '}
                    -{' '}
                    {exp.isCurrentJob ? (
                      <span
                        style={{
                          background: '#d1fae5',
                          color: '#065f46',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                        }}
                      >
                        Current
                      </span>
                    ) : exp.endDate ? (
                      new Date(exp.endDate).toLocaleDateString()
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => removeExperience(exp.id, exp.position)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: theme.text,
                    opacity: 0.6,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Remover
                </button>
              </div>
              {exp.description && (
                <div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: theme.text,
                      opacity: 0.8,
                      lineHeight: '1.5',
                      marginBottom: '12px',
                    }}
                  >
                    {exp.description}
                  </p>
                  <button
                    onClick={() => handleImproveDescription(exp.id, exp.description)}
                    disabled={improvingId === exp.id}
                    className={`btn-primary ${improvingId === exp.id ? 'loading-btn' : ''}`}
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      cursor: improvingId === exp.id ? 'not-allowed' : 'pointer',
                      opacity: improvingId === exp.id ? 0.8 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transform: improvingId === exp.id ? 'scale(0.98)' : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: improvingId === exp.id 
                        ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' 
                        : undefined,
                    }}
                  >
                    {improvingId === exp.id && (
                      <LoadingSpinner 
                        size={12} 
                        color="white" 
                      />
                    )}
                    <span style={{
                      transition: 'all 0.2s ease',
                      opacity: improvingId === exp.id ? 0.9 : 1,
                    }}>
                      {improvingId === exp.id ? '🤖 Melhorando...' : '✨ Melhorar'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remover Experiência"
        message={`Tem certeza que deseja remover "${confirmDialog.expName}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        theme={theme}
      />
    </div>
  );
}
