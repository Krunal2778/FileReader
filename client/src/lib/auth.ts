import { apiRequest } from "./queryClient";
import { API_ENDPOINTS } from "./constants";

export interface AuthResponse {
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

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiRequest("POST", API_ENDPOINTS.LOGIN, { email, password });
    const data = await response.json();
    
    if (data.status !== "success" || !data.data) {
      throw new Error(data.message || "Login failed");
    }
    
    return data.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerUser(userData: any): Promise<AuthResponse> {
  try {
    const response = await apiRequest("POST", API_ENDPOINTS.REGISTER, userData);
    const data = await response.json();
    
    if (data.status !== "success" || !data.data) {
      throw new Error(data.message || "Registration failed");
    }
    
    return data.data;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await fetch(API_ENDPOINTS.CURRENT_USER, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error("Failed to get current user");
    }
    
    const data = await response.json();
    
    if (data.status !== "success" || !data.data) {
      throw new Error(data.message || "Failed to get user data");
    }
    
    return data.data.user;
  } catch (error: any) {
    console.error("Get current user error:", error);
    throw error;
  }
}

export async function updateUserProfile(userData: any) {
  try {
    const response = await apiRequest("PATCH", API_ENDPOINTS.UPDATE_PROFILE, userData);
    const data = await response.json();
    
    if (data.status !== "success" || !data.data) {
      throw new Error(data.message || "Update profile failed");
    }
    
    return data.data;
  } catch (error: any) {
    console.error("Update profile error:", error);
    throw error;
  }
}

export async function changePassword(passwords: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const response = await apiRequest("POST", API_ENDPOINTS.CHANGE_PASSWORD, passwords);
    const data = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.message || "Password change failed");
    }
    
    return data;
  } catch (error: any) {
    console.error("Change password error:", error);
    throw error;
  }
}
