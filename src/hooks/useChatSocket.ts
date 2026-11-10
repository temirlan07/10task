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
      // Отправляем токен строго по формату из задания
      const authMessage = {
        type: 'AUTH',
        payload: {
          token: token
        }
      };
      ws.send(JSON.stringify(authMessage));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WsServerMessage;
        console.log("Получено сообщение от WS:", data);
        
        if (data.type === 'AUTH_SUCCESS') {
          // Если сервер ответил AUTH_SUCCESS — мы в чате!
          setUsername(data.payload.username);
        } else if (data.type === 'NEW_MESSAGE') {
          setMessages(prev => [...prev, data.payload]);
        }
      } catch (err) {
        console.error('Ошибка парсинга:', err);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket закрыт (код ${event.code})`);
      setUsername(null);
      
      // ВАЖНО: Мы пока убираем автоматический onLogout(), 
      // чтобы вы могли увидеть консоль и понять, почему сервер разрывает связь,
      // а не просто вылетать на форму входа.
    };

    ws.onerror = (error) => {
       console.error("Ошибка WebSocket:", error);
    };

    return () => {
      ws.close();
    };
  }, [token]);

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