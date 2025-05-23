// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const AUTH_TOKEN_KEY = 'auth_token';

// Locations
export const LOCATIONS = ['amritsar', 'jalandhar', 'ludhiana', 'chandigarh', 'gurugram'];

// Categories
export const CATEGORIES = [
  'announcement', 'event', 'traffic_alert', 'looking_for', 'rental_to_let',
  'reviews', 'recommendations', 'news', 'citizen_reporter', 'community_services',
  'health_capsule', 'science_knowledge', 'article', 'jobs', 'help',
  'sale', 'property', 'rental_required', 'promotion', 'page_3'
];