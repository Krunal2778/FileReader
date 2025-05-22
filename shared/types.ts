import { z } from 'zod';

// Auth related types
export const TokenPayload = z.object({
  id: z.number(),
  uuid: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin'])
});

export type TokenPayload = z.infer<typeof TokenPayload>;

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

// API response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Location type
export const locations = ['amritsar', 'jalandhar', 'ludhiana', 'chandigarh', 'gurugram'] as const;
export type Location = typeof locations[number];

// Post category types
export const postCategories = [
  'announcement', 'event', 'traffic_alert', 'looking_for', 'rental_to_let',
  'reviews', 'recommendations', 'news', 'citizen_reporter', 'community_services',
  'health_capsule', 'science_knowledge', 'article', 'jobs', 'help',
  'sale', 'property', 'rental_required', 'promotion', 'page_3'
] as const;

export type PostCategory = typeof postCategories[number];

// Post with related information
export interface PostWithDetails {
  id: number;
  uuid: string;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
    displayName: string;
  };
  subcategory?: {
    id: number;
    name: string;
    displayName: string;
  };
  location: string;
  locationDetails: string;
  imageUrl?: string;
  visibility: 'public' | 'private';
  metadata?: Record<string, string>;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    uuid: string;
    name: string;
    username: string;
    profileImage?: string;
  };
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowed?: boolean;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Filter types
export interface PostFilterParams extends PaginationParams {
  category?: string;
  location?: string;
  search?: string;
  userId?: number;
  saved?: boolean;
  followed?: boolean;
}
