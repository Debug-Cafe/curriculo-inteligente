import type { Resume } from '../types';

interface Props {
  resume: Resume;
  template: 'modern' | 'classic' | 'creative' | 'minimal' | 'professional' | 'elegant';
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    headerBg: string;
  };
}

export default function ResumePreview({ resume, template, theme }: Props) {
  const { personalData, skills, experiences } = resume;

  const getTemplateStyles = () => {
    switch (template) {
      case 'classic':
        return {
          headerBg: 'var(--espresso)',
          accentColor: 'var(--cinnamon)',
          font: 'Georgia, serif',
        };
      case 'creative':
        return {
          headerBg: 'linear-gradient(135deg, #d2691e 0%, #ff6347 50%, #ffa500 100%)',
          accentColor: '#ff6347',
          font: 'Inter, sans-serif',
        };
      case 'minimal':
        return {
          headerBg: 'var(--cinnamon)',
          accentColor: 'var(--toffee)',
          font: 'Inter, sans-serif',
        };
      case 'professional':
        return {
          headerBg: 'linear-gradient(135deg, var(--espresso) 0%, #4a2a1c 100%)',
          accentColor: 'var(--cinnamon)',
          font: 'system-ui, sans-serif',
        };
      case 'elegant':
        return {
          headerBg: 'linear-gradient(135deg, var(--espresso) 0%, var(--cinnamon) 100%)',
          accentColor: 'var(--error)',
          font: 'Georgia, serif',
        };
      default: // modern
        return {
          headerBg: 'linear-gradient(135deg, var(--cinnamon) 0%, var(--caramel) 100%)',
          accentColor: 'var(--accent)',
          font: 'Inter, sans-serif',
        };
    }
  };

  const templateStyles = getTemplateStyles();

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
        Visualização - Template{' '}
        {template === 'modern'
          ? 'Moderno'
          : template === 'classic'
            ? 'Clássico'
            : template === 'creative'
              ? 'Criativo'
              : template === 'minimal'
                ? 'Minimalista'
                : template === 'professional'
                  ? 'Profissional'
                  : 'Elegante'}
      </h2>

      <div
        style={{
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: '8px',
        }}
      >
        <div
          id="resume-content"
          style={{
            padding: '32px',
            minHeight: '600px',
            fontFamily: templateStyles.font,
            transform: 'scale(0.95)',
            transformOrigin: 'top left',
            transition: 'transform 0.3s ease',
            WebkitPrintColorAdjust: 'exact',
            colorAdjust: 'exact',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
        >
        {/* Header */}
        <div
          style={{
            background: templateStyles.headerBg,
            color: 'white',
            padding: '24px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <h1
            style={{
              fontSize: template === 'creative' ? '32px' : '28px',
              fontWeight: '700',
              marginBottom: '8px',
              textShadow:
                template === 'creative'
                  ? '2px 2px 4px rgba(0,0,0,0.3)'
                  : 'none',
            }}
          >
            {personalData.name || 'Seu Nome'}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
              fontSize: '14px',
              opacity: 0.9,
            }}
          >
            {personalData.email && <span>📧 {personalData.email}</span>}
            {personalData.phone && <span>📱 {personalData.phone}</span>}
            {personalData.linkedin && <span>💼 LinkedIn</span>}
          </div>
        </div>

        {/* Summary */}
        {personalData.summary && (
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '12px',
                borderBottom: `2px solid ${templateStyles.accentColor}`,
                paddingBottom: '4px',
              }}
            >
              Resumo Profissional
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                fontStyle: template === 'classic' ? 'italic' : 'normal',
              }}
            >
              {personalData.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '12px',
                borderBottom: `2px solid ${templateStyles.accentColor}`,
                paddingBottom: '4px',
              }}
            >
              Habilidades e Experiência
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: template === 'creative' ? '12px' : '8px',
              }}
            >
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  style={{
                    padding: template === 'creative' ? '8px 16px' : '6px 12px',
                    background:
                      template === 'creative'
                        ? 'linear-gradient(45deg, #ff6347, #ffa500)'
                        : 'var(--surface-alt)',
                    color:
                      template === 'creative'
                        ? 'white'
                        : 'var(--text-primary)',
                    borderRadius: template === 'creative' ? '20px' : '16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    boxShadow:
                      template === 'creative'
                        ? '0 2px 8px rgba(255, 99, 71, 0.3)'
                        : 'none',
                  }}
                >
                  {skill.name} • {skill.level}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '12px',
                borderBottom: `2px solid ${templateStyles.accentColor}`,
                paddingBottom: '4px',
              }}
            >
              Experiência Profissional
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {experiences.map((exp, index) => (
                <div
                  key={exp.id}
                  style={{
                    position: 'relative',
                    paddingLeft: template === 'creative' ? '24px' : '0',
                  }}
                >
                  {template === 'creative' && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        top: '8px',
                        width: '12px',
                        height: '12px',
                        background: 'linear-gradient(45deg, #ff6347, #ffa500)',
                        borderRadius: '50%',
                      }}
                    ></div>
                  )}

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
                          color: 'var(--text-primary)',
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: templateStyles.accentColor,
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        background:
                          template === 'creative'
                            ? 'rgba(255, 99, 71, 0.1)'
                            : 'var(--surface-alt)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {exp.startDate
                        ? new Date(exp.startDate).getFullYear()
                        : 'N/A'}{' '}
                      -{' '}
                      {exp.isCurrentJob
                        ? 'Atual'
                        : exp.endDate
                          ? new Date(exp.endDate).getFullYear()
                          : 'N/A'}
                    </span>
                  </div>
                  {exp.description && (
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!personalData.name &&
          skills.length === 0 &&
          experiences.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 32px',
                color: 'var(--text-muted)',
                opacity: 0.7,
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                Seu currículo aparecerá aqui
              </h3>
              <p style={{ fontSize: '14px' }}>
                Preencha o formulário para ver a visualização do seu currículo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
