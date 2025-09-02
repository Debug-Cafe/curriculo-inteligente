import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

interface Props {
  onToggleMode: () => void;
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    inputBg: string;
  };
}

export default function RegisterForm({ onToggleMode, theme }: Props) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '56px',
              width: 'auto',
              marginBottom: '20px',
              opacity: 0.9,
            }}
          />
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: theme.text,
              marginBottom: '8px',
            }}
          >
            Criar Conta
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: theme.text,
              opacity: 0.7,
            }}
          >
            Cadastre-se para começar a criar seus currículos
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
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
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={inputStyle}
              placeholder="Seu nome completo"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
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
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={inputStyle}
              placeholder="seu@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.text,
                marginBottom: '6px',
              }}
            >
              Senha
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={inputStyle}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: theme.text,
                marginBottom: '6px',
              }}
            >
              Confirmar Senha
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              style={inputStyle}
              placeholder="Digite a senha novamente"
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              background: loading ? 'color-mix(in oklab, #603010 50%, #e0c0b0)' : undefined,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: theme.text, opacity: 0.7 }}>
              Já tem uma conta?{' '}
            </span>
            <button
              type="button"
              onClick={onToggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#c07040',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
