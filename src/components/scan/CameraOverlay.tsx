import React from 'react';
import { motion } from 'framer-motion';

interface CameraOverlayProps {
  isDetecting: boolean;
  isPaused: boolean;
  isExceedingLimit: boolean;
}

const CameraOverlay: React.FC<CameraOverlayProps> = ({
  isDetecting,
  isPaused,
  isExceedingLimit
}) => {
  // Get border color based on status
  const getBorderColor = () => {
    if (!isDetecting) return 'border-white';
    if (isExceedingLimit) return 'border-error-500';
    return 'border-success-500';
  };
  
  return (
    <>
      {/* Full screen tint when paused */}
      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <p className="text-white text-xl font-medium">Camera Paused</p>
        </div>
      )}
      
      {/* Scanning frame */}
      {isDetecting && !isPaused && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full aspect-[3/2] border-2 ${getBorderColor()} rounded-lg relative`}
          >
            {/* Corner indicators */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 -translate-x-1 -translate-y-1 rounded-tl-sm"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 translate-x-1 -translate-y-1 rounded-tr-sm"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 -translate-x-1 translate-y-1 rounded-bl-sm"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 translate-x-1 translate-y-1 rounded-br-sm"></div>
            
            {/* Scanning animation */}
            <motion.div 
              initial={{ top: 0 }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute left-0 right-0 h-0.5 bg-white bg-opacity-80"
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CameraOverlay;