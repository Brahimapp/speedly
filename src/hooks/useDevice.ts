import { useState, useEffect } from 'react';
import { DeviceCapabilities } from '@/types';
import { deviceSupportsCamera, deviceSupportsGeolocation } from '@/lib/utils';

export function useDevice(): DeviceCapabilities & { isLoading: boolean } {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasCamera: false,
    hasGeolocation: false,
    hasMicrophone: false,
    hasMotionSensors: false,
    supportsPwa: false,
    isStandalone: false,
    isMobileDevice: window.innerWidth <= 768,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkDeviceCapabilities() {
      try {
        // Check camera
        const hasCamera = deviceSupportsCamera();
        
        // Check geolocation
        const hasGeolocation = deviceSupportsGeolocation();
        
        // Check microphone
        let hasMicrophone = false;
        try {
          hasMicrophone = 'mediaDevices' in navigator && 
            'getUserMedia' in navigator.mediaDevices;
        } catch (e) {
          console.error('Error checking microphone support:', e);
        }
        
        // Check motion sensors
        let hasMotionSensors = false;
        try {
          hasMotionSensors = 'DeviceMotionEvent' in window;
        } catch (e) {
          console.error('Error checking motion sensor support:', e);
        }
        
        // Check PWA support and standalone mode
        const supportsPwa = 
          'serviceWorker' in navigator && 
          'PushManager' in window;
        
        const isStandalone = 
          window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true;
        
        setCapabilities({
          hasCamera,
          hasGeolocation,
          hasMicrophone,
          hasMotionSensors,
          supportsPwa,
          isStandalone,
          isMobileDevice: window.innerWidth <= 768,
        });
      } catch (error) {
        console.error('Error checking device capabilities:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkDeviceCapabilities();

    // Handle window resize for mobile detection
    const handleResize = () => {
      setCapabilities(prev => ({
        ...prev,
        isMobileDevice: window.innerWidth <= 768
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ...capabilities, isLoading };
}