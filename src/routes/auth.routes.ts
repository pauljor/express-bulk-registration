import { Router } from 'express';
import { getToken } from '../controllers/auth.controller';

const router = Router();

/**
 * @route   POST /auth/token
 * @desc    Get Auth0 access token
 * @access  Public
 */
router.post('/token', getToken);

export default router;
