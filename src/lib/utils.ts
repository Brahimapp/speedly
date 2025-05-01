import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes and handles conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a speed value with the given unit
 */
export function formatSpeed(speed: number, unit: 'kph' | 'mph' = 'kph'): string {
  return `${Math.round(speed)} ${unit}`;
}

/**
 * Converts kilometers per hour to miles per hour
 */
export function kphToMph(speed: number): number {
  return speed * 0.621371;
}

/**
 * Converts miles per hour to kilometers per hour
 */
export function mphToKph(speed: number): number {
  return speed * 1.60934;
}

/**
 * Formats a date object to a human-readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

/**
 * Truncates text to a specified length and adds ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Debounces a function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Checks if the current device is mobile based on screen width
 */
export function isMobileDevice(): boolean {
  return window.innerWidth <= 768;
}

/**
 * Checks if the device supports camera
 */
export function deviceSupportsCamera(): boolean {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
}

/**
 * Checks if the device supports geolocation
 */
export function deviceSupportsGeolocation(): boolean {
  return 'geolocation' in navigator;
}