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
}

export default function Auth({ theme }: Props) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return isLogin ? (
    <LoginForm onToggleMode={toggleMode} theme={theme} />
  ) : (
    <RegisterForm onToggleMode={toggleMode} theme={theme} />
  );
}