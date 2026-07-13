import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Paperclip } from 'lucide-react';

interface UploadButtonProps {
  onUpload: (files: File[]) => void;
  disabled?: boolean;
}

export default function UploadButton({ onUpload, disabled }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(Array.from(files));
      // Reset so the same file can be re-selected
      e.target.value = '';
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-xl p-2 text-lumi-text-muted transition-colors duration-200
                   hover:text-lumi-text hover:bg-white/5
                   disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Attach PDF files"
      >
        <Paperclip size={18} />
      </motion.button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
    </>
  );
}
