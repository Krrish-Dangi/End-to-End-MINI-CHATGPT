import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { formatDate } from '../../utils';

interface ConversationCardProps {
  conversation: { id: string; title: string; updatedAt: Date };
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
}

function ConversationCard({
  conversation,
  isActive,
  onClick,
  onDelete,
}: ConversationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer
        transition-colors duration-200 group
        ${
          isActive
            ? 'bg-aura-violet/10 border border-aura-violet/20'
            : 'border border-transparent hover:bg-white/[0.03]'
        }
      `}
    >
      {/* Active accent bar */}
      {isActive && (
        <motion.div
          layoutId="active-conversation-bar"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-aura-violet"
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 pl-1">
        <p
          className={`text-sm font-medium line-clamp-1 ${
            isActive ? 'text-aura-text' : 'text-aura-text-secondary'
          }`}
        >
          {conversation.title}
        </p>
        <p className="text-xs text-aura-text-muted mt-0.5">
          {formatDate(conversation.updatedAt)}
        </p>
      </div>

      {/* Delete button — visible on hover */}
      {isHovered && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(conversation.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg
            text-aura-text-muted hover:text-aura-error hover:bg-aura-error/10
            transition-colors duration-150 cursor-pointer"
        >
          <Trash2 size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}

export default ConversationCard;
