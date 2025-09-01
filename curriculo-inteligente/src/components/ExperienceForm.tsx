import { useState } from 'react';
import type { Experience } from '../types';
import ConfirmDialog from './ConfirmDialog';

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

export default function ExperienceForm({ experiences, onChange, theme }: Props) {
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; expId: string; expName: string }>({ isOpen: false, expId: '', expName: '' });
  const [newExp, setNewExp] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    description: ''
  });

  const addExperience = () => {
    if (newExp.company.trim() && newExp.position.trim() && newExp.startDate) {
      const experience: Experience = {
        id: Date.now().toString(),
        ...newExp,
        company: newExp.company.trim(),
        position: newExp.position.trim(),
        description: newExp.description.trim()
      };
      onChange([...experiences, experience]);
      setNewExp({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: ''
      });
    }
  };

  const removeExperience = (id: string, position: string) => {
    setConfirmDialog({ isOpen: true, expId: id, expName: position });
  };

  const handleConfirmRemove = () => {
    onChange(experiences.filter(exp => exp.id !== confirmDialog.expId));
    setConfirmDialog({ isOpen: false, expId: '', expName: '' });
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ isOpen: false, expId: '', expName: '' });
  };

  return (
    <div style={{
      background: theme.cardBg,
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      padding: '24px'
    }}>
      <h2 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: theme.text,
        marginBottom: '20px'
      }}>
        Experiência
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px'
            }}>
              Empresa
            </label>
            <input
              type="text"
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: newExp.company ? (theme.inputBg === '#334155' ? '#64748b' : theme.inputBg) : theme.inputBg,
                color: theme.text
              }}
              placeholder="Nome da empresa"
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px'
            }}>
              Cargo
            </label>
            <input
              type="text"
              value={newExp.position}
              onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: newExp.position ? (theme.inputBg === '#334155' ? '#64748b' : theme.inputBg) : theme.inputBg,
                color: theme.text
              }}
              placeholder="Título do cargo"
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px'
            }}>
              Data de Início
            </label>
            <input
              type="date"
              value={newExp.startDate}
              onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                background: newExp.startDate ? (theme.inputBg === '#334155' ? '#64748b' : theme.inputBg) : theme.inputBg,
                color: theme.text
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: theme.text,
              marginBottom: '6px'
            }}>
              Data de Término
            </label>
            <input
              type="date"
              value={newExp.endDate}
              onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
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
                opacity: newExp.isCurrentJob ? 0.6 : 1
              }}
            />
          </div>
        </div>
        
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: theme.text,
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={newExp.isCurrentJob}
              onChange={(e) => setNewExp({ ...newExp, isCurrentJob: e.target.checked, endDate: e.target.checked ? '' : newExp.endDate })}
              style={{ width: '16px', height: '16px' }}
            />
            Posição atual
          </label>
        </div>
        
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: theme.text,
            marginBottom: '6px'
          }}>
            Descrição
          </label>
          <textarea
            value={newExp.description}
            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              resize: 'none',
              background: newExp.description ? (theme.inputBg === '#334155' ? '#64748b' : theme.inputBg) : theme.inputBg,
              color: theme.text
            }}
            placeholder="Principais responsabilidades e conquistas..."
          />
        </div>
        
        <button
          onClick={addExperience}
          style={{
            width: '100%',
            padding: '12px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Adicionar Experiência
        </button>
      </div>
      
      {experiences.length === 0 ? (
        <div style={{
          border: `2px dashed ${theme.border}`,
          borderRadius: '8px',
          padding: '32px',
          textAlign: 'center',
          color: theme.text,
          opacity: 0.7
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>💼</div>
          <p style={{ fontSize: '14px', marginBottom: '4px' }}>Nenhuma experiência adicionada</p>
          <p style={{ fontSize: '12px', color: theme.text, opacity: 0.6 }}>Adicione sua experiência profissional</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {experiences.map((exp) => (
            <div key={exp.id} style={{
              padding: '16px',
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              background: theme.inputBg
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, marginBottom: '4px' }}>
                    {exp.position}
                  </h3>
                  <p style={{ fontSize: '14px', color: theme.text, opacity: 0.8, marginBottom: '4px' }}>
                    {exp.company}
                  </p>
                  <p style={{ fontSize: '12px', color: theme.text, opacity: 0.7 }}>
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {' '}
                    {exp.isCurrentJob ? (
                      <span style={{
                        background: '#d1fae5',
                        color: '#065f46',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        Current
                      </span>
                    ) : (
                      exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A'
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
                    fontSize: '14px'
                  }}
                >
                  Remover
                </button>
              </div>
              {exp.description && (
                <p style={{ fontSize: '14px', color: theme.text, opacity: 0.8, lineHeight: '1.5' }}>
                  {exp.description}
                </p>
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