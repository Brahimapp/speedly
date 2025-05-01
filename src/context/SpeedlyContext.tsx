import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface SpeedRecord {
  id: string;
  timestamp: Date;
  detectedSpeed: number;
  speedLimit: number;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  isExceeding: boolean;
  imageUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dateEarned: Date;
}

interface SpeedlyContextType {
  // User session tracking
  sessionStartTime: Date | null;
  sessionTimeRemaining: number | null;
  isSessionExpired: boolean;
  
  // Stats
  speedRecords: SpeedRecord[];
  currentSpeed: number | null;
  currentSpeedLimit: number | null;
  badges: Badge[];
  
  // Actions
  startSession: () => void;
  endSession: () => void;
  addSpeedRecord: (record: Omit<SpeedRecord, 'id'>) => void;
  clearHistory: () => void;
  
  // Camera mode
  isCameraActive: boolean;
  toggleCamera: () => void;
  
  // Settings
  voiceEnabled: boolean;
  toggleVoice: () => void;
  speedMonitoringEnabled: boolean;
  toggleSpeedMonitoring: () => void;
}

// Create context
const SpeedlyContext = createContext<SpeedlyContextType | undefined>(undefined);

// Provider component
export const SpeedlyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isPremium = user?.isPremium || false;
  
  // Session tracking
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  
  // Stats
  const [speedRecords, setSpeedRecords] = useState<SpeedRecord[]>([]);
  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);
  const [currentSpeedLimit, setCurrentSpeedLimit] = useState<number | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  
  // Camera mode
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Settings
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speedMonitoringEnabled, setSpeedMonitoringEnabled] = useState(true);

  // Effect for session time tracking
  useEffect(() => {
    if (!sessionStartTime || isPremium) return;
    
    const sessionDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - sessionStartTime.getTime();
      const remaining = Math.max(0, sessionDuration - elapsed);
      
      setSessionTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setIsSessionExpired(true);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionStartTime, isPremium]);

  // Load data from localStorage
  useEffect(() => {
    if (user) {
      try {
        const storedRecords = localStorage.getItem(`speedRecords_${user.id}`);
        if (storedRecords) {
          const parsedRecords = JSON.parse(storedRecords);
          // Convert string dates back to Date objects
          setSpeedRecords(parsedRecords.map((record: any) => ({
            ...record,
            timestamp: new Date(record.timestamp)
          })));
        }
        
        const storedBadges = localStorage.getItem(`badges_${user.id}`);
        if (storedBadges) {
          const parsedBadges = JSON.parse(storedBadges);
          setBadges(parsedBadges.map((badge: any) => ({
            ...badge,
            dateEarned: new Date(badge.dateEarned)
          })));
        }
        
        const storedVoiceEnabled = localStorage.getItem(`voiceEnabled_${user.id}`);
        if (storedVoiceEnabled !== null) {
          setVoiceEnabled(JSON.parse(storedVoiceEnabled));
        }
        
        const storedSpeedMonitoring = localStorage.getItem(`speedMonitoring_${user.id}`);
        if (storedSpeedMonitoring !== null) {
          setSpeedMonitoringEnabled(JSON.parse(storedSpeedMonitoring));
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, [user]);

  // Session management
  const startSession = () => {
    setSessionStartTime(new Date());
    setIsSessionExpired(false);
  };
  
  const endSession = () => {
    setSessionStartTime(null);
    setSessionTimeRemaining(null);
    setIsSessionExpired(false);
  };
  
  // Speed records
  const addSpeedRecord = (record: Omit<SpeedRecord, 'id'>) => {
    if (!user) return;
    
    const newRecord: SpeedRecord = {
      ...record,
      id: Date.now().toString(),
    };
    
    const updatedRecords = [newRecord, ...speedRecords];
    setSpeedRecords(updatedRecords);
    
    // Save to localStorage
    localStorage.setItem(`speedRecords_${user.id}`, JSON.stringify(updatedRecords));
  };
  
  const clearHistory = () => {
    if (!user) return;
    setSpeedRecords([]);
    localStorage.removeItem(`speedRecords_${user.id}`);
  };
  
  // Camera toggle
  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };
  
  // Settings toggles
  const toggleVoice = () => {
    if (!user) return;
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    localStorage.setItem(`voiceEnabled_${user.id}`, JSON.stringify(newValue));
  };
  
  const toggleSpeedMonitoring = () => {
    if (!user) return;
    const newValue = !speedMonitoringEnabled;
    setSpeedMonitoringEnabled(newValue);
    localStorage.setItem(`speedMonitoring_${user.id}`, JSON.stringify(newValue));
  };
  
  return (
    <SpeedlyContext.Provider
      value={{
        // Session tracking
        sessionStartTime,
        sessionTimeRemaining,
        isSessionExpired,
        
        // Stats
        speedRecords,
        currentSpeed,
        currentSpeedLimit,
        badges,
        
        // Actions
        startSession,
        endSession,
        addSpeedRecord,
        clearHistory,
        
        // Camera mode
        isCameraActive,
        toggleCamera,
        
        // Settings
        voiceEnabled,
        toggleVoice,
        speedMonitoringEnabled,
        toggleSpeedMonitoring,
      }}
    >
      {children}
    </SpeedlyContext.Provider>
  );
};

// Custom hook to use the Speedly context
export const useSpeedly = () => {
  const context = useContext(SpeedlyContext);
  if (context === undefined) {
    throw new Error('useSpeedly must be used within a SpeedlyProvider');
  }
  return context;
};