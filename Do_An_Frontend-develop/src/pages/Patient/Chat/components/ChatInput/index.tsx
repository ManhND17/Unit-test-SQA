import React, { useState } from 'react';
import { SendIcon } from 'lucide-react';
type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};
export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <div className="relative">
      <textarea
        className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Nhập tin nhắn của bạn..."
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button
        className={`absolute right-2 p-2 -translate-y-1/2 top-1/2 rounded-full ${message.trim() && !isLoading ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
      >
        <SendIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
