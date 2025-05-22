// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  CURRENT_USER: "/api/auth/me",
  CHANGE_PASSWORD: "/api/auth/change-password",
  VERIFY_EMAIL: "/api/auth/verify-email",
  GOOGLE_AUTH: "/api/auth/google",
  APPLE_AUTH: "/api/auth/apple",
  
  // User endpoints
  UPDATE_PROFILE: "/api/users/profile",
  USER_PREFERENCES: "/api/users/preferences",
  SELECTED_CATEGORIES: "/api/users/preferences/categories",
  NOTIFICATION_PREFERENCES: "/api/users/preferences/notifications",
  
  // Post endpoints
  POSTS: "/api/posts",
  USER_POSTS: "/api/posts/user",
  SAVED_POSTS: "/api/posts/saved",
  FOLLOWED_POSTS: "/api/posts/followed",
  
  // Category endpoints
  CATEGORIES: "/api/categories",
  SUBCATEGORIES: "/api/subcategories",
};

// Post categories
export const POST_CATEGORIES = [
  { id: "announcement", name: "Announcement", icon: "campaign" },
  { id: "event", name: "Event", icon: "event" },
  { id: "traffic_alert", name: "Traffic Alert", icon: "traffic" },
  { id: "looking_for", name: "Looking For", icon: "search" },
  { id: "rental_to_let", name: "Rental To-Let", icon: "house" },
  { id: "reviews", name: "Reviews", icon: "star_rate" },
  { id: "recommendations", name: "Recommendations", icon: "recommend" },
  { id: "news", name: "News", icon: "newspaper" },
  { id: "citizen_reporter", name: "Citizen Reporter", icon: "record_voice_over" },
  { id: "community_services", name: "Community Services", icon: "people" },
  { id: "health_capsule", name: "Health Capsule", icon: "health_and_safety" },
  { id: "science_knowledge", name: "Science & Knowledge", icon: "school" },
  { id: "article", name: "Article", icon: "description" },
  { id: "jobs", name: "Jobs", icon: "work" },
  { id: "help", name: "Help", icon: "help" },
  { id: "sale", name: "Sale", icon: "sell" },
  { id: "property", name: "Property", icon: "home" },
  { id: "rental_required", name: "Rental Required", icon: "apartment" },
  { id: "promotion", name: "Promotion", icon: "local_offer" },
  { id: "page_3", name: "Page 3", icon: "menu_book" },
];

// Locations
export const LOCATIONS = [
  { id: "amritsar", name: "Amritsar" },
  { id: "jalandhar", name: "Jalandhar" },
  { id: "ludhiana", name: "Ludhiana" },
  { id: "chandigarh", name: "Chandigarh" },
  { id: "gurugram", name: "Gurugram" },
];

// Default selected categories
export const DEFAULT_SELECTED_CATEGORIES = ["announcement", "event", "news"];

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  all: true,
  announcements: true,
  events: true,
  news: true,
  jobs: false,
  sale: false,
  property: false,
};
