import { Request, Response, NextFunction } from 'express';

// Error handler middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  // Default error message and status
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Record<string, string[]> | undefined = undefined;
  
  // Handle different types of errors
  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  
  if (err.message) {
    message = err.message;
  }
  
  if (err.errors) {
    errors = err.errors;
  }
  
  // Handle specific error cases
  
  // Database constraint violations
  if (err.code === '23505') { // Unique violation
    statusCode = 409;
    message = 'A record with this information already exists.';
    
    // Try to extract the constraint and field name
    const match = err.detail?.match(/Key \((.*?)\)=/);
    if (match) {
      const field = match[1];
      errors = {
        [field]: [`The ${field} already exists.`]
      };
    }
  }
  
  if (err.code === '23503') { // Foreign key violation
    statusCode = 400;
    message = 'Invalid reference to another record.';
  }
  
  // Send the error response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors })
  });
};

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;
  
  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    
    // Ensures proper instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
  
  static badRequest(message: string, errors?: Record<string, string[]>) {
    return new ApiError(400, message, errors);
  }
  
  static unauthorized(message: string = 'Authentication required') {
    return new ApiError(401, message);
  }
  
  static forbidden(message: string = 'Access denied') {
    return new ApiError(403, message);
  }
  
  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message);
  }
  
  static conflict(message: string, errors?: Record<string, string[]>) {
    return new ApiError(409, message, errors);
  }
  
  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message);
  }
}
