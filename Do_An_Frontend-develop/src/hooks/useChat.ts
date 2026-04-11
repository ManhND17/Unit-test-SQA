import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiChat from '@api/ApiChat';
import {
  SendMessageRequest,
  SendMessageResponse,
  RateMessageRequest,
  ConversationMessage,
  HistoryConversation,
  UIMessage,
  UIConversation,
} from '@src/types/chat';
import { EMessageSender } from '@src/types';
import { toast } from 'react-toastify';

// Query keys
export const CHAT_QUERY_KEYS = {
  conversations: ['chat', 'conversations'] as const,
  messages: (conversationId?: string) =>
    ['chat', 'messages', conversationId] as const,
};

/**
 * Helper: Transform ConversationMessage sang UIMessage
 */
const transformToUIMessage = (msg: ConversationMessage): UIMessage => ({
  id: msg.id,
  content: msg.content,
  role: msg.sender === EMessageSender.USER ? 'user' : 'assistant',
  timestamp:
    msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
  star: msg.star,
  useFul: msg.useFul,
  conversationId: msg.conversationId,
});

/**
 * Helper: Transform HistoryConversation sang UIConversation
 */
const transformToUIConversation = (
  conv: HistoryConversation
): UIConversation => ({
  id: conv.id,
  title: conv.title || 'Cuộc trò chuyện mới',
  updatedAt: conv.updatedAt,
});

/**
 * Hook lấy lịch sử cuộc trò chuyện
 */
export const useConversationHistory = () => {
  return useQuery<UIConversation[]>({
    queryKey: CHAT_QUERY_KEYS.conversations,
    queryFn: async () => {
      const conversations = await ApiChat.getHistoryConversations();
      return conversations.map(transformToUIConversation);
    },
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};

/**
 * Hook lấy tin nhắn của một cuộc trò chuyện
 * @param conversationId - ID của cuộc trò chuyện
 */
export const useConversationMessages = (conversationId?: string) => {
  const isTemporaryConversation = conversationId === 'temp-new-conversation';

  return useQuery<UIMessage[]>({
    queryKey: CHAT_QUERY_KEYS.messages(conversationId),
    queryFn: async () => {
      // Nếu là temp conversation hoặc không có ID, return empty array
      if (!conversationId || isTemporaryConversation) {
        return [];
      }
      const messages = await ApiChat.getMessagesOfConversation(conversationId);
      return messages.map(transformToUIMessage);
    },
    enabled: true,
    staleTime: 10000,
    retry: 2,
  });
};

/**
 * Hook gửi tin nhắn với optimistic updates
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  type OptimisticContext = {
    previousMessages?: UIMessage[];
    conversationId?: string;
  };

  return useMutation<
    SendMessageResponse,
    Error,
    SendMessageRequest,
    OptimisticContext
  >({
    mutationFn: async (data: SendMessageRequest) => {
      const response = await ApiChat.sendMessage(data);
      return response;
    },

    // Optimistic update: hiển thị tin nhắn ngay lập tức
    onMutate: async (variables) => {
      const { message, conversationId } = variables;

      const now = new Date().toISOString();
      const tempConversationId = conversationId || 'temp-new-conversation';

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: CHAT_QUERY_KEYS.messages(tempConversationId),
      });

      // Snapshot previous messages
      const previousMessages = queryClient.getQueryData<UIMessage[]>(
        CHAT_QUERY_KEYS.messages(tempConversationId)
      );

      // Optimistically update messages - LUÔN tạo cho cả conversation mới
      const optimisticUserMessage: UIMessage = {
        id: `temp-user-${Date.now()}`,
        content: message,
        role: 'user',
        timestamp: now,
        star: null,
        useFul: null,
        conversationId: tempConversationId,
      };

      const optimisticAssistantMessage: UIMessage = {
        id: `temp-assistant-${Date.now()}`,
        content: '', // Empty content = loading state
        role: 'assistant',
        timestamp: now,
        star: null,
        useFul: null,
        conversationId: tempConversationId,
      };

      queryClient.setQueryData<UIMessage[]>(
        CHAT_QUERY_KEYS.messages(tempConversationId),
        (old = []) => [
          ...old,
          optimisticUserMessage,
          optimisticAssistantMessage,
        ]
      );

      return { previousMessages, conversationId: tempConversationId };
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messages(data.conversationId),
      });

      // Chỉ update conversation list nếu là conversation mới
      if (!variables.conversationId) {
        // Conversation mới được tạo, cần update list
        queryClient.invalidateQueries({
          queryKey: CHAT_QUERY_KEYS.conversations,
        });
      } else {
        // Conversation existing, update locally để move lên đầu (updated time)
        queryClient.setQueryData<UIConversation[]>(
          CHAT_QUERY_KEYS.conversations,
          (old = []) => {
            const updated = old.find((conv) => conv.id === data.conversationId);
            if (updated) {
              // Move conversation lên đầu với updatedAt mới
              const filtered = old.filter(
                (conv) => conv.id !== data.conversationId
              );
              return [{ ...updated, updatedAt: new Date() }, ...filtered];
            }
            return old;
          }
        );
      }
    },

    onError: (_error, _variables, context) => {
      // Rollback optimistic update nếu có lỗi
      if (context?.conversationId && context.previousMessages) {
        queryClient.setQueryData(
          CHAT_QUERY_KEYS.messages(context.conversationId),
          context.previousMessages
        );
      }
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại!');
    },
  });
};

/**
 * Hook xóa cuộc trò chuyện
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ isSuccess?: boolean }, Error, string>({
    mutationFn: async (conversationId: string) => {
      const response = await ApiChat.deleteConversation(conversationId);
      return response;
    },
    onSuccess: (_, conversationId) => {
      // Xóa messages cache của conversation này
      queryClient.removeQueries({
        queryKey: CHAT_QUERY_KEYS.messages(conversationId),
      });

      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.conversations,
      });

      toast.success('Đã xóa cuộc trò chuyện');
    },
    onError: () => {
      toast.error('Không thể xóa cuộc trò chuyện. Vui lòng thử lại!');
    },
  });
};

/**
 * Hook đánh giá tin nhắn
 */
export const useRateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ConversationMessage,
    Error,
    RateMessageRequest & { conversationId?: string }
  >({
    mutationFn: async ({ messageId, star, useful }) => {
      const response = await ApiChat.rateMessage(messageId, { star, useful });
      return response;
    },
    onSuccess: (_, variables) => {
      // Invalidate messages để cập nhật UI
      if (variables.conversationId) {
        queryClient.invalidateQueries({
          queryKey: CHAT_QUERY_KEYS.messages(variables.conversationId),
        });
      }

      toast.success('Cảm ơn bạn đã đánh giá!');
    },
    onError: () => {
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại!');
    },
  });
};
