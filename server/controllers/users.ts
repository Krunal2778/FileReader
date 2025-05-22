import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { ApiError } from '../middlewares/error';
import { z } from 'zod';
import { UpdateProfileInput, SelectedCategoriesInput, NotificationPreferencesInput } from '@shared/validation';

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Get user
    const user = await storage.getUserByUuid(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    // Check if profile is private
    if (user.visibility === 'private' && (!req.user || user.id !== req.user.id)) {
      throw ApiError.forbidden('This profile is private');
    }
    
    // Get user preferences
    const preferences = await storage.getUserPreferences(user.id);
    
    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          name: user.name,
          profileImage: user.profileImage,
          location: user.location,
          visibility: user.visibility,
          createdAt: user.createdAt
        },
        preferences: preferences ? {
          selectedCategories: preferences.selectedCategories
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const userData = req.body as UpdateProfileInput;
    
    // Update user
    const user = await storage.updateUser(req.user.id, userData);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          name: user.name,
          phone: user.phone,
          profileImage: user.profileImage,
          location: user.location,
          visibility: user.visibility
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user preferences
 */
export const getUserPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    // Get user preferences
    const preferences = await storage.getUserPreferences(req.user.id);
    if (!preferences) {
      throw ApiError.notFound('Preferences not found');
    }
    
    res.json({
      status: 'success',
      data: {
        selectedCategories: preferences.selectedCategories,
        notificationPreferences: preferences.notificationPreferences
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update selected categories
 */
export const updateSelectedCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { categories } = req.body as SelectedCategoriesInput;
    
    // Get current preferences
    let preferences = await storage.getUserPreferences(req.user.id);
    
    if (preferences) {
      // Update existing preferences
      preferences = await storage.updateUserPreferences(req.user.id, {
        selectedCategories: categories
      });
    } else {
      // Create new preferences
      preferences = await storage.createUserPreferences({
        userId: req.user.id,
        selectedCategories: categories,
        notificationPreferences: { all: true }
      });
    }
    
    res.json({
      status: 'success',
      data: {
        selectedCategories: preferences.selectedCategories
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { preferences: notificationPrefs } = req.body as NotificationPreferencesInput;
    
    // Get current preferences
    let preferences = await storage.getUserPreferences(req.user.id);
    
    if (preferences) {
      // Update existing preferences
      preferences = await storage.updateUserPreferences(req.user.id, {
        notificationPreferences: notificationPrefs
      });
    } else {
      // Create new preferences with default categories
      preferences = await storage.createUserPreferences({
        userId: req.user.id,
        selectedCategories: ['announcement', 'event', 'news'],
        notificationPreferences: notificationPrefs
      });
    }
    
    res.json({
      status: 'success',
      data: {
        notificationPreferences: preferences.notificationPreferences
      }
    });
  } catch (error) {
    next(error);
  }
};
