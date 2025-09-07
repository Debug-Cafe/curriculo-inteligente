import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Auth from './pages/Auth';

// Importa o sistema de toasts
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Aplicar tema no documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = useMemo(() => ({
    bg: 'var(--bg)',
    cardBg: 'var(--surface)',
    text: 'var(--text-primary)',
    border: 'var(--border)',
    headerBg: darkMode
      ? 'linear-gradient(135deg, #2d1b14 0%, #1a0f0a 100%)'
      : 'linear-gradient(135deg, #603010 0%, #4a2a1c 100%)',
    inputBg: 'var(--surface)',
  }), [darkMode]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: theme.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
 style={{
            fontSize: '18px',
            color: theme.text,
          }}
        >
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Home />
      ) : (
        <Auth theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      {/* Sistema global de toasts */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '12px',
            padding: '12px 16px',
            background: darkMode ? '#1a0f0a' : '#603010',
            color: '#fff',
          },
        }}
      />
</>
  );
}

export default App;