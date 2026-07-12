import type { Message, Conversation } from '../types';
import { generateId } from '../utils';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const STORAGE_KEY = 'aura_conversations';

// ─── LocalStorage Helpers ───
function getStoredConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    // Parse JSON and convert string dates back to Date objects
    const parsed = JSON.parse(data);
    return parsed.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages || []
    })).sort((a: Conversation, b: Conversation) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (err) {
    console.error("Failed to parse conversations from localStorage", err);
    return [];
  }
}

function saveStoredConversations(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function updateConversationTitle(id: string, newTitle: string) {
  const convs = getStoredConversations();
  const index = convs.findIndex(c => c.id === id);
  if (index !== -1) {
    convs[index].title = newTitle;
    convs[index].updatedAt = new Date();
    saveStoredConversations(convs);
  }
}

// ─── Service Methods ───

export async function createConversation(): Promise<Conversation> {
  const conversation: Conversation = {
    id: generateId(),
    title: 'New Chat',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const convs = getStoredConversations();
  saveStoredConversations([conversation, ...convs]);

  return conversation;
}

export async function getConversations(): Promise<Conversation[]> {
  return getStoredConversations();
}

export async function getConversation(id: string): Promise<Conversation | null> {
  const convs = getStoredConversations();
  const conversation = convs.find(c => c.id === id);
  if (!conversation) return null;

  try {
    const res = await fetch(`${API_BASE}/history?session_id=${id}`);
    if (res.ok) {
      const history = await res.json();
      // Map backend JSON to frontend Message type
      conversation.messages = history.map((msg: {type: string, content: string}, idx: number) => ({
        id: `${id}-msg-${idx}`,
        role: msg.type === 'human' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: new Date() // Backend doesn't store timestamps yet, using current time
      }));
    } else {
      // If history not found on backend (e.g., server restart), it will just return empty messages
      conversation.messages = [];
    }
  } catch (error) {
    console.error("Error fetching history:", error);
  }

  return conversation;
}

export async function sendMessage(
  conversationId: string,
  content: string,
  attachments?: File[]
): Promise<Message> {
  
  // 1. Upload files first if any
  if (attachments && attachments.length > 0) {
    for (const file of attachments) {
      const formData = new FormData();
      formData.append('id', conversationId);
      formData.append('file', file);

      try {
        await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.error("Failed to upload file:", err);
      }
    }
  }

  // 2. Send the message
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: content,
      id: conversationId
    })
  });

  if (!res.ok) {
    throw new Error('Failed to send message');
  }

  const aiContent = await res.text();

  // 3. Check if we should fetch the LLM generated title
  // We do this by hitting the metadata endpoint if the conversation title is 'New Chat'
  setTimeout(async () => {
    const convs = getStoredConversations();
    const currentConv = convs.find(c => c.id === conversationId);
    if (currentConv && currentConv.title === 'New Chat') {
      try {
        const metaRes = await fetch(`${API_BASE}/conversation_metadata?session_id=${conversationId}`);
        if (metaRes.ok) {
          const meta = await metaRes.json();
          if (meta.title) {
            updateConversationTitle(conversationId, meta.title);
            // We dispatch a custom event so the UI knows to refresh the sidebar if it wants to
            window.dispatchEvent(new Event('aura-conversation-updated'));
          }
        }
      } catch (e) {
        console.error("Failed to fetch metadata title", e);
      }
    }
  }, 1000);

  return {
    id: generateId(),
    role: 'assistant',
    content: aiContent,
    timestamp: new Date(),
  };
}

export async function deleteConversation(id: string): Promise<void> {
  // Call backend to clear memory
  try {
    await fetch(`${API_BASE}/delete?session_id=${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error("Failed to delete backend session", error);
  }

  // Remove from localStorage
  const convs = getStoredConversations();
  const filtered = convs.filter(c => c.id !== id);
  saveStoredConversations(filtered);
}
