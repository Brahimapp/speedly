import React from 'react';
import { motion } from 'framer-motion';

interface SpeedDisplayProps {
  currentSpeed: number | null;
  speedLimit: number | null;
  isDetecting: boolean;
}

const SpeedDisplay: React.FC<SpeedDisplayProps> = ({ 
  currentSpeed, 
  speedLimit,
  isDetecting
}) => {
  // Determine speed status
  const getSpeedStatus = () => {
    if (currentSpeed === null || speedLimit === null) return 'neutral';
    if (currentSpeed > speedLimit + 10) return 'danger';
    if (currentSpeed > speedLimit) return 'warning';
    return 'safe';
  };
  
  const status = getSpeedStatus();
  
  // Get color based on speed status
  const getStatusColor = () => {
    switch (status) {
      case 'danger': return 'text-error-500';
      case 'warning': return 'text-warning-500';
      case 'safe': return 'text-success-500';
      default: return 'text-white';
    }
  };
  
  // Get message based on speed status
  const getStatusMessage = () => {
    switch (status) {
      case 'danger': return 'Significantly Over Limit!';
      case 'warning': return 'Over Speed Limit';
      case 'safe': return 'Within Speed Limit';
      default: return 'No Speed Detected';
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black bg-opacity-50 rounded-xl p-4 backdrop-blur-sm"
    >
      {!isDetecting && (
        <div className="text-center text-white">
          <p className="text-sm">Press scan to begin</p>
        </div>
      )}
      
      {isDetecting && (
        <>
          {/* Current Speed */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${getStatusColor()}`}>
              {currentSpeed !== null ? currentSpeed : '--'}
            </div>
            <div className="text-xs text-gray-300 uppercase tracking-wider mt-1">
              MPH
            </div>
          </div>
          
          {/* Speed Limit */}
          {speedLimit !== null && (
            <div className="mt-2 flex justify-center items-center">
              <div className="bg-white text-black text-sm font-bold rounded-md px-2 py-1 inline-flex items-center">
                <span>LIMIT</span>
                <span className="ml-1 text-base">{speedLimit}</span>
              </div>
            </div>
          )}
          
          {/* Status Message */}
          <div className={`mt-2 text-center text-sm font-medium ${getStatusColor()}`}>
            {getStatusMessage()}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SpeedDisplay;