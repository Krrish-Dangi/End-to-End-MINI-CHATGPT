import { AnimatePresence, motion } from 'framer-motion';
import UserMessage from '../Message/UserMessage';
import AIMessage from '../Message/AIMessage';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const messageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function ChatContainer({
  messages,
  isLoading,
  messagesEndRef,
}: ChatContainerProps) {
  const lastMessage = messages[messages.length - 1];
  const showLoadingBubble = isLoading && lastMessage?.role === 'user';

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      {isLoading && messages.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-lumi-text-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-lumi-violet"></div>
            <p className="text-sm">Loading history...</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[800px] flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {msg.role === 'user' ? (
                <UserMessage message={msg} />
              ) : (
                <AIMessage message={msg} />
              )}
            </motion.div>
          ))}

          {/* Loading placeholder while AI is generating */}
          {showLoadingBubble && (
            <motion.div
              key="ai-loading"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <AIMessage
                message={{
                  id: '__loading__',
                  content: '',
                  timestamp: new Date(),
                }}
                isLoading
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-0 w-0 shrink-0" />
      </div>
      )}
    </div>
  );
}
