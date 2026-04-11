import { useParams, useNavigate } from 'react-router-dom';
import { ChatInterface } from './components/ChatInterface';

export default function Chat() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();

  // Sync conversationId từ URL params
  const currentConversationId = conversationId;

  const handleSelectConversation = (newConversationId: string) => {
    // Navigate to conversation route
    navigate(`/patient/chat/${newConversationId}`);
  };

  const handleNewConversation = () => {
    // Navigate to new conversation route
    navigate('/patient/chat');
  };

  const handleConversationCreated = (newConversationId: string) => {
    // Sau khi tạo conversation mới, update URL
    navigate(`/patient/chat/${newConversationId}`, { replace: true });
  };

  return (
    <div>
      <ChatInterface
        conversationId={currentConversationId}
        onConversationCreated={handleConversationCreated}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />
    </div>
  );
}
