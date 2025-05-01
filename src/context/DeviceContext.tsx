import React, { createContext, useContext, useState, useEffect } from 'react';

interface DeviceCapabilities {
  isMobile: boolean;
  hasCamera: boolean;
  hasGPS: boolean;
  hasMicrophone: boolean;
  hasFullSupport: boolean;
}

interface DeviceContextType {
  capabilities: DeviceCapabilities;
  isLoading: boolean;
  requestCameraPermission: () => Promise<boolean>;
  requestLocationPermission: () => Promise<boolean>;
  requestMicrophonePermission: () => Promise<boolean>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    hasCamera: false,
    hasGPS: false,
    hasMicrophone: false,
    hasFullSupport: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectCapabilities = async () => {
      try {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

        // Check if browser supports the necessary APIs
        const hasCamera = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
        const hasGPS = 'geolocation' in navigator;
        const hasMicrophone = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
        
        // Full support means the device is mobile and has all required capabilities
        const hasFullSupport = isMobile && hasCamera && hasGPS && hasMicrophone;

        setCapabilities({
          isMobile,
          hasCamera,
          hasGPS,
          hasMicrophone,
          hasFullSupport,
        });
      } catch (error) {
        console.error('Error detecting device capabilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    detectCapabilities();
  }, []);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (!capabilities.hasCamera) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!capabilities.hasGPS) return false;

    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      return false;
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    if (!capabilities.hasMicrophone) return false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        capabilities,
        isLoading,
        requestCameraPermission,
        requestLocationPermission,
        requestMicrophonePermission,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};