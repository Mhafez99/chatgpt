'use client';
import { ChatCompletionRequestMessage } from 'openai';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface MessageContextType {
  messages: ChatCompletionRequestMessage[];
  addMessage: (message: ChatCompletionRequestMessage) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function useMessageContext() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
}

interface MessageProviderProps {
  children: ReactNode;
}

export function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const addMessage = (message: ChatCompletionRequestMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const value: MessageContextType = {
    messages,
    addMessage,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}
