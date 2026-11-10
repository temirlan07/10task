export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ChatMessagePayload {
  sender: string;
  text: string;
  timestamp: number;
}

// Что мы получаем от сервера (входящие)
export type WsServerMessage =
  | { type: 'AUTH_SUCCESS'; payload: { username: string } }
  | { type: 'NEW_MESSAGE'; payload: ChatMessagePayload }
  | { type: 'ERROR'; payload?: { detail?: string } };

// Что мы отправляем на сервер (исходящие)
export type WsClientMessage =
  | { type: 'AUTH'; payload: { token: string } }
  | { type: 'CHAT_MESSAGE'; payload: { text: string } };