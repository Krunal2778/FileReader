import { API_BASE_URL, AUTH_TOKEN_KEY } from "./constants";
import * as api from './api';

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
  try {
    const data = await api.login(email, password);
    return data.data || data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
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
  try {
    const data = await api.register(userData);
    return data.data || data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const data = await api.getCurrentUser();
    // Handle both response formats: data.data.user or data.user
    return data.data?.user || data.user || data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const data = await api.changePassword(currentPassword, newPassword);
    return data.data || data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(userData: {
  name?: string;
  phone?: string;
  visibility?: string;
  profileImage?: string;
}) {
  try {
    const data = await api.updateUserProfile(userData);
    return data.data || data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

// Get user preferences
export async function getUserPreferences() {
  try {
    const data = await api.getUserPreferences();
    return data.data || data;
  } catch (error) {
    console.error("Error getting preferences:", error);
    throw error;
  }
}

// Update user preferences
export async function updateUserPreferences(preferences: {
  selectedCategories?: string[];
  notificationPreferences?: Record<string, boolean>;
}) {
  try {
    const data = await api.updateUserPreferences(preferences);
    return data.data || data;
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw error;
  }
}

// Google OAuth login URL
export function getGoogleLoginUrl() {
  return `${API_BASE_URL}/auth/google`;
}

// Apple OAuth login URL
export function getAppleLoginUrl() {
  return `${API_BASE_URL}/auth/apple`;
}