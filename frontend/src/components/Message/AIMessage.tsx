import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatTimestamp } from '../../utils';

interface AIMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: Date;
  };
  isLoading?: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-aura-violet"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function AIMessage({ message, isLoading = false }: AIMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex justify-start"
    >
      <div className="max-w-[680px]">
        {/* Avatar + Content */}
        <div className="flex items-start gap-3">
          {/* Aura avatar */}
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            }}
          >
            <Sparkles size={14} className="text-white" />
          </div>

          {/* Message body */}
          <div className="min-w-0 pt-0.5">
            {isLoading ? (
              <TypingIndicator />
            ) : (
              <div className="ai-prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        <p className="mt-1.5 pl-10 text-xs text-aura-text-muted">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

export default AIMessage;
