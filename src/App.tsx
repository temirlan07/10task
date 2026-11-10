import { useState, useCallback } from 'react';
import { AuthForm } from './components/AuthForm';
import { ChatRoom } from './components/ChatRoom';
import { useChatSocket } from './hooks/useChatSocket';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('chat_token'));

  // Оборачиваем в useCallback, чтобы функция не пересоздавалась при каждом рендере 
  // и не заставляла WebSocket переподключаться
  const handleLogout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('chat_token');
  }, []);

  const handleLogin = useCallback((newAccessToken: string) => {
    setToken(newAccessToken);
    localStorage.setItem('chat_token', newAccessToken);
  }, []);

  const { messages, username, sendMessage } = useChatSocket(token, handleLogout);

  return (
    <div>
      {!token || !username ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <ChatRoom 
          messages={messages} 
          currentUsername={username} 
          onSendMessage={sendMessage} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}