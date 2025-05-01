import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gauge, 
  History, 
  Settings, 
  LogOut, 
  Camera,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSpeedly } from '../context/SpeedlyContext';
import { useDevice } from '../context/DeviceContext';
import SessionExpiredModal from '../components/SessionExpiredModal';

const MainLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const { capabilities } = useDevice();
  const { 
    isSessionExpired, 
    sessionTimeRemaining, 
    endSession 
  } = useSpeedly();
  const [isShowingPremiumModal, setIsShowingPremiumModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Format remaining time as MM:SS
  const formatTime = (ms: number | null) => {
    if (ms === null) return '--:--';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Show premium modal when session expires
  useEffect(() => {
    if (isSessionExpired) {
      setIsShowingPremiumModal(true);
    }
  }, [isSessionExpired]);

  const handleCloseModal = () => {
    setIsShowingPremiumModal(false);
    endSession();
  };

  const navigationItems = [
    { icon: Gauge, label: 'Dashboard', path: '/dashboard' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    ...(capabilities.isMobile ? [{ icon: Camera, label: 'Scan', path: '/scan' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Gauge className="text-primary-600 h-6 w-6" />
            <h1 className="text-xl font-semibold text-gray-900">Speedly</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {!user?.isPremium && sessionTimeRemaining !== null && (
              <div className="hidden sm:flex items-center">
                <span className="text-sm text-gray-500 mr-2">Session:</span>
                <span className="text-sm font-medium text-gray-700">{formatTime(sessionTimeRemaining)}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">Level {user?.level}</span>
                  {!user?.isPremium && (
                    <span 
                      className="ml-2 px-2 py-0.5 text-xs bg-warning-100 text-warning-800 rounded-full"
                      onClick={() => navigate('/premium')}
                    >
                      FREE
                    </span>
                  )}
                  {user?.isPremium && (
                    <span 
                      className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded-full"
                    >
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={signOut}
                className="p-1.5 rounded-full hover:bg-gray-100"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-2">
        <ul className="flex justify-around items-center max-w-md mx-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 h-1 w-12 bg-primary-500 rounded-t"
                      layoutId="navbar-indicator"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Session expired modal */}
      {isShowingPremiumModal && (
        <SessionExpiredModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MainLayout;