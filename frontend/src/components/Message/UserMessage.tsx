import { motion } from 'framer-motion';
import { formatTimestamp } from '../../utils';

interface UserMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: Date;
  };
}

function UserMessage({ message }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex justify-end"
    >
      <div className="max-w-[520px]">
        <div className="message-user rounded-2xl px-5 py-3.5">
          <p className="text-[15px] leading-relaxed text-aura-text whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        <p className="mt-1.5 pr-1 text-right text-xs text-aura-text-muted">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

export default UserMessage;
