import React, { useEffect, useRef } from 'react';
import { AppMode } from '../types';
import type { Message } from '../types';
import ChatMessage from './PatientView';
import ChatInput from './ProfessionalView';
import TypingIndicator from './Loader';
import ExamplePrompts from './ExamplePrompts';
import { RobotIcon, ArrowLeftIcon } from './icons';

interface ChatViewProps {
    mode: AppMode;
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (text: string) => void;
    onExit: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ mode, messages, isLoading, onSendMessage, onExit }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isNewChat = messages.length === 1 && messages[0].type === 'welcome';

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);


  const modeTitle = mode === AppMode.PATIENT ? 'Patient Mode' : 'Professional Mode';
  const modeColor = mode === AppMode.PATIENT ? 'text-sky-600' : 'text-teal-600';

  return (
    <div className="flex flex-col h-screen flex-1 bg-gray-100 font-sans text-slate-900">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
      <header className="flex items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <button onClick={onExit} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back">
            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
          </button>
          <div className="text-center flex-1">
             <h1 className="text-xl font-bold text-slate-800">
                AnaRadiologyAI Assistant
             </h1>
             <p className={`text-sm font-semibold ${modeColor}`}>{modeTitle}</p>
          </div>
          <div className="w-10"></div> {/* Spacer to balance the back button */}
      </header>
      
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          
          {isNewChat && <ExamplePrompts mode={mode} onSelect={onSendMessage} />}

          {isLoading && (
            <div className="flex items-start gap-3 my-4 animate-fade-in justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <RobotIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="max-w-2xl p-4 rounded-2xl shadow-sm bg-white text-gray-800 border border-gray-200">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatView;