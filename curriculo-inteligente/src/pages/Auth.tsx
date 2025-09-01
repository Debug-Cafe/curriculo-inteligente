import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

interface Props {
  theme: {
    bg: string;
    cardBg: string;
    text: string;
    border: string;
    inputBg: string;
  };
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Auth({ theme, darkMode, setDarkMode }: Props) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        position: 'relative',
      }}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '8px 12px',
          background: 'transparent',
          border: `1px solid ${theme.border}`,
          borderRadius: '6px',
          color: theme.text,
          cursor: 'pointer',
          fontSize: '16px',
          zIndex: 10,
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      {isLogin ? (
        <LoginForm onToggleMode={toggleMode} theme={theme} />
      ) : (
        <RegisterForm onToggleMode={toggleMode} theme={theme} />
      )}
    </div>
  );
}
