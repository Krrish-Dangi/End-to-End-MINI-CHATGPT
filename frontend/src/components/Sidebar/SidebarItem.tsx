import { motion } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

function SidebarItem({ icon, label, onClick, isActive = false }: SidebarItemProps) {
  return (
    <div className="tooltip-container">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center justify-center w-10 h-10 rounded-xl
          transition-colors duration-200 cursor-pointer
          ${
            isActive
              ? 'bg-lumi-violet/10 text-lumi-violet shadow-[0_0_12px_rgba(139,92,246,0.15)]'
              : 'text-lumi-text-secondary hover:bg-white/5 hover:text-lumi-text'
          }
        `}
      >
        {icon}
      </motion.button>
      <span className="tooltip">{label}</span>
    </div>
  );
}

export default SidebarItem;
