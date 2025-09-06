import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  template: string;
  onChange: (template: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional' | 'elegant') => void;
  theme: { bg: string; cardBg: string; text: string; border: string };
}

const templates = [
    { id: 'modern',      name: 'Moderno',      color: '#603010' },
    { id: 'classic',     name: 'Clássico',     color: '#c08030' },
    { id: 'creative',    name: 'Criativo',     color: '#c08040' },
    { id: 'minimal',     name: 'Minimalista',  color: '#c07040' },
    { id: 'professional',name: 'Profissional', color: '#603010' },
    { id: 'elegant',     name: 'Elegante',     color: '#e0c0b0' },
  ];

export default function TemplateSelector({ template, onChange, theme }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const current = templates.find(t => t.id === template) ?? templates[0];

  function open() {
    if (!buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    setRect({ top: r.bottom + 4, left: r.left, width: r.width });
    setIsOpen(true);
  }

  // Reposiciona ao rolar/redimensionar
  useLayoutEffect(() => {
    if (!isOpen) return;
    const recalc = () => {
      if (!buttonRef.current) return;
      const r = buttonRef.current.getBoundingClientRect();
      setRect({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    window.addEventListener('scroll', recalc, true);
    window.addEventListener('resize', recalc);
    return () => {
      window.removeEventListener('scroll', recalc, true);
      window.removeEventListener('resize', recalc);
    };
  }, [isOpen]);

  return (
    <div style={{ position: 'relative', zIndex: 2000 }}>
      <button
        ref={buttonRef}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          color: theme.text,
          cursor: 'pointer',
          minWidth: '140px',
        }}
      >
        <span>{current.name}</span>
        <span
          style={{
            marginLeft: 'auto',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: rect.top,
              left: rect.left,
              width: rect.width,
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              boxShadow:
                '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
              zIndex: 2147483647, // máximo prático
              overflow: 'hidden',
              maxWidth: '180px',
            }}
          >
            {templates.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() =>
                  onChange(tmpl.id as 'modern' | 'classic' | 'creative' | 'minimal' | 'professional' | 'elegant')
                }
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background:
                    template === tmpl.id ? `${tmpl.color}15` : 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${theme.border}`,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: template === tmpl.id ? tmpl.color : theme.text,
                  cursor: 'pointer',
                  textAlign: 'left',
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
                  <div style={{ fontWeight: 600 }}>{tmpl.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                    {tmpl.id === 'modern' && 'Design limpo e atual'}
                    {tmpl.id === 'classic' && 'Tradicional e formal'}
                    {tmpl.id === 'creative' && 'Colorido e dinâmico'}
                    {tmpl.id === 'minimal' && 'Simples e direto'}
                    {tmpl.id === 'professional' && 'Corporativo e sério'}
                    {tmpl.id === 'elegant' && 'Sofisticado e refinado'}
                  </div>
                </div>
                {template === tmpl.id && (
                  <span style={{ marginLeft: 'auto', color: tmpl.color, fontSize: 16 }}>✓</span>
                )}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}