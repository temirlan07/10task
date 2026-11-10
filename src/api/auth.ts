import type { AuthTokens } from '../types';

const BASE_URL = 'https://inai-col3.fishrungames.com';

export const api = {
  async register(username: string, password: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
      // Пытаемся прочитать детальную ошибку от сервера
      const errorData = await res.json().catch(() => null);
      console.error("Детальная ошибка регистрации от сервера:", errorData);
      
      if (errorData && errorData.username) {
        throw new Error(`Ошибка: ${errorData.username[0]}`);
      } else if (errorData && errorData.password) {
         throw new Error(`Ошибка пароля: ${errorData.password[0]}`);
      }
      throw new Error('Ошибка регистрации. Проверьте консоль (F12) для деталей.');
    }
  },

  async login(username: string, password: string): Promise<AuthTokens> {
    const res = await fetch(`${BASE_URL}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
       const errorData = await res.json().catch(() => null);
       console.error("Детальная ошибка входа от сервера:", errorData);
       throw new Error('Неверный логин или пароль');
    }
    return res.json();
  }
};