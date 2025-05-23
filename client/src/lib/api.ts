import { apiRequest } from './queryClient';
import { API_BASE_URL } from './constants';

// Auth APIs
export async function login(email: string, password: string) {
  const response = await apiRequest('POST', '/auth/login', { username: email, password });
  return response.json();
}

export async function register(userData: {
  username: string;
  email: string;
  password: string;
  name: string;
  location: string;
  phone?: string;
  visibility?: string;
}) {
  const response = await apiRequest('POST', '/auth/register', userData);
  return response.json();
}

export async function getCurrentUser() {
  const response = await apiRequest('GET', '/auth/me');
  return response.json();
}

// Categories APIs
export async function getCategories() {
  const response = await apiRequest('GET', '/categories');
  return response.json();
}

export async function getSubcategories(categoryId?: number) {
  const url = categoryId ? `/subcategories?categoryId=${categoryId}` : '/subcategories';
  const response = await apiRequest('GET', url);
  return response.json();
}

// Posts APIs
export async function getPosts(params: Record<string, any> = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  const url = queryString ? `/posts?${queryString}` : '/posts';
  
  const response = await apiRequest('GET', url);
  return response.json();
}

export async function getPostById(id: number) {
  const response = await apiRequest('GET', `/posts/${id}`);
  return response.json();
}

export async function createPost(postData: any) {
  const response = await apiRequest('POST', '/posts', postData);
  return response.json();
}

export async function updatePost(id: number, postData: any) {
  const response = await apiRequest('PUT', `/posts/${id}`, postData);
  return response.json();
}

export async function deletePost(id: number) {
  const response = await apiRequest('DELETE', `/posts/${id}`);
  return response.json();
}

// User Preferences APIs
export async function getUserPreferences() {
  const response = await apiRequest('GET', '/users/preferences');
  return response.json();
}

export async function updateUserPreferences(preferencesData: any) {
  const response = await apiRequest('PATCH', '/users/preferences', preferencesData);
  return response.json();
}

// Post interactions
export async function likePost(postId: number) {
  const response = await apiRequest('POST', `/posts/${postId}/like`);
  return response.json();
}

export async function unlikePost(postId: number) {
  const response = await apiRequest('DELETE', `/posts/${postId}/like`);
  return response.json();
}

export async function savePost(postId: number) {
  const response = await apiRequest('POST', `/posts/${postId}/save`);
  return response.json();
}

export async function unsavePost(postId: number) {
  const response = await apiRequest('DELETE', `/posts/${postId}/save`);
  return response.json();
}

export async function followPost(postId: number) {
  const response = await apiRequest('POST', `/posts/${postId}/follow`);
  return response.json();
}

export async function unfollowPost(postId: number) {
  const response = await apiRequest('DELETE', `/posts/${postId}/follow`);
  return response.json();
}

export async function getComments(postId: number) {
  const response = await apiRequest('GET', `/posts/${postId}/comments`);
  return response.json();
}

export async function addComment(postId: number, content: string) {
  const response = await apiRequest('POST', `/posts/${postId}/comments`, { content });
  return response.json();
}

export async function deleteComment(postId: number, commentId: number) {
  const response = await apiRequest('DELETE', `/posts/${postId}/comments/${commentId}`);
  return response.json();
}

// User profile
export async function updateUserProfile(userData: {
  name?: string;
  phone?: string;
  visibility?: string;
  profileImage?: string;
}) {
  const response = await apiRequest('PATCH', '/users/profile', userData);
  return response.json();
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await apiRequest('POST', '/auth/change-password', {
    currentPassword,
    newPassword
  });
  return response.json();
}