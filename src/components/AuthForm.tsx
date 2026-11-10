import { useState } from 'react';
import { api } from '../api/auth';

export function AuthForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!isLogin) {
        await api.register(username, password);
        setIsLogin(true); // Переключаемся на логин после успешной регистрации
        alert('Вы успешно зарегистрировались! Теперь войдите.');
      } else {
        const tokens = await api.login(username, password);
        onLogin(tokens.access); // Передаем токен наверх
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          placeholder="Имя пользователя" 
          value={username} onChange={e => setUsername(e.target.value)} required 
        />
        <input 
          type="password" placeholder="Пароль" 
          value={password} onChange={e => setPassword(e.target.value)} required 
        />
        <button type="submit" disabled={loading}>
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button 
        onClick={() => setIsLogin(!isLogin)} 
        style={{ marginTop: 10, background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
}