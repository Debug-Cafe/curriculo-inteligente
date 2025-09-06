import { useRef, useEffect, useState } from 'react';

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
  const [selectedTone, setSelectedTone] = useState('formal');

  useEffect(() => {
    if (objectiveRef.current) objectiveRef.current.value = objective;
  }, [objective]);

  const handleInput = () => {
    onChange(objectiveRef.current?.value || '');
  };

  const handleImproveWithAI = async () => {
    try {
      const res = await fetch('/api/melhorar-texto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: objectiveRef.current?.value,
          tom: selectedTone,
        }),
      });
      const data = await res.json();
      if (data.textoMelhorado) {
        onChange(data.textoMelhorado);
        if (objectiveRef.current) objectiveRef.current.value = data.textoMelhorado;
      }
    } catch (err) {
      console.error('Erro ao melhorar objetivo:', err);
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
          onInput={handleInput}
          maxLength={300}
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            background: objective ? theme.inputBg : theme.inputBg,
            color: theme.text,
            resize: 'none',
            transition: 'all 0.3s ease',
          }}
          placeholder="Descreva seus objetivos de carreira, aspirações e o que você busca em sua próxima posição..."
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6px',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '12px', color: theme.text, opacity: 0.7 }}>
            Máximo 300 caracteres
          </span>
          <span style={{ fontSize: '12px', color: theme.text, fontWeight: '500' }}>
            {objective.length}/300
          </span>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: `1px solid ${theme.border}`,
              background: theme.inputBg,
              color: theme.text,
              fontSize: '12px',
            }}
          >
            <option value="formal">Formal</option>
            <option value="semi-formal">Semi-formal</option>
            <option value="casual">Casual</option>
          </select>
          <button
            onClick={handleImproveWithAI}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              background: '#f48c3c',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Melhorar com IA
          </button>
        </div>
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
