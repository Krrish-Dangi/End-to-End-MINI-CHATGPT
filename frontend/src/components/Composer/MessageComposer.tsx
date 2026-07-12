import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, X, FileText } from 'lucide-react';
import UploadButton from '../Upload/UploadButton';

interface MessageComposerProps {
  onSend: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  isCentered?: boolean;
}

export default function MessageComposer({
  onSend,
  isLoading = false,
  isCentered = false,
}: MessageComposerProps) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Auto-resize textarea ──
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '52px'; // reset to min
    const next = Math.min(el.scrollHeight, 200);
    el.style.height = `${Math.max(52, next)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  // ── Handlers ──
  const canSend = input.trim().length > 0 && !isLoading;

  const handleSend = () => {
    if (!canSend) return;
    onSend(input.trim(), attachments.length > 0 ? attachments : undefined);
    setInput('');
    setAttachments([]);
    // Reset textarea height after clearing
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '52px';
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`w-full max-w-[680px] ${isCentered ? 'mx-auto' : ''}`}>
      <div className="glass-composer rounded-2xl p-3 transition-shadow duration-300">
        {/* ── Attachment Chips ── */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 px-1 pb-2"
            >
              {attachments.map((file, idx) => (
                <motion.span
                  key={`${file.name}-${idx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/5
                             border border-aura-border px-2.5 py-1 text-xs text-aura-text-secondary"
                >
                  <FileText size={13} className="text-aura-violet shrink-0" />
                  <span className="max-w-[140px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="ml-0.5 rounded p-0.5 text-aura-text-muted
                               hover:text-aura-text hover:bg-white/10 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Textarea ── */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Aura anything..."
          rows={1}
          className="w-full resize-none bg-transparent text-aura-text text-[15px]
                     leading-relaxed placeholder:text-aura-text-muted
                     border-none outline-none px-2 py-2"
          style={{ minHeight: '52px', maxHeight: '200px' }}
          disabled={isLoading}
        />

        {/* ── Bottom Actions ── */}
        <div className="flex items-center justify-between px-1 pt-1">
          {/* Left — Upload */}
          <UploadButton onUpload={handleUpload} disabled={isLoading} />

          {/* Right — Send */}
          <motion.button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.92 } : {}}
            className="rounded-xl bg-gradient-to-r from-aura-violet to-aura-purple
                       p-2.5 text-white shadow-lg shadow-aura-violet/20
                       transition-opacity duration-200
                       disabled:opacity-35 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="block h-[18px] w-[18px] rounded-full border-2
                               border-white/30 border-t-white animate-spin" />
            ) : (
              <SendHorizontal size={18} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
