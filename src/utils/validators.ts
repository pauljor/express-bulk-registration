import { body } from 'express-validator';
import { UserRole } from '../types';

export const createUserValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .trim()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
  body('given_name').optional().trim(),
  body('family_name').optional().trim(),
  body('name').optional().trim(),
];

export const updateUserValidation = [
  body('given_name').optional().trim(),
  body('family_name').optional().trim(),
  body('name').optional().trim(),
  body('role')
    .optional()
    .trim()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
  body('password')
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const bulkCreateValidation = [
  body('criteria')
    .trim()
    .isIn(['all', 'role'])
    .withMessage('Criteria must be either "all" or "role"'),
  body('role')
    .optional()
    .trim()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
];

export const bulkDeleteValidation = [
  body('criteria')
    .trim()
    .isIn(['all', 'role'])
    .withMessage('Criteria must be either "all" or "role"'),
  body('role')
    .optional()
    .trim()
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(', ')}`),
  body('confirm')
    .optional()
    .isBoolean()
    .withMessage('Confirm must be a boolean value'),
];
