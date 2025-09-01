import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    bg: darkMode ? '#1a1a2e' : '#f7f8fc',
    cardBg: darkMode ? '#16213e' : '#ffffff',
    text: darkMode ? '#e4e6ea' : '#2c3e50',
    border: darkMode ? '#0f3460' : '#d1d9e6',
    headerBg: darkMode ? '#16213e' : '#ffffff',
    inputBg: darkMode ? '#0f3460' : '#f8fafc',
  };

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

  return user ? (
    <Home />
  ) : (
    <Auth theme={theme} darkMode={darkMode} setDarkMode={setDarkMode} />
  );
}

export default App;
