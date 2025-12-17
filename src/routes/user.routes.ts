import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  bulkCreateUsers,
} from '../controllers/user.controller';
import { checkJwt, jwtErrorHandler } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { createUserValidation, updateUserValidation } from '../utils/validators';

const router = Router();

/**
 * All routes require JWT authentication
 */
router.use(checkJwt);
router.use(jwtErrorHandler);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Protected
 */
router.post('/', createUserValidation, createUser);

/**
 * @route   POST /api/users/bulk
 * @desc    Bulk user registration via CSV upload
 * @access  Protected
 */
router.post('/bulk', upload.single('file'), bulkCreateUsers);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Protected
 */
router.get('/', getUsers);

/**
 * @route   GET /api/users/:email
 * @desc    Get user by email
 * @access  Protected
 */
router.get('/:email', getUserByEmail);

/**
 * @route   PUT /api/users/:email
 * @desc    Update user by email
 * @access  Protected
 */
router.put('/:email', updateUserValidation, updateUser);

/**
 * @route   DELETE /api/users/:email
 * @desc    Delete user by email
 * @access  Protected
 */
router.delete('/:email', deleteUser);

export default router;
