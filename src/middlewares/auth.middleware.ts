import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import logger from '../utils/logger';

// Extend Express Request to include auth property
declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        permissions?: string[];
        [key: string]: any;
      };
    }
  }
}

/**
 * JWT validation middleware
 * Verifies the Access Token from Auth0
 */
export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${config.auth0.issuerBaseUrl}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: config.auth0.audience,
  issuer: config.auth0.issuerBaseUrl + '/',
  algorithms: ['RS256'],
});

/**
 * Check if user has required permissions
 */
export const checkPermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const permissions = req.auth?.permissions || [];

    const hasPermission = requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );

    if (!hasPermission) {
      logger.warn(`Insufficient permissions for user: ${req.auth?.sub}`);
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have the required permissions to access this resource',
      });
    }

    next();
  };
};

/**
 * Optional JWT validation (doesn't fail if no token provided)
 */
export const optionalJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${config.auth0.issuerBaseUrl}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: config.auth0.audience,
  issuer: config.auth0.issuerBaseUrl + '/',
  algorithms: ['RS256'],
  credentialsRequired: false,
});

/**
 * Error handler for JWT validation errors
 */
export const jwtErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === 'UnauthorizedError') {
    logger.warn(`Unauthorized access attempt: ${err.message}`);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
    });
  }

  next(err);
};
