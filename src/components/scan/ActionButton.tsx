import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  active = false
}) => {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`h-12 w-12 rounded-full ${active ? 'bg-primary-500' : 'bg-gray-800'} flex items-center justify-center`}
      >
        <Icon className="h-6 w-6 text-white" />
      </motion.button>
      <p className="text-xs text-center text-white mt-1">{label}</p>
    </div>
  );
};

export default ActionButton;