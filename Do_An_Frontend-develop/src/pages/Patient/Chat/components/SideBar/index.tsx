import React from 'react';
import { PlusIcon, MessageSquareIcon, TrashIcon } from 'lucide-react';
import {
  useConversationHistory,
  useDeleteConversation,
} from '@src/hooks/useChat';

interface SidebarProps {
  isCollapsed?: boolean;
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

export function Sidebar({
  isCollapsed = false,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
}: SidebarProps) {
  // Fetch conversation history
  const { data: conversations = [], isLoading } = useConversationHistory();
  const deleteConversationMutation = useDeleteConversation();
  const handleNewChat = () => {
    onNewConversation();
  };

  const handleDeleteChat = async (
    conversationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    if (deleteConversationMutation.isPending) return;

    try {
      await deleteConversationMutation.mutateAsync(conversationId);

      // Nếu conversation đang được chọn bị xóa, chuyển sang conversation khác hoặc tạo mới
      if (activeConversationId === conversationId) {
        const remainingConversations = conversations.filter(
          (conv) => conv.id !== conversationId
        );
        if (remainingConversations.length > 0) {
          onSelectConversation(remainingConversations[0].id);
        } else {
          onNewConversation();
        }
      }
    } catch {
      // Error đã được xử lý trong useDeleteConversation hook
    }
  };
  return (
    <div className="w-full h-full flex flex-col border-r">
      <div className={`p-4`}>
        <button
          onClick={handleNewChat}
          className={`flex items-center justify-center w-full p-2 rounded-md border border-gray-600 hover:bg-gray-400`}
          title={isCollapsed ? 'Cuộc trò chuyện mới' : undefined}
        >
          <PlusIcon className="h-5 w-5 flex-shrink-0" />
          <span
            className={`ml-2 whitespace-nowrap overflow-hidden ${
              isCollapsed ? 'hidden' : 'block'
            }`}
          >
            Cuộc trò chuyện mới
          </span>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div
          className={`px-3 py-2 text-xs uppercase whitespace-nowrap overflow-hidden ${
            isCollapsed ? 'w-0 opacity-0 py-0' : 'w-auto opacity-100'
          }`}
        >
          Cuộc trò chuyện gần đây
        </div>
        {isLoading ? (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            Đang tải...
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-gray-500">
            Chưa có cuộc trò chuyện nào
          </div>
        ) : (
          <div className={`space-y-1 ${isCollapsed ? 'hidden' : 'px-2'}`}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center p-3 rounded-md cursor-pointer ${
                  activeConversationId === conversation.id
                    ? 'bg-[#ccc]'
                    : 'hover:bg-gray-400'
                } ${isCollapsed ? 'px-2 justify-center' : ''}`}
                onClick={() => onSelectConversation(conversation.id)}
                title={isCollapsed ? conversation.title : undefined}
              >
                <MessageSquareIcon className="h-5 w-5 flex-shrink-0" />
                <div
                  className={`flex-grow truncate ml-3 whitespace-nowrap overflow-hidden ${
                    isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100'
                  }`}
                >
                  <div className="text-sm font-medium truncate">
                    {conversation.title}
                  </div>
                  <div className="text-xs">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(conversation.id, e)}
                  className={`p-1 rounded-md hover:bg-gray-600 flex-shrink-0 whitespace-nowrap overflow-hidden ${
                    isCollapsed
                      ? 'w-0 opacity-0 ml-0'
                      : 'w-auto opacity-100 ml-2'
                  }`}
                  disabled={deleteConversationMutation.isPending}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
