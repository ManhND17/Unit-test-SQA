import { useState } from 'react';
import { Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRateMessage } from '@src/hooks/useChat';
import { formatDateTimeFromIso } from '@src/utils/datetime';
import { useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  star: number | null;
  useFul: boolean | null;
  conversationId?: string;
};

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const user = useSelector((state: IRootState) => state.auth.user);
  const avatar = user?.avatar;
  const name = user?.name;
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const rateMessageMutation = useRateMessage();

  const handleStarClick = async (starValue: number) => {
    if (rateMessageMutation.isPending) return;

    try {
      await rateMessageMutation.mutateAsync({
        messageId: message.id,
        star: starValue,
        conversationId: message.conversationId,
      });
    } catch {
      // Error đã được xử lý trong useRateMessage hook
    }
  };

  const currentRating = message.star || 0;

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          AI
        </div>
      )}
      <div className="flex flex-col">
        <div
          className={`mx-3 p-3 rounded-lg shadow-sm max-w-3xl ${isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : message.content === '' ? (
            // Loading state - hiển thị animation khi content rỗng
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
              <span className="text-gray-500 text-sm">Đang trả lời...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  // Customize markdown rendering
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc ml-4 mb-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal ml-4 mb-2">{children}</ol>
                  ),
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ) : (
                      <code
                        className={`block bg-gray-100 p-2 rounded text-sm overflow-x-auto ${className}`}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => <pre className="mb-2">{children}</pre>,
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => <em className="italic">{children}</em>,
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-2">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold mb-2">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-bold mb-2">{children}</h3>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          <div
            className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}
          >
            {formatDateTimeFromIso(message.timestamp)}
          </div>
        </div>

        {/* Rating stars - chỉ hiện với tin nhắn của assistant */}
        {!isUser && (
          <div className="mx-3 mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                disabled={rateMessageMutation.isPending}
                className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Đánh giá ${star} sao`}
              >
                <Star
                  className={`h-4 w-4 ${
                    star <= (hoveredStar || currentRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            {currentRating > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({currentRating}/5)
              </span>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full">
          {avatar ? (
            <img src={avatar} className="w-full h-full rounded-full" />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
              {[name?.firstName, name?.lastName]
                .map((n) => n?.charAt(0))
                .join('')
                .toUpperCase() || 'U'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
