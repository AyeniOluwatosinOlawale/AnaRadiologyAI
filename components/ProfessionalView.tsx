import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Set a max-height (e.g., 192px which is h-48 in Tailwind)
      if (scrollHeight > 192) {
          textarea.style.height = '192px';
          textarea.style.overflowY = 'auto';
      } else {
          textarea.style.height = `${scrollHeight}px`;
          textarea.style.overflowY = 'hidden';
      }
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-4 pb-2 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end bg-white border border-gray-200 rounded-xl shadow-md shadow-gray-200/50 focus-within:ring-2 focus-within:ring-sky-500 transition-shadow">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full p-3 bg-transparent border-none rounded-xl resize-none focus:ring-0 text-gray-800 placeholder-gray-500"
            rows={1}
            disabled={isLoading}
            style={{ maxHeight: '192px' }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="m-2 p-2 rounded-lg bg-sky-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
         <p className="text-xs text-center text-gray-500 mt-2 px-4">
            AnaRadiologyAI Assistant can make mistakes. Consider checking important information.
        </p>
      </div>
    </form>
  );
};

export default ChatInput;