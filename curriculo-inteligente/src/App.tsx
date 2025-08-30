import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Auth from './pages/Auth'

function App() {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : 'white',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    border: darkMode ? '#475569' : '#e2e8f0',
    headerBg: darkMode ? '#1e293b' : 'white',
    inputBg: darkMode ? '#334155' : 'white'
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '18px',
          color: theme.text
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  return user ? <Home /> : <Auth theme={theme} />;
}

export default App;