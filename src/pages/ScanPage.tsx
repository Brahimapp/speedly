import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { Camera, CameraIcon as FlipCameraIcon, ZapIcon, PauseIcon, PlayIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSpeedly } from '../context/SpeedlyContext';
import { useAuth } from '../context/AuthContext';
import { useDevice } from '../context/DeviceContext';
import SpeedDisplay from '../components/scan/SpeedDisplay';
import CameraOverlay from '../components/scan/CameraOverlay';
import ActionButton from '../components/scan/ActionButton';
import SessionTimer from '../components/scan/SessionTimer';

const ScanPage: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    startSession, 
    sessionTimeRemaining, 
    isSessionExpired,
    currentSpeed, 
    currentSpeedLimit,
    isCameraActive,
    toggleCamera,
    addSpeedRecord
  } = useSpeedly();
  const { capabilities, requestCameraPermission } = useDevice();
  
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [mockSpeed, setMockSpeed] = useState<number | null>(null);
  const [mockSpeedLimit, setMockSpeedLimit] = useState<number | null>(null);
  
  // Start session when component mounts
  useEffect(() => {
    if (!user?.isPremium) {
      startSession();
    }
    
    // Request camera permission
    const setupCamera = async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        // Navigate back if permission denied
        navigate('/dashboard');
      }
    };
    
    setupCamera();
    
    // Mock speed data (for demo)
    const speedInterval = setInterval(() => {
      if (!isPaused && isDetecting) {
        // Generate random speed between 25-70
        const newSpeed = Math.floor(Math.random() * 45) + 25;
        setMockSpeed(newSpeed);
        
        // 30% chance to change speed limit
        if (Math.random() < 0.3) {
          const limits = [25, 30, 35, 45, 55, 65];
          const newLimit = limits[Math.floor(Math.random() * limits.length)];
          setMockSpeedLimit(newLimit);
          
          // Add to history occasionally
          if (Math.random() < 0.3) {
            addSpeedRecord({
              timestamp: new Date(),
              detectedSpeed: newSpeed,
              speedLimit: newLimit,
              location: {
                latitude: 40.7128,
                longitude: -74.0060,
              },
              isExceeding: newSpeed > newLimit,
              imageUrl: 'https://images.pexels.com/photos/3378609/pexels-photo-3378609.jpeg'
            });
          }
        }
      }
    }, 3000);
    
    return () => {
      clearInterval(speedInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, isDetecting]);
  
  // Toggle camera facing mode
  const handleFlipCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };
  
  // Toggle flash (mock functionality)
  const handleToggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };
  
  // Toggle pause/resume
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Start/stop detection
  const handleToggleDetection = () => {
    setIsDetecting(!isDetecting);
  };
  
  // Handle exit
  const handleExit = () => {
    navigate('/dashboard');
  };
  
  // Check if exceeding speed limit
  const isExceedingLimit = mockSpeed !== null && 
                          mockSpeedLimit !== null && 
                          mockSpeed > mockSpeedLimit;

  // Capture frame for speed limit detection
  const captureFrame = useCallback(() => {
    if (webcamRef.current && !isPaused && isDetecting) {
      const imageSrc = webcamRef.current.getScreenshot();
      // Here we would process the image for OCR
      // For this demo, we're using mock data instead
    }
  }, [isPaused, isDetecting]);
  
  // Periodically capture frames
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isDetecting && !isPaused) {
      interval = setInterval(() => {
        captureFrame();
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, isPaused, captureFrame]);

  // Webcam video constraints
  const videoConstraints = {
    facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Camera Stream */}
      <div className="relative flex-1 overflow-hidden">
        {!isPaused && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="absolute min-w-full min-h-full object-cover"
          />
        )}
        
        {/* Overlays */}
        <CameraOverlay 
          isDetecting={isDetecting}
          isPaused={isPaused}
          isExceedingLimit={isExceedingLimit}
        />
        
        {/* Speed Display */}
        <div className="absolute top-1/4 left-0 right-0 flex justify-center">
          <SpeedDisplay 
            currentSpeed={mockSpeed} 
            speedLimit={mockSpeedLimit}
            isDetecting={isDetecting}
          />
        </div>
        
        {/* Top Bar with Timer and Exit */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4">
          {!user?.isPremium && sessionTimeRemaining !== null && (
            <SessionTimer timeRemaining={sessionTimeRemaining} />
          )}
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleExit}
            className="h-10 w-10 rounded-full bg-black bg-opacity-50 flex items-center justify-center"
          >
            <XIcon className="h-6 w-6 text-white" />
          </motion.button>
        </div>
      </div>
      
      {/* Control Panel */}
      <div className="bg-gray-900 py-4 px-6">
        <div className="flex justify-between items-center">
          <ActionButton 
            icon={FlipCameraIcon} 
            label="Flip"
            onClick={handleFlipCamera}
          />
          
          <ActionButton 
            icon={ZapIcon} 
            label="Flash"
            onClick={handleToggleFlash}
            active={flashEnabled}
          />
          
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleDetection}
              className={`h-16 w-16 rounded-full ${isDetecting ? 'bg-error-500' : 'bg-primary-500'} flex items-center justify-center shadow-lg`}
            >
              <Camera className="h-8 w-8 text-white" />
            </motion.button>
            <p className="text-xs text-center text-white mt-1">
              {isDetecting ? 'Stop' : 'Scan'}
            </p>
          </div>
          
          <ActionButton 
            icon={isPaused ? PlayIcon : PauseIcon} 
            label={isPaused ? 'Resume' : 'Pause'}
            onClick={handleTogglePause}
          />
          
          <div className="w-12" /> {/* Placeholder for balance */}
        </div>
      </div>
    </div>
  );
};

export default ScanPage;