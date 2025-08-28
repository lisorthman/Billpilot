import { Router, Response } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply authentication to all user routes
router.use(authenticateToken);

// Validation rules
const updateUserValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('monthlyBudget').optional().isFloat({ min: 0 }).withMessage('Monthly budget must be a positive number'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('timezone').optional().isString().withMessage('Timezone must be a string'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('notificationPreferences').optional().isObject().withMessage('Notification preferences must be an object')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Routes
router.get('/profile', (req: AuthRequest, res) => {
  // TODO: Get user profile
  res.json({ message: 'Get user profile - to be implemented' });
});

router.put('/profile', validate(updateUserValidation), (req: AuthRequest, res) => {
  // TODO: Update user profile
  res.json({ message: 'Update user profile - to be implemented' });
});

router.put('/password', validate(updatePasswordValidation), (req: AuthRequest, res) => {
  // TODO: Update user password
  res.json({ message: 'Update password - to be implemented' });
});

router.delete('/account', (req: AuthRequest, res) => {
  // TODO: Delete user account
  res.json({ message: 'Delete account - to be implemented' });
});

router.get('/:id', [
  param('id').isUUID().withMessage('Invalid user ID')
], (req: AuthRequest, res: Response) => {
  // TODO: Get user by ID (for admin purposes)
  res.json({ message: 'Get user by ID - to be implemented' });
});

export default router;
