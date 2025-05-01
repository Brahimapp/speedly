import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import { SpeedlyProvider } from './context/SpeedlyContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import DeviceRedirect from './components/DeviceRedirect';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ScanPage from './pages/ScanPage';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <DeviceProvider>
            <SpeedlyProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  
                  {/* Auth routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                  </Route>
                  
                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                    
                    {/* Mobile-only routes */}
                    <Route element={<DeviceRedirect requiresMobile />}>
                      <Route path="/scan" element={<ScanPage />} />
                    </Route>
                    
                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      {/* Add more admin routes as needed */}
                    </Route>
                  </Route>
                  
                  {/* Fallback routes */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Router>
            </SpeedlyProvider>
          </DeviceProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;