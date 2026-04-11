import { EMessageSender } from '@src/types';
import { fetcher } from './Fetcher';

const path = {
  chat: '/chat',
};

type AskMessageDto = {
  message: string;
  conversationId?: string;
};

type SendMessageResponse = {
  conversationId: string;
  response: string;
  source: string;
  timestamp: string;
};

type HistoryConversations = {
  id: string;
  title: string | null;
  updatedAt: Date;
};

type ConversationMessage = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  conversationId: string;
  content: string;
  sender: EMessageSender;
  useFul: boolean | null;
  star: number | null;
};

const sendMessage = async (data: AskMessageDto) => {
  return fetcher<SendMessageResponse>({
    url: `${path.chat}/send`,
    method: 'POST',
    data,
    timeout: 100000,
  });
};

const getMessagesOfConversation = async (conversationId: string) => {
  return fetcher<ConversationMessage[]>({
    url: `${path.chat}/messages/${conversationId}`,
    method: 'GET',
  });
};

const getHistoryConversations = async () => {
  return fetcher<HistoryConversations[]>({
    url: `${path.chat}/history`,
    method: 'GET',
  });
};

const deleteConversation = async (conversationId: string) => {
  return fetcher<{
    isSuccess?: boolean;
  }>({
    url: `${path.chat}/conversations/${conversationId}`,
    method: 'DELETE',
  });
};

const rateMessage = async (
  messageId: string,
  data: { star?: number; useful?: boolean }
) => {
  return fetcher<ConversationMessage>({
    url: `${path.chat}/rate/${messageId}`,
    method: 'POST',
    data,
  });
};

export default {
  sendMessage,
  getMessagesOfConversation,
  getHistoryConversations,
  deleteConversation,
  rateMessage,
};
