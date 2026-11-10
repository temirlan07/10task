import { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { ChatRoom } from './components/ChatRoom';
import { useChatSocket } from './hooks/useChatSocket';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('chat_token'));

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('chat_token');
  };

  const handleLogin = (newAccessToken: string) => {
    setToken(newAccessToken);
    localStorage.setItem('chat_token', newAccessToken);
  };

  // Вызываем хук для работы с вебсокетами
  const { messages, username, sendMessage } = useChatSocket(token, handleLogout);

  return (
    <div>
      {/* Если токена нет или сервер еще не прислал AUTH_SUCCESS (username), показываем форму входа */}
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