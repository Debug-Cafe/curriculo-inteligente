import { useState } from 'react';
import { generateId } from '../utils/helpers';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrentStudy: boolean;
}

interface Props {
  educations: Education[];
  onChange: (educations: Education[]) => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    headerBg: string;
    inputBg: string;
  };
}

export default function EducationForm({ educations, onChange, theme }: Props) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    eduId: string;
    eduName: string;
  }>({ isOpen: false, eduId: '', eduName: '' });
  const [newEdu, setNewEdu] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    isCurrentStudy: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const addEducation = async () => {
    if (newEdu.institution.trim() && newEdu.degree.trim()) {
      setIsLoading(true);
      try {
        const education: Education = {
          id: generateId(),
          ...newEdu,
          institution: newEdu.institution.trim(),
          degree: newEdu.degree.trim(),
          field: newEdu.field.trim(),
        };
        onChange([...educations, education]);
        setNewEdu({
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          isCurrentStudy: false,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeEducation = (id: string, degree: string) => {
    setConfirmDialog({ isOpen: true, eduId: id, eduName: degree });
  };

  const handleConfirmRemove = () => {
    onChange(educations.filter((edu) => edu.id !== confirmDialog.eduId));
    setConfirmDialog({ isOpen: false, eduId: '', eduName: '' });
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ isOpen: false, eduId: '', eduName: '' });
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
        Educação
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
          <input
            type="text"
            placeholder="Instituição"
            value={newEdu.institution}
            onChange={(e) =>
              setNewEdu({ ...newEdu, institution: e.target.value })
            }
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              background: newEdu.institution
                ? theme.inputBg === '#334155'
                  ? '#64748b'
                  : theme.inputBg
                : theme.inputBg,
              color: theme.text,
            }}
          />
          <input
            type="text"
            placeholder="Grau"
            value={newEdu.degree}
            onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              background: newEdu.degree
                ? theme.inputBg === '#334155'
                  ? '#64748b'
                  : theme.inputBg
                : theme.inputBg,
              color: theme.text,
            }}
          />
        </div>

        <input
          type="text"
          placeholder="Área de Estudo"
          value={newEdu.field}
          onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
          style={{
            padding: '10px 12px',
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            background: newEdu.field
              ? theme.inputBg === '#334155'
                ? '#64748b'
                : theme.inputBg
              : theme.inputBg,
            color: theme.text,
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <input
            type="date"
            value={newEdu.startDate}
            onChange={(e) =>
              setNewEdu({ ...newEdu, startDate: e.target.value })
            }
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              background: newEdu.startDate
                ? theme.inputBg === '#334155'
                  ? '#64748b'
                  : theme.inputBg
                : theme.inputBg,
              color: theme.text,
            }}
          />
          <input
            type="date"
            value={newEdu.endDate}
            onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
            disabled={newEdu.isCurrentStudy}
            style={{
              padding: '10px 12px',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              background: newEdu.isCurrentStudy
                ? theme.border
                : newEdu.endDate
                  ? theme.inputBg === '#334155'
                    ? '#64748b'
                    : theme.inputBg
                  : theme.inputBg,
              color: theme.text,
              opacity: newEdu.isCurrentStudy ? 0.6 : 1,
            }}
          />
        </div>

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
            checked={newEdu.isCurrentStudy}
            onChange={(e) =>
              setNewEdu({
                ...newEdu,
                isCurrentStudy: e.target.checked,
                endDate: e.target.checked ? '' : newEdu.endDate,
              })
            }
            style={{ width: '16px', height: '16px' }}
          />
          Estudando atualmente
        </label>

        <button
          onClick={addEducation}
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
          {isLoading ? 'Adicionando...' : 'Adicionar Educação'}
        </button>
      </div>

      {educations.length === 0 ? (
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
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎓</div>
          <p style={{ fontSize: '14px', marginBottom: '4px' }}>
            Nenhuma educação adicionada
          </p>
          <p style={{ fontSize: '12px', color: theme.text, opacity: 0.6 }}>
            Adicione sua formação acadêmica
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {educations.map((edu) => (
            <div
              key={edu.id}
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
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: theme.text,
                      opacity: 0.8,
                      marginBottom: '4px',
                    }}
                  >
                    {edu.institution}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: theme.text,
                      opacity: 0.7,
                    }}
                  >
                    {edu.startDate
                      ? new Date(edu.startDate).getFullYear()
                      : 'N/A'}{' '}
                    -{' '}
                    {edu.isCurrentStudy ? (
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
                    ) : edu.endDate ? (
                      new Date(edu.endDate).getFullYear()
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => removeEducation(edu.id, edu.degree)}
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
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remover Formação"
        message={`Tem certeza que deseja remover "${confirmDialog.eduName}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        theme={theme}
      />
    </div>
  );
}
