import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { storage } from '../storage';
import { TokenPayload } from '@shared/types';

// Define a custom type for authorized request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        uuid: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to protect routes
 * Verifies the JWT token and attaches the user to the request
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Authentication required. Please log in.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token) as TokenPayload;
      const user = await storage.getUser(decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          status: 'error',
          message: 'User not found. Please log in again.'
        });
      }
      
      // Attach user to request
      req.user = {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        role: user.role
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Invalid or expired token. Please log in again.'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to optionally authorize a user
 * Verifies the JWT token if present and attaches the user to the request
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token) as TokenPayload;
      const user = await storage.getUser(decoded.id);
      
      if (user) {
        // Attach user to request
        req.user = {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          role: user.role
        };
      }
    } catch (error) {
      // Don't throw error for optional auth
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access to admin users
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      status: 'error',
      message: 'Access denied. Admin privileges required.'
    });
  }
  
  next();
};
