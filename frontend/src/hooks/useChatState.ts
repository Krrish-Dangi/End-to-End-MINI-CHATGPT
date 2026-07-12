import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, Conversation } from '../types';
import { generateId } from '../utils';
import * as chatService from '../services/chatService';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isSidebarOpen: boolean;
  hasStartedChat: boolean;
}

export function useChatState() {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversation: null,
    messages: [],
    isLoading: false,
    isSidebarOpen: false,
    hasStartedChat: false,
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversation history on mount
  useEffect(() => {
    chatService.getConversations().then((conversations) => {
      setState((prev) => ({ ...prev, conversations }));
    });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);

  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState((prev) => {
      const conversationId = prev.activeConversation?.id || generateId();
      const existingConversation = prev.activeConversation || {
        id: conversationId,
        title: content.trim().slice(0, 50) || 'New Conversation',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedMessages = [...prev.messages, userMessage];

      return {
        ...prev,
        messages: updatedMessages,
        hasStartedChat: true,
        isLoading: true,
        activeConversation: {
          ...existingConversation,
          messages: updatedMessages,
          updatedAt: new Date(),
        },
      };
    });

    try {
      const conversationId = state.activeConversation?.id || 'new';
      const response = await chatService.sendMessage(conversationId, content, attachments);

      setState((prev) => {
        const updatedMessages = [...prev.messages, response];
        return {
          ...prev,
          messages: updatedMessages,
          isLoading: false,
          activeConversation: prev.activeConversation
            ? {
                ...prev.activeConversation,
                messages: updatedMessages,
                updatedAt: new Date(),
              }
            : null,
        };
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.activeConversation?.id]);

  const newChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeConversation: null,
      messages: [],
      hasStartedChat: false,
    }));
  }, []);

  const selectConversation = useCallback((conversation: Conversation) => {
    setState((prev) => ({
      ...prev,
      activeConversation: conversation,
      messages: conversation.messages,
      hasStartedChat: conversation.messages.length > 0,
    }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    await chatService.deleteConversation(id);
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.filter((c) => c.id !== id),
      ...(prev.activeConversation?.id === id
        ? { activeConversation: null, messages: [], hasStartedChat: false }
        : {}),
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    newChat,
    selectConversation,
    toggleSidebar,
    deleteConversation,
    messagesEndRef,
  };
}
