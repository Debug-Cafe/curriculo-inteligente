import { useRef, useEffect } from 'react';
import type { PersonalData } from '../types';

interface Props {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    headerBg: string;
    inputBg: string;
  };
}

export default function PersonalDataForm({ data, onChange, theme }: Props) {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const linkedinRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = data.name;
    if (emailRef.current) emailRef.current.value = data.email;
    if (phoneRef.current) phoneRef.current.value = data.phone;
    if (linkedinRef.current) linkedinRef.current.value = data.linkedin;
    if (summaryRef.current) summaryRef.current.value = data.summary;
  }, [data]);

  const handleInput = () => {
    onChange({
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      phone: phoneRef.current?.value || '',
      linkedin: linkedinRef.current?.value || '',
      summary: summaryRef.current?.value || '',
    });
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneInput = () => {
    const rawValue = phoneRef.current?.value || '';
    const formattedValue = formatPhone(rawValue);

    if (phoneRef.current) {
      phoneRef.current.value = formattedValue;
    }

    onChange({
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      phone: formattedValue,
      linkedin: linkedinRef.current?.value || '',
      summary: summaryRef.current?.value || '',
    });
  };

  const getInputStyle = (value: string, required = false) => ({
    width: '100%',
    border: required && !value ? '1px solid #dc2626' : undefined,
  });

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
        Informações Pessoais
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Nome e Email */}
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
              Nome Completo
            </label>
            <input
              ref={nameRef}
              type="text"
              onInput={handleInput}
              style={getInputStyle(data.name, true)}
              placeholder="Seu nome completo"
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
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              onInput={handleInput}
              style={getInputStyle(data.email)}
              placeholder="seu@email.com"
            />
          </div>
        </div>

        {/* Telefone e LinkedIn */}
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
              Telefone
            </label>
            <input
              ref={phoneRef}
              type="tel"
              onInput={handlePhoneInput}
              style={getInputStyle(data.phone)}
              placeholder="(11) 99999-9999"
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
              LinkedIn
            </label>
            <input
              ref={linkedinRef}
              type="url"
              onInput={handleInput}
              style={getInputStyle(data.linkedin)}
              placeholder="linkedin.com/in/seunome"
            />
          </div>
        </div>

        {/* Resumo Profissional com botão de IA */}
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
            Resumo Profissional
          </label>
          <textarea
            ref={summaryRef}
            onInput={handleInput}
            maxLength={500}
            rows={4}
            style={{
              ...getInputStyle(data.summary),
              resize: 'none',
            }}
            placeholder="Breve descrição do seu histórico profissional e objetivos de carreira..."
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
            {/* Contador de caracteres */}
            <span style={{ fontSize: '12px', color: theme.text, opacity: 0.7 }}>
              Máximo 500 caracteres
            </span>
            <span style={{ fontSize: '12px', color: theme.text, fontWeight: '500' }}>
              {data.summary.length}/500
            </span>

            {/* Select de tom da IA */}
            <select
              id="tom-summary"
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: `1px solid ${theme.border}`,
                background: theme.inputBg,
                color: theme.text,
              }}
            >
              <option value="formal">Formal</option>
              <option value="semi-formal">Semi-formal</option>
              <option value="casual">Casual</option>
            </select>

            {/* Botão melhorar com IA */}
            <button
              type="button"
              onClick={async () => {
                const tom = (document.getElementById('tom-summary') as HTMLSelectElement).value;
                const texto = summaryRef.current?.value || '';

                try {
                  const res = await fetch('/api/melhorar-texto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ campo: 'summary', texto, parametros: { tom } }),
                  });
                  const dataIA = await res.json();
                  if (dataIA.textoMelhorado && summaryRef.current) {
                    summaryRef.current.value = dataIA.textoMelhorado;
                    handleInput(); // Atualiza o state do parent
                  }
                } catch (err) {
                  console.error('Erro ao melhorar o texto com IA:', err);
                }
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                border: 'none',
                background: '#f48c3c',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Melhorar com IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
