import { useState } from 'react';
import type { Skill } from '../types';
import { generateId } from '../utils/helpers';
import ConfirmDialog from './ConfirmDialog';

interface Props {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    headerBg: string;
    inputBg: string;
  };
}

export default function SkillsForm({ skills, onChange, theme }: Props) {
  const [newSkill, setNewSkill] = useState<{
    name: string;
    level: 'Básico' | 'Intermediário' | 'Avançado';
  }>({ name: '', level: 'Básico' });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    skillId: string;
    skillName: string;
  }>({ isOpen: false, skillId: '', skillName: '' });

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: generateId(),
        name: newSkill.name.trim(),
        level: newSkill.level,
      };
      onChange([...skills, skill]);
      setNewSkill({ name: '', level: 'Básico' });
    }
  };

  const removeSkill = (id: string, name: string) => {
    setConfirmDialog({ isOpen: true, skillId: id, skillName: name });
  };

  const handleConfirmRemove = () => {
    onChange(skills.filter((skill) => skill.id !== confirmDialog.skillId));
    setConfirmDialog({ isOpen: false, skillId: '', skillName: '' });
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ isOpen: false, skillId: '', skillName: '' });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico':
        return { background: '#fef3c7', color: '#92400e' };
      case 'Intermediário':
        return { background: '#dbeafe', color: '#1e40af' };
      case 'Avançado':
        return { background: '#d1fae5', color: '#065f46' };
      default:
        return { background: '#f3f4f6', color: '#374151' };
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
        Habilidades
      </h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Nome da habilidade"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            style={{
              flex: '1',
            }}
          />

          <select
            value={newSkill.level}
            onChange={(e) =>
              setNewSkill({
                ...newSkill,
                level: e.target.value as
                  | 'Básico'
                  | 'Intermediário'
                  | 'Avançado',
              })
            }
            style={{
              minWidth: '120px',
            }}
          >
            <option value="Básico">Básico</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>

          <button
            onClick={addSkill}
            className="btn-primary"
          >
            Adicionar
          </button>
        </div>
      </div>

      {skills.length === 0 ? (
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
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
          <p style={{ fontSize: '14px', marginBottom: '4px' }}>
            Nenhuma habilidade adicionada
          </p>
          <p style={{ fontSize: '12px', color: theme.text, opacity: 0.6 }}>
            Adicione suas principais competências
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {skills.map((skill) => (
            <div
              key={skill.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                background: theme.inputBg,
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: theme.text,
                  }}
                >
                  {skill.name}
                </span>
                <span
                  style={{
                    ...getLevelColor(skill.level),
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {skill.level}
                </span>
              </div>
              <button
                onClick={() => removeSkill(skill.id, skill.name)}
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
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remover Habilidade"
        message={`Tem certeza que deseja remover "${confirmDialog.skillName}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        theme={theme}
      />
    </div>
  );
}
