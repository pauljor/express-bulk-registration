import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import auth0Service from '../services/auth0.service';
import csvService from '../services/csv.service';
import logger from '../utils/logger';
import { ApiResponse, CreateUserRequest, UpdateUserRequest, BulkDeleteCriteria, BulkCreateCriteria } from '../types';

/**
 * @swagger
 * /users/single/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Register a single user in Auth0 with a specified role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
    }

    const userData: CreateUserRequest = req.body;

    const user = await auth0Service.createUser(userData);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User created successfully',
    };

    res.status(201).json(response);
  } catch (error: any) {
    logger.error('Error in createUser controller', error);
    next(error);
  }
};

/**
 * @swagger
 * /users/all/fetch:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a paginated list of all users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number (0-indexed)
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         users:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/UserResponse'
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         per_page:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const perPage = parseInt(req.query.per_page as string) || 50;

    const result = await auth0Service.getUsers(page, perPage);

    const response: ApiResponse = {
      success: true,
      data: {
        users: result.users,
        total: result.total,
        page,
        per_page: perPage,
      },
      message: 'Users retrieved successfully',
    };

    res.json(response);
  } catch (error: any) {
    logger.error('Error in getUsers controller', error);
    next(error);
  }
};

/**
 * @swagger
 * /users/{email}/fetch:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by email
 *     description: Retrieve a single user by their email address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User's email address
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;

    const user = await auth0Service.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found',
      });
    }

    const response: ApiResponse = {
      success: true,
      data: user,
       message: 'User retrieved successfully',
    };

    res.json(response);
  } catch (error: any) {
    logger.error('Error in getUserByEmail controller', error);
    next(error);
  }
};

/**
 * @swagger
 * /users/{email}/update:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by email
 *     description: Update user information identified by email address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email } = req.params;
    const updateData: UpdateUserRequest = {
      email,
      ...req.body,
    };

    const user = await auth0Service.updateUser(email, updateData);

    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User updated successfully',
    };

    res.json(response);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found',
      });
    }
    logger.error('Error in updateUser controller', error);
    next(error);
  }
};

/**
 * @swagger
 * /users/{email}/delete:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by email
 *     description: Delete a user identified by email address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: User's email address
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;

    await auth0Service.deleteUser(email);

    const response: ApiResponse = {
      success: true,
      data: email,
      message: 'User deleted successfully',
    };

    res.json(response);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found',
      });
    }
    logger.error('Error in deleteUser controller', error);
    next(error);
  }
};

/**
 * @swagger
 * /users/bulk/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Bulk user registration via CSV with criteria filtering
 *     description: Upload a CSV file to register multiple users at once with optional role filtering
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - criteria
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with user data (email, password, role, given_name, family_name, name)
 *               criteria:
 *                 type: string
 *                 enum: [all, role]
 *                 description: Filter criteria - 'all' to create all users, 'role' to filter by specific role
 *               role:
 *                 type: string
 *                 enum: [staff, teacher, student]
 *                 description: Required when criteria is 'role' - only users with this role will be created
 *     responses:
 *       200:
 *         description: Bulk upload completed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BulkUploadResult'
 *       400:
 *         description: No file uploaded, invalid file, or validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const bulkCreateUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No file uploaded',
      });
    }

    const filePath = req.file.path;
    const criteria: BulkCreateCriteria = {
      criteria: req.body.criteria,
      role: req.body.role,
    };

    // Validate role criteria
    if (criteria.criteria === 'role' && !criteria.role) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Role is required when criteria is "role"',
      });
    }

    const result = await csvService.processBulkRegistration(filePath, criteria);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: `Bulk upload completed: ${result.successCount} succeeded, ${result.failureCount} failed`,
    };

    res.json(response);
  } catch (error: any) {
    logger.error('Error in bulkCreateUsers controller', error);
    next(error);
  }
};

/**
 * @swagger
 * /users/bulk/delete:
 *   post:
 *     tags:
 *       - Users
 *     summary: Bulk delete users by criteria
 *     description: Delete multiple users based on criteria (all users or by role)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkDeleteCriteria'
 *     responses:
 *       200:
 *         description: Bulk delete completed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/BulkDeleteResult'
 *       400:
 *         description: Invalid criteria or missing confirmation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
export const bulkDeleteUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const criteria: BulkDeleteCriteria = req.body;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
    }

    // Safety check for deleting all users
    if (criteria.criteria === 'all' && criteria.confirm !== true) {
      return res.status(400).json({
        success: false,
        error: 'Confirmation Required',
        message: 'Deleting all users requires explicit confirmation. Set "confirm: true" in request body.',
      });
    }

    // Validate role criteria
    if (criteria.criteria === 'role' && !criteria.role) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Role is required when criteria is "role"',
      });
    }

    const result = await auth0Service.deleteUsersByCriteria(criteria);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: `Bulk delete completed: ${result.deletedCount} users deleted, ${result.failedCount} failed`,
    };

    res.json(response);
  } catch (error: any) {
    logger.error('Error in bulkDeleteUsers controller', error);
    next(error);
  }
};
