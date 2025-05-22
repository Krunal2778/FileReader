import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

/**
 * Middleware for validating request body against a Zod schema
 * @param schema Zod schema to validate against
 */
export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: formatZodError(error)
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware for validating request query parameters against a Zod schema
 * @param schema Zod schema to validate against
 */
export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          status: 'error',
          message: 'Invalid query parameters',
          errors: formatZodError(error)
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware for validating request params against a Zod schema
 * @param schema Zod schema to validate against
 */
export function validateParams<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          status: 'error',
          message: 'Invalid path parameters',
          errors: formatZodError(error)
        });
      }
      next(error);
    }
  };
}

/**
 * Format Zod errors into a more user-friendly format
 * @param error ZodError object
 * @returns Object with field names as keys and error messages as values
 */
function formatZodError(error: ZodError) {
  const formattedErrors: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const field = err.path.join('.');
    
    if (!formattedErrors[field]) {
      formattedErrors[field] = [];
    }
    
    formattedErrors[field].push(err.message);
  });
  
  return formattedErrors;
}
