import React, { useState, useEffect } from 'react';
import ChatView from './components/ChatView';
import Sidebar from './components/Sidebar';
import { AppMode } from './types';
import type { Conversation, Message } from './types';
import Disclaimer from './components/Disclaimer';
import { UserIcon, AcademicCapIcon, SparklesIcon } from './components/icons';
import { analyzeSymptoms, generateCaseStudy, generateChatTitle } from './services/geminiService';

const WELCOME_MESSAGES = {
  [AppMode.PATIENT]: "Hello! I'm AnaRadiologyAI Assistant. I can provide general educational information about findings in your radiology report. To begin, please describe what your report says.",
  [AppMode.PROFESSIONAL]: "Welcome. As AnaRadiologyAI Assistant, I can generate detailed radiology case studies for educational purposes. Please provide a scenario, modality (e.g., CT Chest), or patient profile to begin.",
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'chat'>('landing');
  const [currentMode, setCurrentMode] = useState<AppMode | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const handleStartChat = (mode: AppMode) => {
    setCurrentMode(mode);
    const newConversationId = 'conv-' + Date.now();
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Chat',
      mode: mode,
      messages: [
        {
          id: 'welcome-' + Date.now(),
          sender: 'ai',
          content: WELCOME_MESSAGES[mode],
          type: 'welcome',
        },
      ],
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);
    setView('chat');
  };
  
  const handleSelectConversation = (id: string) => {
      setActiveConversationId(id);
      const selectedConv = conversations.find(c => c.id === id);
      if(selectedConv) {
          setCurrentMode(selectedConv.mode);
      }
      setView('chat');
  };

  const handleSendMessage = async (inputText: string) => {
    if (!inputText.trim() || isLoading || !activeConversation) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: inputText,
      type: 'text',
    };

    const isNewChat = activeConversation.messages.length <= 1;

    // Update conversation with user message
    const updatedConversations = conversations.map(c =>
      c.id === activeConversationId
        ? { ...c, messages: [...c.messages, userMessage] }
        : c
    );
    setConversations(updatedConversations);
    setIsLoading(true);

    // Generate title for new chats
    if (isNewChat) {
      generateChatTitle(inputText).then(title => {
        setConversations(prev => prev.map(c =>
          c.id === activeConversationId ? { ...c, title } : c
        ));
      });
    }

    try {
      let aiResponse: Message;
      if (activeConversation.mode === AppMode.PATIENT) {
        const analysis = await analyzeSymptoms(inputText);
        aiResponse = { id: 'ai-' + Date.now(), sender: 'ai', content: analysis, type: 'text' };
      } else {
        const caseStudy = await generateCaseStudy(inputText);
        aiResponse = { id: 'ai-' + Date.now(), sender: 'ai', content: caseStudy, type: 'caseStudy' };
      }
      setConversations(prev => prev.map(c =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, aiResponse] }
          : c
      ));
    } catch (error: any) {
      const errorMessage: Message = { id: 'error-' + Date.now(), sender: 'ai', content: error.message || 'An unexpected error occurred.', type: 'error' };
      setConversations(prev => prev.map(c =>
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, errorMessage] }
          : c
      ));
    } finally {
      setIsLoading(false);
    }
  };


  if (view === 'chat' && currentMode) {
    return (
        <div className="flex h-screen bg-gray-100 font-sans text-slate-900">
            <Sidebar
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleStartChat}
                currentMode={currentMode}
            />
            {activeConversation && (
                <ChatView
                    key={activeConversation.id}
                    mode={activeConversation.mode}
                    messages={activeConversation.messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                    onExit={() => setView('landing')} // This could be repurposed for a "close" button
                />
            )}
        </div>
    );
  }

  const FeatureCard: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    iconClassName: string;
  }> = ({ icon: Icon, title, description, iconClassName }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconClassName}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <style>{`
        .hero-bg {
          background-color: #f8fafc;
          background-image: radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0);
          background-size: 20px 20px;
        }
      `}</style>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-500">
            AnaRadiologyAI Assistant
          </h1>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 hero-bg">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Intelligent Radiology Insights,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400">Instantly</span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
              Your AI-powered assistant for radiology information. Get educational analysis of your imaging reports or generate detailed radiology cases for learning.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => handleStartChat(AppMode.PATIENT)}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-sky-600 text-white font-semibold rounded-full shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-105 duration-300"
              >
                <UserIcon className="w-5 h-5 mr-2" />
                Start as Patient
              </button>
              <button
                onClick={() => handleStartChat(AppMode.PROFESSIONAL)}
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-700 transition-transform transform hover:scale-105 duration-300"
              >
                <AcademicCapIcon className="w-5 h-5 mr-2" />
                Start as Professional
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800">Two Powerful Modes, One Platform</h2>
              <p className="mt-4 text-slate-600 max-w-xl mx-auto">Whether you're seeking to understand a report or create educational content, AnaRadiologyAI has you covered.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={UserIcon}
                title="Radiology Report Analysis"
                description="Describe findings from a radiology report to receive easy-to-understand, educational information about potential implications."
                iconClassName="bg-sky-500"
              />
              <FeatureCard
                icon={AcademicCapIcon}
                title="Radiology Case Generation"
                description="For students and professionals. Generate comprehensive, realistic radiology case studies from a simple prompt for training and learning."
                iconClassName="bg-teal-500"
              />
              <FeatureCard
                icon={SparklesIcon}
                title="Powered by Advanced AI"
                description="Leverages cutting-edge generative AI to provide nuanced, context-aware responses and detailed radiological scenarios."
                iconClassName="bg-slate-700"
              />
            </div>
          </div>
        </section>
        
        {/* Disclaimer Section */}
        <section className="py-20 bg-slate-50">
           <div className="container mx-auto px-6 max-w-4xl">
              <Disclaimer />
           </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 py-6 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} AnaRadiologyAI Assistant. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
