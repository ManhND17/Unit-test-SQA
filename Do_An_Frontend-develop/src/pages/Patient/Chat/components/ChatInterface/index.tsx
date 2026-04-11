import { useEffect, useState, useRef } from 'react';
import { Sidebar } from '../SideBar';
import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import ButtonTooltip from '@components/ButtonTooltip';
import { useConversationMessages, useSendMessage } from '@src/hooks/useChat';

interface ChatInterfaceProps {
  conversationId?: string;
  onConversationCreated?: (conversationId: string) => void;
  onSelectConversation?: (conversationId: string) => void;
  onNewConversation?: () => void;
}

export function ChatInterface({
  conversationId,
  onConversationCreated,
  onSelectConversation,
  onNewConversation,
}: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sử dụng temp ID cho conversation mới để optimistic updates hoạt động
  const effectiveConversationId = conversationId || 'temp-new-conversation';

  // Fetch messages của conversation hiện tại
  const { data: messages = [], isLoading: isLoadingMessages } =
    useConversationMessages(effectiveConversationId);

  // Mutation gửi tin nhắn
  const sendMessageMutation = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || sendMessageMutation.isPending) return;

    try {
      const response = await sendMessageMutation.mutateAsync({
        message,
        conversationId,
      });

      // Nếu là conversation mới (không có conversationId trước đó),
      // thông báo cho parent component
      if (!conversationId && response.conversationId && onConversationCreated) {
        onConversationCreated(response.conversationId);
      }
    } catch {
      // Error đã được xử lý trong useSendMessage hook
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className="flex h-[calc(100vh-75px)]">
      <div
        className={` ${
          sidebarOpen ? 'w-64' : 'w-16'
        } h-full bg-white text-black flex flex-col overflow-hidden transition-all duration-200`}
      >
        <Sidebar
          isCollapsed={!sidebarOpen}
          activeConversationId={conversationId}
          onSelectConversation={onSelectConversation || (() => {})}
          onNewConversation={onNewConversation || (() => {})}
        />
      </div>
      <div className="flex flex-col flex-grow h-full overflow-y-auto">
        <div className="flex items-center p-4 border-b">
          <ButtonTooltip title={sidebarOpen ? 'Đóng' : 'Mở rộng'}>
            <button
              onClick={toggleSidebar}
              className="p-1 mr-2 rounded-md hover:bg-gray-200"
            >
              {sidebarOpen ? (
                <PanelLeftCloseIcon className="h-5 w-5" />
              ) : (
                <PanelLeftOpenIcon className="h-5 w-5" />
              )}
            </button>
          </ButtonTooltip>
          <h1 className="text-xl font-semibold">Chat với AI</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingMessages && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Đang tải tin nhắn...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Bắt đầu cuộc trò chuyện mới với AI</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content,
                  role: message.role,
                  timestamp: message.timestamp,
                  star: message.star,
                  useFul: message.useFul,
                  conversationId: message.conversationId,
                }}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={sendMessageMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
