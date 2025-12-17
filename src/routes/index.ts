import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = Router();

/**
 * Health check endpoint (no auth required)
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Authentication routes
 */
router.use('/auth', authRoutes);

/**
 * User management routes
 */
router.use('/users', userRoutes);

export default router;
