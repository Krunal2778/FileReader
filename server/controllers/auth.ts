import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../middlewares/error';
import { TokenPayload } from '@shared/types';
import { LoginInput, RegistrationInput } from '@shared/validation';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body as RegistrationInput;
    
    // Check if username already exists
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      throw ApiError.conflict('Username already exists', {
        username: ['This username is already taken']
      });
    }
    
    // Check if email already exists
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      throw ApiError.conflict('Email already exists', {
        email: ['This email is already registered']
      });
    }
    
    // Create user
    const user = await storage.createUser(userData);
    
    // Create default user preferences
    await storage.createUserPreferences({
      userId: user.id,
      selectedCategories: ['announcement', 'event', 'news'],
      notificationPreferences: {
        all: true
      }
    });
    
    // Generate JWT token
    const tokenPayload: TokenPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role
    };
    
    const token = generateToken(tokenPayload);
    
    // Return user data and token
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
          location: user.location
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as LoginInput;
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }
    
    // Check if user has a password (might be OAuth user)
    if (!user.password) {
      throw ApiError.unauthorized('Please use your social login method');
    }
    
    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw ApiError.unauthorized('Invalid email or password');
    }
    
    // Generate JWT token
    const tokenPayload: TokenPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role
    };
    
    const token = generateToken(tokenPayload);
    
    // Return user data and token
    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          name: user.name,
          profileImage: user.profileImage,
          role: user.role,
          location: user.location
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const user = await storage.getUser(req.user.id);
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
          profileImage: user.profileImage,
          role: user.role,
          location: user.location,
          visibility: user.visibility,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    
    // In a real implementation, we'd verify the token here
    // For this example, we'll just update the user directly
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const updatedUser = await storage.verifyUserEmail(req.user.id);
    if (!updatedUser) {
      throw ApiError.notFound('User not found');
    }
    
    res.json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Google OAuth callback
 */
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Passport.js adds the user to req.user
    const user = req.user as any;
    if (!user) {
      throw ApiError.unauthorized('Google authentication failed');
    }
    
    // Generate JWT token
    const tokenPayload: TokenPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role
    };
    
    const token = generateToken(tokenPayload);
    
    // Redirect to frontend with token
    const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
    const domain = domains.length > 0 ? domains[0] : 'localhost:5000';
    
    res.redirect(`https://${domain}/auth/callback?token=${token}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Apple OAuth callback
 */
export const appleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Passport.js adds the user to req.user
    const user = req.user as any;
    if (!user) {
      throw ApiError.unauthorized('Apple authentication failed');
    }
    
    // Generate JWT token
    const tokenPayload: TokenPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role
    };
    
    const token = generateToken(tokenPayload);
    
    // Redirect to frontend with token
    const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
    const domain = domains.length > 0 ? domains[0] : 'localhost:5000';
    
    res.redirect(`https://${domain}/auth/callback?token=${token}`);
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    
    const { currentPassword, newPassword } = req.body;
    
    // Get user
    const user = await storage.getUser(req.user.id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    // Check if user has a password (might be OAuth user)
    if (!user.password) {
      throw ApiError.badRequest('Social login users cannot change password');
    }
    
    // Validate current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw ApiError.badRequest('Current password is incorrect', {
        currentPassword: ['Current password is incorrect']
      });
    }
    
    // Update password
    await storage.updateUser(user.id, { password: newPassword });
    
    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
