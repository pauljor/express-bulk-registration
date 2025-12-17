import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

/**
 * Health check endpoint (no auth required)
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * User management routes
 */
router.use('/users', userRoutes);

export default router;
