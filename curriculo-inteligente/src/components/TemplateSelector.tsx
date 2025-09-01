import { useState } from 'react';

interface Props {
  template: string;
  onChange: (template: string) => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
  };
}

export default function TemplateSelector({ template, onChange, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    { id: 'modern', name: 'Moderno', color: '#3b82f6' },
    { id: 'classic', name: 'Clássico', color: '#6366f1' },
    { id: 'creative', name: 'Criativo', color: '#8b5cf6' },
    { id: 'minimal', name: 'Minimalista', color: '#64748b' },
    { id: 'professional', name: 'Profissional', color: '#059669' },
    { id: 'elegant', name: 'Elegante', color: '#dc2626' }
  ];

  const currentTemplate = templates.find(t => t.id === template) || templates[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: theme.text,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minWidth: '140px'
        }}
      >
        <span>{currentTemplate.name}</span>
        <span style={{ 
          marginLeft: 'auto',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => {
                onChange(tmpl.id);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: template === tmpl.id ? `${tmpl.color}15` : 'transparent',
                border: 'none',
                borderBottom: `1px solid ${theme.border}`,
                fontSize: '14px',
                fontWeight: '500',
                color: template === tmpl.id ? tmpl.color : theme.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (template !== tmpl.id) {
                  e.currentTarget.style.background = `${theme.border}50`;
                }
              }}
              onMouseLeave={(e) => {
                if (template !== tmpl.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >

              <div>
                <div style={{ fontWeight: '600' }}>{tmpl.name}</div>
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.7,
                  marginTop: '2px'
                }}>
                  {tmpl.id === 'modern' && 'Design limpo e atual'}
                  {tmpl.id === 'classic' && 'Tradicional e formal'}
                  {tmpl.id === 'creative' && 'Colorido e dinâmico'}
                  {tmpl.id === 'minimal' && 'Simples e direto'}
                  {tmpl.id === 'professional' && 'Corporativo e sério'}
                  {tmpl.id === 'elegant' && 'Sofisticado e refinado'}
                </div>
              </div>
              {template === tmpl.id && (
                <span style={{ 
                  marginLeft: 'auto',
                  color: tmpl.color,
                  fontSize: '16px'
                }}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}