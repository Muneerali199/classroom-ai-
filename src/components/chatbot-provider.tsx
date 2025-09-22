"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AIChatbot from "./ai-chatbot";

interface ChatbotContextType {
  isOpen: boolean;
  isMinimized: boolean;
  toggleChatbot: () => void;
  minimizeChatbot: () => void;
  maximizeChatbot: () => void;
  closeChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

interface ChatbotProviderProps {
  children?: ReactNode;
  userId: string;
  userRole: 'student' | 'teacher' | 'dean';
}

export default function ChatbotProvider({ 
  children, 
  userId, 
  userRole 
}: ChatbotProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  // Auto-open chatbot after a delay for first-time users
  useEffect(() => {
    const hasSeenChatbot = localStorage.getItem(`chatbot-seen-${userId}`);
    if (!hasSeenChatbot) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsMinimized(false);
        localStorage.setItem(`chatbot-seen-${userId}`, 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  const toggleChatbot = () => {
    if (isOpen) {
      setIsMinimized(!isMinimized);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const minimizeChatbot = () => {
    setIsMinimized(true);
  };

  const maximizeChatbot = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  const contextValue: ChatbotContextType = {
    isOpen,
    isMinimized,
    toggleChatbot,
    minimizeChatbot,
    maximizeChatbot,
    closeChatbot,
  };

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
      
      {/* Floating Chatbot */}
      {(isOpen || isMinimized) && (
        <div className={`fixed z-50 ${
          isMinimized 
            ? 'bottom-4 right-4' 
            : 'bottom-4 right-4 w-96 h-[600px]'
        }`}>
          <AIChatbot
            userId={userId}
            userRole={userRole}
            isMinimized={isMinimized}
            onToggleMinimize={toggleChatbot}
            className={isMinimized ? '' : 'shadow-2xl border-2'}
          />
        </div>
      )}
    </ChatbotContext.Provider>
  );
}
