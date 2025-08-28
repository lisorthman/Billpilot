import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('monthlyBudget').isFloat({ min: 0 }).withMessage('Monthly budget must be a positive number'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('timezone').optional().isString().withMessage('Timezone must be a string')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', validate(registerValidation), (req, res) => {
  // TODO: Implement user registration
  res.json({ message: 'Register endpoint - to be implemented' });
});

router.post('/login', validate(loginValidation), (req, res) => {
  // TODO: Implement user login
  res.json({ message: 'Login endpoint - to be implemented' });
});

router.post('/logout', authenticateToken, (req, res) => {
  // TODO: Implement logout (token blacklisting)
  res.json({ message: 'Logout successful' });
});

router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  // TODO: Return current user info
  res.json({ message: 'Get current user - to be implemented' });
});

router.post('/refresh', (req, res) => {
  // TODO: Implement token refresh
  res.json({ message: 'Refresh token endpoint - to be implemented' });
});

export default router;
