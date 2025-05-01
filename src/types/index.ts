// User related types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  createdAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  speedUnit: 'kph' | 'mph';
  voiceEnabled: boolean;
  gpsTrackingEnabled: boolean;
  darkMode: boolean;
  voiceLanguage: string;
  voiceGender: 'male' | 'female';
}

// Speed and detection related types
export interface SpeedLimit {
  value: number;
  unit: 'kph' | 'mph';
  detectionMethod: 'camera' | 'gps' | 'manual';
  timestamp: string;
  location?: GeoLocation;
  imageUrl?: string;
}

export interface SpeedReading {
  value: number;
  unit: 'kph' | 'mph';
  timestamp: string;
  location?: GeoLocation;
  isOverSpeedLimit: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

// History related types
export interface SpeedHistory {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxSpeed: number;
  averageSpeed: number;
  speedUnit: 'kph' | 'mph';
  speedLimitDetections: SpeedLimitDetection[];
  overSpeedLimitEvents: OverSpeedLimitEvent[];
  route?: GeoLocation[];
}

export interface SpeedLimitDetection {
  id: string;
  timestamp: string;
  speedLimit: number;
  speedUnit: 'kph' | 'mph';
  location: GeoLocation;
  imageUrl?: string;
}

export interface OverSpeedLimitEvent {
  id: string;
  timestamp: string;
  speedLimit: number;
  actualSpeed: number;
  speedUnit: 'kph' | 'mph';
  duration: number; // in seconds
  location: GeoLocation;
}

// Session related types
export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  userId: string;
  isPremiumSession: boolean;
  timeRemaining?: number; // in seconds, for free users
}

// Application state related types
export interface AppError {
  code: string;
  message: string;
  context?: string;
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Device capability types
export interface DeviceCapabilities {
  hasCamera: boolean;
  hasGeolocation: boolean;
  hasMicrophone: boolean;
  hasMotionSensors: boolean;
  supportsPwa: boolean;
  isStandalone: boolean;
  isMobileDevice: boolean;
}

// Premium and subscription related types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}