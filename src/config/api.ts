// API Configuration for different environments
const isDevelopment = import.meta.env.DEV;

// Your Render server URL (replace with your actual URL after deployment)
const PRODUCTION_API_URL = 'https://your-render-app-name.onrender.com';
const DEVELOPMENT_API_URL = 'http://localhost:3001';

export const API_BASE_URL = isDevelopment ? DEVELOPMENT_API_URL : PRODUCTION_API_URL;

export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/api/chat`,
  // For relative URLs (like in ChatWindow), use this
  chatRelative: '/api/chat',
  // Add other endpoints here as needed
}; 