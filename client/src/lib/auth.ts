import { apiRequest } from "./queryClient";
import { API_BASE_URL, AUTH_TOKEN_KEY } from "./constants";

interface AuthResponse {
  user: {
    id: number;
    uuid: string;
    username: string;
    email: string;
    name: string;
    profileImage?: string;
    role: string;
    location: string;
  };
  token: string;
}

// Login user
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/auth/login", { email, password });
  const data = await response.json();
  return data.data;
}

// Register user
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  name: string;
  location: string;
  phone?: string;
  visibility?: string;
}): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/auth/register", userData);
  const data = await response.json();
  return data.data;
}

// Get current user
export async function getCurrentUser() {
  const response = await apiRequest("GET", "/auth/me");
  const data = await response.json();
  return data.data.user;
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await apiRequest("POST", "/auth/change-password", {
    currentPassword,
    newPassword
  });
  const data = await response.json();
  return data.data;
}

// Update user profile
export async function updateUserProfile(userData: {
  name?: string;
  phone?: string;
  visibility?: string;
  profileImage?: string;
}) {
  const response = await apiRequest("PATCH", "/users/profile", userData);
  const data = await response.json();
  return data.data;
}

// Get user preferences
export async function getUserPreferences() {
  const response = await apiRequest("GET", "/users/preferences");
  const data = await response.json();
  return data.data;
}

// Update user preferences
export async function updateUserPreferences(preferences: {
  selectedCategories?: string[];
  notificationPreferences?: Record<string, boolean>;
}) {
  const response = await apiRequest("PATCH", "/users/preferences", preferences);
  const data = await response.json();
  return data.data;
}

// Google OAuth login URL
export function getGoogleLoginUrl() {
  return `${API_BASE_URL}/auth/google`;
}

// Apple OAuth login URL
export function getAppleLoginUrl() {
  return `${API_BASE_URL}/auth/apple`;
}