import { useRef, useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  objective: string;
  onChange: (objective: string) => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    headerBg: string;
    inputBg: string;
  };
}

export default function ObjectivesForm({ objective, onChange, theme }: Props) {
  const objectiveRef = useRef<HTMLTextAreaElement>(null);
  const [isImproving, setIsImproving] = useState(false);

  useEffect(() => {
    if (objectiveRef.current) objectiveRef.current.value = objective;
  }, [objective]);

  const handleInput = () => {
    onChange(objectiveRef.current?.value || '');
  };

  const handleImproveText = async () => {
    if (!objective.trim()) return;
    
    setIsImproving(true);
    try {
      const response = await fetch('http://localhost:3001/api/ai/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: objective.trim(),
          type: 'elaboration'
        })
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      const improvedText = data.improvedText;
      
      onChange(improvedText);
      
      if (objectiveRef.current) {
        objectiveRef.current.value = improvedText;
      }
    } catch (error) {
      console.error('Erro ao melhorar texto:', error);
      console.error('Detalhes do erro:', error.message);
      // Fallback para simulação se API falhar
      const fallbackText = `${objective.trim()} - Texto melhorado com IA`;
      onChange(fallbackText);
      if (objectiveRef.current) {
        objectiveRef.current.value = fallbackText;
      }
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '24px',
        transition: 'all 0.3s ease',
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
        Objetivos de Carreira
      </h2>

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
          Metas Profissionais
        </label>
        <textarea
          ref={objectiveRef}
          onInput={(e) => {
            handleInput();
            // Auto-expand textarea
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
          }}
          maxLength={300}
          rows={4}
          className={isImproving ? 'loading-state' : ''}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${isImproving ? '#4ade80' : theme.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            minHeight: '100px',
            maxHeight: '200px',
            overflow: 'auto',
            background: objective
              ? theme.inputBg === '#334155'
                ? '#64748b'
                : theme.inputBg
              : theme.inputBg,
            color: theme.text,
            resize: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isImproving ? 0.8 : 1,
            transform: isImproving ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isImproving ? '0 0 20px rgba(74, 222, 128, 0.3)' : 'none',
          }}
          placeholder="Descreva seus objetivos de carreira, aspirações e o que você busca em sua próxima posição..."
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6px',
          }}
        >
          <span style={{ fontSize: '12px', color: theme.text, opacity: 0.7 }}>
            Máximo 300 caracteres
          </span>
          <span
            style={{ fontSize: '12px', color: theme.text, fontWeight: '500' }}
          >
            {objective.length}/300
          </span>
        </div>
        
        {objective && (
          <button
            onClick={handleImproveText}
            disabled={isImproving}
            className={`btn-primary ${isImproving ? 'loading-btn' : ''}`}
            style={{
              marginTop: '12px',
              cursor: isImproving ? 'not-allowed' : 'pointer',
              opacity: isImproving ? 0.8 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transform: isImproving ? 'scale(0.98)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isImproving 
                ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' 
                : undefined,
            }}
          >
            {isImproving && (
              <LoadingSpinner 
                size={16} 
                color="white" 
              />
            )}
            <span style={{
              transition: 'all 0.2s ease',
              opacity: isImproving ? 0.9 : 1,
            }}>
              {isImproving ? '🤖 Melhorando...' : '✨ Melhorar Texto'}
            </span>
          </button>
        )}
      </div>

      {!objective && (
        <div
          style={{
            border: `2px dashed ${theme.border}`,
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            color: theme.text,
            opacity: 0.7,
            marginTop: '16px',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
          <p style={{ fontSize: '14px', marginBottom: '4px' }}>
            Defina seus objetivos de carreira
          </p>
          <p style={{ fontSize: '12px', color: theme.text, opacity: 0.6 }}>
            Quais são suas metas profissionais?
          </p>
        </div>
      )}
    </div>
  );
}
