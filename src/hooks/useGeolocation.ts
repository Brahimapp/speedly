import { useState, useEffect, useCallback } from 'react';
import { GeoLocation } from '@/types';
import { useToast } from '@/context/ToastContext';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  watchPosition?: boolean;
}

interface UseGeolocationReturn {
  location: GeoLocation | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  startWatching: () => void;
  stopWatching: () => void;
}

export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();

  const {
    enableHighAccuracy = true,
    maximumAge = 0,
    timeout = 10000,
    watchPosition = false,
  } = options;

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
    setIsLoading(false);
    setError(null);
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    setError(error);
    setIsLoading(false);
    
    // Show error toast based on the type of error
    if (error.code === 1) {
      toast('error', 'Location access denied', 'Please enable location services to use this feature');
    } else if (error.code === 2) {
      toast('error', 'Location unavailable', 'Could not determine your current location');
    } else if (error.code === 3) {
      toast('warning', 'Location timed out', 'Getting your location is taking too long');
    }
  }, [toast]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError({ 
        code: 2, 
        message: 'Geolocation is not supported by this browser.',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3 
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (watchPosition && watchId === null) {
      const id = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        { enableHighAccuracy, maximumAge, timeout }
      );
      setWatchId(id);
    } else {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        { enableHighAccuracy, maximumAge, timeout }
      );
    }
  }, [watchPosition, watchId, enableHighAccuracy, maximumAge, timeout, onSuccess, onError]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    if (watchPosition) {
      startWatching();
    } else {
      startWatching();
    }

    return () => {
      stopWatching();
    };
  }, [watchPosition, startWatching, stopWatching]);

  return { location, error, isLoading, startWatching, stopWatching };
}