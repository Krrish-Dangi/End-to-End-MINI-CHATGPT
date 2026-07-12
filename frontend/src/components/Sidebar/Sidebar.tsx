import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelLeftOpen,
  PanelLeftClose,
  Plus,
  Search,
  User,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import ConversationCard from '../Conversation/ConversationCard';

interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conv: Conversation) => void;
  onDeleteConversation: (id: string) => void;
}

function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.aside
      animate={{ width: isOpen ? 280 : 68 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col bg-aura-bg-secondary border-r border-aura-border overflow-hidden shrink-0"
    >
      {/* ═══ TOP BAR ═══ */}
      <div className="pt-4 px-3 shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            /* ─── Expanded: Glassmorphic island with New Chat + Collapse ─── */
            <motion.div
              key="expanded-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-2
                         glass rounded-xl px-2 py-1.5"
            >
              {/* Left: + New Chat */}
              <motion.button
                onClick={onNewChat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5
                           text-aura-text-secondary hover:text-aura-text
                           hover:bg-white/5 transition-colors duration-200"
              >
                <Plus size={18} className="text-aura-violet shrink-0" />
                <span className="text-sm font-medium whitespace-nowrap">New Chat</span>
              </motion.button>

              {/* Right: Collapse button stuck to border */}
              <motion.button
                onClick={onToggle}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center justify-center w-8 h-8 rounded-lg
                           text-aura-text-muted hover:text-aura-text
                           hover:bg-white/5 transition-colors duration-200"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={18} />
              </motion.button>
            </motion.div>
          ) : (
            /* ─── Collapsed: Just icon buttons vertically ─── */
            <motion.div
              key="collapsed-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-1"
            >
              <SidebarItem
                icon={<PanelLeftOpen size={20} />}
                label="Expand sidebar"
                onClick={onToggle}
              />
              <SidebarItem
                icon={<Plus size={20} />}
                label="New chat"
                onClick={onNewChat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ EXPANDED CONTENT: Search + Conversations ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="flex flex-col flex-1 min-h-0 mt-4"
          >
            {/* Search input */}
            <div className="px-3 mb-3">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-aura-text-muted z-10 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search conversations…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl
                    bg-white/[0.04] backdrop-blur-sm
                    border border-aura-border
                    text-aura-text placeholder:text-aura-text-muted
                    outline-none
                    focus:border-aura-violet/30 focus:bg-white/[0.06]
                    transition-all duration-200"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeConversationId}
                    onClick={() => onSelectConversation(conv)}
                    onDelete={onDeleteConversation}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-aura-text-muted">
                  <Search size={20} className="mb-2 opacity-40" />
                  <p className="text-xs">
                    {searchQuery ? 'No results found' : 'No conversations yet'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ BOTTOM: User Profile (always rendered, text fades smoothly) ═══ */}
      <div className="mt-auto shrink-0 border-t border-aura-border">
        <motion.div
          layout
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`flex items-center py-3 ${
            isOpen ? 'px-4 gap-3' : 'justify-center px-0'
          }`}
        >
          {/* Avatar — always visible */}
          <motion.div
            layout="position"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-aura-violet to-aura-magenta
                       flex items-center justify-center shrink-0 cursor-pointer"
          >
            <User size={15} className="text-white" />
          </motion.div>

          {/* Name + Email — fades in/out smoothly */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="profile-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{
                  opacity: 1,
                  width: 'auto',
                  transition: { opacity: { duration: 0.25, delay: 0.15 }, width: { duration: 0.3 } },
                }}
                exit={{
                  opacity: 0,
                  width: 0,
                  transition: { opacity: { duration: 0.1 }, width: { duration: 0.25, delay: 0.05 } },
                }}
                className="min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium text-aura-text truncate">
                  Krrish
                </p>
                <p className="text-xs text-aura-text-muted truncate">
                  krrish@aura.dev
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
