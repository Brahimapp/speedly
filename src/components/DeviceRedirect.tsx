import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDevice } from '../context/DeviceContext';

interface DeviceRedirectProps {
  redirectPath: string;
  children?: React.ReactNode;
}

const DeviceRedirect: React.FC<DeviceRedirectProps> = ({ redirectPath, children }) => {
  const { capabilities, isLoading } = useDevice();

  useEffect(() => {
    if (!isLoading && !capabilities.isMobile) {
      // Could show a toast notification here
      console.log('This feature is only available on mobile devices');
    }
  }, [capabilities.isMobile, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!capabilities.isMobile) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default DeviceRedirect;