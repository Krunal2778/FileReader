import { z } from 'zod';
import { locations, postCategories } from './types';

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Registration validation
export const registrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number').optional(),
  location: z.enum(locations as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid location' }),
  }),
  visibility: z.enum(['public', 'private']).default('public'),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

// Selected categories validation
export const selectedCategoriesSchema = z.object({
  categories: z.array(z.enum(postCategories as [string, ...string[]])).min(1, 'Select at least one category'),
});

export type SelectedCategoriesInput = z.infer<typeof selectedCategoriesSchema>;

// Notification preferences validation
export const notificationPreferencesSchema = z.object({
  preferences: z.record(z.boolean()).refine(
    (val) => Object.keys(val).length > 0,
    { message: 'At least one notification preference is required' }
  ),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;

// Post creation validation
export const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.number(),
  subcategoryId: z.number().optional(),
  location: z.enum(locations as [string, ...string[]]),
  locationDetails: z.string().max(100, 'Location details cannot exceed 100 characters'),
  imageUrl: z.string().url().optional(),
  visibility: z.enum(['public', 'private']).default('public'),
  metadata: z.record(z.string()).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

// Comment validation
export const createCommentSchema = z.object({
  postId: z.number(),
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment is too long'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// Profile update validation
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Invalid phone number').optional(),
  location: z.enum(locations as [string, ...string[]]).optional(),
  visibility: z.enum(['public', 'private']).optional(),
  profileImage: z.string().url().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Password change validation
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
