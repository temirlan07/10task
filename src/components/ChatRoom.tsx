import { useState, useRef, useEffect } from 'react';
import type { ChatMessagePayload } from '../types';

interface Props {
  messages: ChatMessagePayload[];
  currentUsername: string;
  onSendMessage: (text: string) => void;
  onLogout: () => void;
}

export function ChatRoom({ messages, currentUsername, onSendMessage, onLogout }: Props) {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при добавлении сообщений
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '20px auto', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: 8 }}>
      <header style={{ padding: 15, background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
        <strong>Привет, {currentUsername}!</strong>
        <button onClick={onLogout}>Выйти</button>
      </header>

      <div style={{ height: 400, overflowY: 'auto', padding: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.sender === currentUsername ? 'flex-end' : 'flex-start', background: msg.sender === currentUsername ? '#d1e7dd' : '#f8d7da', padding: '8px 12px', borderRadius: 8, maxWidth: '80%' }}>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
              {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', padding: 15, borderTop: '1px solid #ccc' }}>
        <input 
          style={{ flex: 1, padding: 8, marginRight: 8 }}
          value={text} onChange={e => setText(e.target.value)} 
          placeholder="Введите сообщение..." 
        />
        <button type="submit" disabled={!text.trim()}>Отправить</button>
      </form>
    </div>
  );
}