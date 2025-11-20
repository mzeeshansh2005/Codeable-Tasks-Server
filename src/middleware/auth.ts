import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/firebase.js';
import { DecodedIdToken } from 'firebase-admin/auth';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

/**
 * Authentication middleware that verifies Firebase ID tokens
 * Expects the token in the Authorization header as "Bearer <token>"
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        status: 'error',
        message: 'No authorization header provided',
      });
      return;
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'No token provided',
      });
      return;
    }
    // Verify the token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(token);

    // Attach the decoded token to the request object
    req.user = decodedToken;

    // Continue to the next middleware or route handler
    next();
  } catch (error: any) {
    console.error('Authentication error:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/id-token-expired') {
      res.status(401).json({
        status: 'error',
        message: 'Token has expired',
      });
      return;
    }

    if (error.code === 'auth/argument-error') {
      res.status(401).json({
        status: 'error',
        message: 'Invalid token format',
      });
      return;
    }

    // Generic authentication failure
    res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token is provided
 * Useful for routes that work with or without authentication
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

      if (token) {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we just continue without setting user
    console.warn('Optional auth failed:', error);
    next();
  }
};
