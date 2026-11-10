import { useState, useEffect, useRef, useCallback } from 'react';
import type { WsServerMessage, ChatMessagePayload } from '../types';

export function useChatSocket(token: string | null, onLogout: () => void) {
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Создаем подключение
    const ws = new WebSocket('wss://inai-col3.fishrungames.com/chat/');
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket соединен! Отправляем токен...");
      // Отправляем токен строго как строку, как требует бекенд
      ws.send(JSON.stringify({
        type: 'AUTH',
        payload: {
          token: String(token)
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Получено сообщение от WS:", data);
        
        if (data.type === 'AUTH_SUCCESS') {
          // Если сервер ответил AUTH_SUCCESS — мы в чате
          setUsername(data.payload.username);
        } else if (data.type === 'NEW_MESSAGE') {
          setMessages(prev => [...prev, data.payload]);
        } else if (data.type === 'ERROR') {
          console.error('Ошибка от сервера WS:', data.payload);
          // Выходим из аккаунта только если сервер явно прислал ошибку токена
          onLogout();
        }
      } catch (err) {
        console.error('Ошибка парсинга:', err);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket закрыт (код ${event.code})`);
      setUsername(null);
      // Безусловный onLogout() убран, чтобы вас не выкидывало сразу при сбое сети
    };

    ws.onerror = (error) => {
       console.error("Ошибка WebSocket:", error);
    };

    return () => {
      ws.close();
    };
  }, [token, onLogout]);

  const sendMessage = useCallback((text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN && username) {
      socketRef.current.send(JSON.stringify({
        type: 'CHAT_MESSAGE',
        payload: { text }
      }));
    }
  }, [username]);

  return { messages, username, sendMessage };
}