import { useState } from 'react';
import type { Skill } from '../types';
import { generateId } from '../utils/helpers';
import ConfirmDialog from './ConfirmDialog';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  resumeData?: {
    summary: string;
    experiences: Array<{ description: string; }>;
  };
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    headerBg: string;
    inputBg: string;
  };
}

export default function SkillsForm({ skills, onChange, resumeData, theme }: Props) {
  const [newSkill, setNewSkill] = useState<{
    name: string;
    level: 'Básico' | 'Intermediário' | 'Avançado';
  }>({ name: '', level: 'Básico' });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    skillId: string;
    skillName: string;
  }>({ isOpen: false, skillId: '', skillName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState({ name: '', level: 'Básico' as 'Básico' | 'Intermediário' | 'Avançado' });

  const addSkill = async () => {
    if (newSkill.name.trim()) {
      setIsLoading(true);
      try {
        const skill: Skill = {
          id: generateId(),
          name: newSkill.name.trim(),
          level: newSkill.level,
        };
        onChange([...skills, skill]);
        setNewSkill({ name: '', level: 'Básico' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeSkill = (id: string, name: string) => {
    setConfirmDialog({ isOpen: true, skillId: id, skillName: name });
  };

  const startEditing = (skill: Skill) => {
    setEditingId(skill.id);
    setEditingSkill({ name: skill.name, level: skill.level });
  };

  const saveEdit = () => {
    if (editingSkill.name.trim() && editingId) {
      const updatedSkills = skills.map(skill => 
        skill.id === editingId 
          ? { ...skill, name: editingSkill.name.trim(), level: editingSkill.level }
          : skill
      );
      onChange(updatedSkills);
      setEditingId(null);
      setEditingSkill({ name: '', level: 'Básico' });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingSkill({ name: '', level: 'Básico' });
  };

  const handleConfirmRemove = () => {
    onChange(skills.filter((skill) => skill.id !== confirmDialog.skillId));
    setConfirmDialog({ isOpen: false, skillId: '', skillName: '' });
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ isOpen: false, skillId: '', skillName: '' });
  };

  const handleSuggestSkills = async () => {
    if (!resumeData) return;
    
    setIsSuggesting(true);
    try {
      // Combinar resumo e descrições de experiência
      const content = `Resumo: ${resumeData.summary}\n\nExperiências:\n${resumeData.experiences.map(exp => exp.description).join('\n')}`;
      
      const response = await fetch('http://localhost:3001/api/ai/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({
          text: content,
          type: 'skills_suggestion'
        })
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      const suggestedSkills = data.skills;
      
      // Adicionar skills sugeridas (evitar duplicatas)
      const newSkills = suggestedSkills.filter((suggested: any) => 
        !skills.some(existing => existing.name.toLowerCase() === suggested.name.toLowerCase())
      ).map((skill: any) => ({
        id: generateId(),
        name: skill.name,
        level: skill.level as 'Básico' | 'Intermediário' | 'Avançado'
      }));
      
      onChange([...skills, ...newSkills]);
    } catch (error) {
      console.error('Erro ao sugerir habilidades:', error);
      // Fallback com habilidades genéricas
      const fallbackSkills = [
        { id: generateId(), name: 'Atendimento ao Cliente', level: 'Avançado' as const },
        { id: generateId(), name: 'Comunicação', level: 'Intermediário' as const },
        { id: generateId(), name: 'Trabalho em Equipe', level: 'Avançado' as const }
      ].filter(fallback => 
        !skills.some(existing => existing.name.toLowerCase() === fallback.name.toLowerCase())
      );
      
      onChange([...skills, ...fallbackSkills]);
    } finally {
      setIsSuggesting(false);
    }
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
        {resumeData && (resumeData.summary || resumeData.experiences.some(exp => exp.description)) && (
          <button
            onClick={handleSuggestSkills}
            disabled={isSuggesting}
            className={`btn-primary ${isSuggesting ? 'loading-btn' : ''}`}
            style={{
              width: '100%',
              marginBottom: '16px',
              cursor: isSuggesting ? 'not-allowed' : 'pointer',
              opacity: isSuggesting ? 0.8 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transform: isSuggesting ? 'scale(0.98)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isSuggesting 
                ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' 
                : undefined,
            }}
          >
            {isSuggesting && <LoadingSpinner size={16} color="white" />}
            <span style={{
              transition: 'all 0.2s ease',
              opacity: isSuggesting ? 0.9 : 1,
            }}>
              {isSuggesting ? '🤖 Analisando...' : '🎩 Sugerir Habilidades com IA'}
            </span>
          </button>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Nome da habilidade"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
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
              minWidth: '130px',
            }}
          >
            <option value="Básico">Básico</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>

          <button
            onClick={addSkill}
            disabled={isLoading}
            className="btn-primary"
            style={{
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            {isLoading && <LoadingSpinner size={14} color="white" />}
            {isLoading ? 'Adicionando...' : 'Adicionar'}
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
              {editingId === skill.id ? (
                // Modo de edição
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <input
                      type="text"
                      value={editingSkill.name}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        background: theme.inputBg,
                        color: theme.text,
                      }}
                    />
                    <select
                      value={editingSkill.level}
                      onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value as 'Básico' | 'Intermediário' | 'Avançado' })}
                      style={{
                        padding: '4px 8px',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '4px',
                        fontSize: '12px',
                        background: theme.inputBg,
                        color: theme.text,
                      }}
                    >
                      <option value="Básico">Básico</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={saveEdit}
                      style={{
                        background: '#22c55e',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </>
              ) : (
                // Modo de visualização
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => startEditing(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.text,
                        opacity: 0.6,
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Editar
                    </button>
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
                </>
              )}
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
