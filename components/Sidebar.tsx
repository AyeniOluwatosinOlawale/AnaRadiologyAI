import React from 'react';
import type { Conversation } from '../types';
import { AppMode } from '../types';
import { PlusIcon, ChatBubbleLeftRightIcon } from './icons';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: (mode: AppMode) => void;
  currentMode: AppMode;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  currentMode,
}) => {
  const handleNewChatClick = (mode: AppMode) => {
    onNewChat(mode);
  };
  
  return (
    <div className="w-72 bg-gray-800 text-white flex flex-col h-screen p-3">
      <div className="flex-shrink-0">
          <button
            onClick={() => handleNewChatClick(currentMode)}
            className="w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            New Chat
            <PlusIcon className="w-5 h-5" />
          </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
          Chat History
        </h2>
        <nav className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm truncate transition-colors ${
                activeConversationId === conv.id
                  ? 'bg-gray-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 flex-shrink-0 text-gray-400" />
              <span className="flex-1 truncate">{conv.title}</span>
            </button>
          ))}
        </nav>
      </div>
      
       <div className="flex-shrink-0 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
                &copy; {new Date().getFullYear()} AnaRadiologyAI
            </p>
       </div>
    </div>
  );
};

export default Sidebar;
