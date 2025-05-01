import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface SessionTimerProps {
  timeRemaining: number;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ timeRemaining }) => {
  // Format time as mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate percentage of time remaining
  // Assuming 30 minute sessions (1800000 ms)
  const percentRemaining = Math.min(100, Math.max(0, (timeRemaining / 1800000) * 100));
  
  // Determine color based on time remaining
  const getTimerColor = () => {
    if (percentRemaining < 10) return 'text-error-500';
    if (percentRemaining < 30) return 'text-warning-500';
    return 'text-white';
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black bg-opacity-50 rounded-full px-3 py-1.5 flex items-center space-x-2 backdrop-blur-sm"
    >
      <Clock className="h-4 w-4 text-gray-300" />
      <span className={`text-sm font-medium ${getTimerColor()}`}>
        {formatTime(timeRemaining)}
      </span>
    </motion.div>
  );
};

export default SessionTimer;