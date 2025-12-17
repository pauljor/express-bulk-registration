import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  bulkCreateUsers,
  bulkDeleteUsers,
} from '../controllers/user.controller';
import { checkJwt, jwtErrorHandler } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { createUserValidation, updateUserValidation, bulkDeleteValidation } from '../utils/validators';

const router = Router();

/**
 * All routes require JWT authentication
 */
router.use(checkJwt);
router.use(jwtErrorHandler);

/**
 * @route   POST /users/single/create
 * @desc    Create a new user
 * @access  Protected
 */
router.post('/single/create', createUserValidation, createUser);

/**
 * @route   POST /users/bulk/create
 * @desc    Bulk user registration via CSV upload
 * @access  Protected
 */
router.post('/bulk/create', upload.single('file'), bulkCreateUsers);

/**
 * @route   POST /users/bulk/delete
 * @desc    Bulk delete users by criteria
 * @access  Protected
 */
router.post('/bulk/delete', bulkDeleteValidation, bulkDeleteUsers);

/**
 * @route   GET /users/all/fetch
 * @desc    Get all users with pagination
 * @access  Protected
 */
router.get('/all/fetch', getUsers);

/**
 * @route   GET /users/:email/fetch
 * @desc    Get user by email
 * @access  Protected
 */
router.get('/:email/fetch', getUserByEmail);

/**
 * @route   PUT /users/:email/update
 * @desc    Update user by email
 * @access  Protected
 */
router.put('/:email/update', updateUserValidation, updateUser);

/**
 * @route   DELETE /users/:email/delete
 * @desc    Delete user by email
 * @access  Protected
 */
router.delete('/:email/delete', deleteUser);

export default router;
