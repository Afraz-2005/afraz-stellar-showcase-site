import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Device fingerprinting utilities
export const generateDeviceFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
      navigator.deviceMemory,
      navigator.platform,
      navigator.cookieEnabled,
      navigator.doNotTrack,
      canvas.toDataURL().slice(0, 50), // Canvas fingerprint
      window.devicePixelRatio,
      navigator.maxTouchPoints,
      'ontouchstart' in window,
      'onorientationchange' in window,
      // Additional fingerprinting data
      navigator.vendor,
      navigator.product,
      navigator.productSub,
      navigator.appName,
      navigator.appVersion,
      navigator.appCodeName,
      // WebGL fingerprinting
      getWebGLFingerprint(),
    ].join('|');
    
    // Create a hash of the fingerprint
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `device_${Math.abs(hash).toString(36)}`;
  } catch (error) {
    // Fallback to simpler fingerprint if canvas/webgl fails
    const simpleFingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform,
    ].join('|');
    
    let hash = 0;
    for (let i = 0; i < simpleFingerprint.length; i++) {
      const char = simpleFingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return `device_${Math.abs(hash).toString(36)}`;
  }
};

// WebGL fingerprinting for additional uniqueness
const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'no-webgl';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
    
    return gl.getParameter(gl.RENDERER);
  } catch (error) {
    return 'webgl-error';
  }
};

// Generate consistent user ID with device fingerprinting
export const generateUserId = () => {
  const deviceId = generateDeviceFingerprint();
  const timestamp = Date.now().toString(36);
  return `${deviceId}_${timestamp}`;
};

// Get or create user ID from localStorage
export const getOrCreateUserId = () => {
  const storageKey = 'afraz_chatbot_user_id';
  
  // Try to get existing user ID
  const existingId = localStorage.getItem(storageKey);
  if (existingId) {
    return existingId;
  }
  
  // Generate new user ID
  const newId = generateUserId();
  localStorage.setItem(storageKey, newId);
  return newId;
};

// Get user name from localStorage
export const getUserName = () => {
  return localStorage.getItem('afraz_chatbot_user_name');
};

// Set user name in localStorage
export const setUserName = (name: string) => {
  localStorage.setItem('afraz_chatbot_user_name', name);
};
