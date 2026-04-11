import { EMessageSender } from '@src/types';

export interface ConversationMessage {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  content: string;
  sender: EMessageSender;
  useFul: boolean | null;
  star: number | null;
}

export interface HistoryConversation {
  id: string;
  title: string | null;
  updatedAt: Date;
}

export interface SendMessageRequest {
  message: string;
  conversationId?: string;
}

export interface SendMessageResponse {
  conversationId: string;
  response: string;
  source: string;
  timestamp: string;
}

export interface RateMessageRequest {
  messageId: string;
  star?: number;
  useful?: boolean;
}

export interface UIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  star: number | null;
  useFul: boolean | null;
  conversationId: string;
}

export interface UIConversation {
  id: string;
  title: string;
  updatedAt: Date;
}
