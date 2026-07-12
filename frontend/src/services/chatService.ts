/**
 * Chat Service — Isolated API layer for FastAPI backend integration.
 *
 * Currently uses mock responses for UI development.
 * Replace the mock logic with actual fetch/axios calls when the backend is ready.
 */

import type { Message, Conversation } from '../types';
import { generateId } from '../utils';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─── Mock AI Responses ───
const mockResponses: string[] = [
  `That's a great question! Let me break it down for you.

## Key Points

1. **First**, consider the architecture of your system
2. **Second**, think about the data flow
3. **Third**, optimize for performance

Here's a quick example:

\`\`\`python
def process_data(input_data):
    """Process and transform data efficiently."""
    result = transform(input_data)
    return optimize(result)
\`\`\`

> The best approach is to start simple and iterate.

Let me know if you'd like me to elaborate on any of these points!`,

  `I'd be happy to help with that! Here's what I recommend:

### Approach

The most effective strategy involves three phases:

| Phase | Action | Timeline |
|-------|--------|----------|
| Discovery | Research & Analysis | Week 1-2 |
| Design | Architecture & Prototyping | Week 3-4 |
| Build | Implementation & Testing | Week 5-8 |

Each phase builds on the previous one, ensuring a solid foundation.

Feel free to ask follow-up questions!`,

  `Absolutely! Here's a comprehensive overview:

## Understanding the Concept

This is a fundamental concept in modern software development. The key insight is that **simplicity drives reliability**.

### Benefits
- Improved maintainability
- Better performance characteristics
- Easier debugging and testing
- Enhanced developer experience

### Implementation

\`\`\`typescript
interface Config {
  mode: 'development' | 'production';
  features: string[];
  optimizations: boolean;
}

const defaultConfig: Config = {
  mode: 'development',
  features: ['core', 'analytics'],
  optimizations: true,
};
\`\`\`

The configuration above gives you a solid starting point. Would you like me to go deeper into any specific area?`,
];

function getRandomResponse(): string {
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

// ─── Service Methods ───

export async function sendMessage(
  conversationId: string,
  content: string,
  _attachments?: File[]
): Promise<Message> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

  // Mock AI response
  const response: Message = {
    id: generateId(),
    role: 'assistant',
    content: getRandomResponse(),
    timestamp: new Date(),
  };

  return response;
}

export async function createConversation(): Promise<Conversation> {
  const conversation: Conversation = {
    id: generateId(),
    title: 'New Conversation',
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return conversation;
}

export async function getConversations(): Promise<Conversation[]> {
  // Mock conversation history
  return [
    {
      id: generateId(),
      title: 'Understanding Neural Networks',
      messages: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: generateId(),
      title: 'React Architecture Patterns',
      messages: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: generateId(),
      title: 'FastAPI Best Practices',
      messages: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
      id: generateId(),
      title: 'Design System Implementation',
      messages: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    },
    {
      id: generateId(),
      title: 'Deploying to Production',
      messages: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    },
  ];
}

export async function getConversation(id: string): Promise<Conversation | null> {
  // In production, fetch from API
  return null;
}

export async function deleteConversation(id: string): Promise<void> {
  // In production, call DELETE endpoint
  console.log(`Deleted conversation ${id}`);
}

export async function uploadFile(file: File): Promise<{ id: string; name: string; url: string }> {
  // Simulate upload
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: generateId(),
    name: file.name,
    url: URL.createObjectURL(file),
  };
}
