import { motion } from 'framer-motion';
import { formatTimestamp } from '../../utils';
import { FileText } from 'lucide-react';
import type { Attachment } from '../../types';

interface UserMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: Date;
    attachments?: Attachment[];
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
      <div className="max-w-[520px] flex flex-col items-end">
        {/* Render attachments if any */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-col gap-2 w-full items-end mb-1">
            {message.attachments.map(att => (
              <div key={att.id} className="flex items-center gap-3 bg-white/[0.03] border border-lumi-border/40 backdrop-blur-md rounded-2xl px-4 py-3 min-w-[200px] max-w-full glass">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-lumi-violet/20 flex items-center justify-center">
                  <FileText className="text-lumi-violet h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-lumi-text truncate">{att.name}</p>
                  <p className="text-xs text-lumi-text-muted mt-0.5 truncate">
                    PDF Document • {(att.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Render text content if any */}
        {message.content && (
          <div className="message-user rounded-2xl px-5 py-3.5">
            <p className="text-[15px] leading-relaxed text-lumi-text whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        )}

        <p className="mt-1.5 pr-1 text-right text-xs text-lumi-text-muted">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
}

export default UserMessage;
