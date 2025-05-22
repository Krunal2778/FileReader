import jwt from 'jsonwebtoken';
import { TokenPayload } from '@shared/types';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'notice-board-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT token for a user
 * @param payload Data to include in the token
 * @returns Signed JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns Decoded token payload
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
