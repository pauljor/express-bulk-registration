import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import logger from '../utils/logger';
import { ApiResponse } from '../types';

/**
 * @swagger
 * /api/auth/token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Get Auth0 access token
 *     description: Request an access token from Auth0 using client credentials grant
 *     responses:
 *       200:
 *         description: Access token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TokenResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
export const getToken = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenData = await authService.getAccessToken();

    const response: ApiResponse = {
      success: true,
      data: tokenData,
      message: 'Access token retrieved successfully',
    };

    res.json(response);
  } catch (error: any) {
    logger.error('Error in getToken controller', error);
    next(error);
  }
};
