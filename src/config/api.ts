// API Configuration for different environments
const isDevelopment = import.meta.env.DEV;

// Use relative URLs for both development and production
// This works with Vercel's serverless functions and local development
export const API_ENDPOINTS = {
  chat: '/api/chat',
  // For relative URLs (like in ChatWindow), use this
  chatRelative: '/api/chat',
  // Add other endpoints here as needed
}; 