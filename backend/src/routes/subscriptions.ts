import { Router, Response } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validation';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply authentication to all subscription routes
router.use(authenticateToken);

// Validation rules
const subscriptionValidation = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').isIn(['Entertainment', 'Utilities', 'Rent', 'Education', 'Health', 'Transport', 'Food', 'Other']).withMessage('Invalid category'),
  body('recurrence').isIn(['Weekly', 'Monthly', 'Yearly']).withMessage('Invalid recurrence'),
  body('nextDueDate').isISO8601().withMessage('Next due date must be a valid date'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('isFreeTrial').optional().isBoolean().withMessage('isFreeTrial must be a boolean'),
  body('trialEndDate').optional().isISO8601().withMessage('Trial end date must be a valid date'),
  body('autoRenew').optional().isBoolean().withMessage('autoRenew must be a boolean'),
  body('reminderDays').optional().isArray().withMessage('reminderDays must be an array')
];

const updateSubscriptionValidation = [
  param('id').isUUID().withMessage('Invalid subscription ID'),
  ...subscriptionValidation.map(validation => validation.optional())
];

// Routes
router.get('/', (req: AuthRequest, res) => {
  // TODO: Get all subscriptions for the authenticated user
  res.json({ message: 'Get subscriptions - to be implemented' });
});

router.get('/:id', [
  param('id').isUUID().withMessage('Invalid subscription ID')
], (req: AuthRequest, res: Response) => {
  // TODO: Get specific subscription by ID
  res.json({ message: 'Get subscription by ID - to be implemented' });
});

router.post('/', validate(subscriptionValidation), (req: AuthRequest, res) => {
  // TODO: Create new subscription
  res.json({ message: 'Create subscription - to be implemented' });
});

router.put('/:id', validate(updateSubscriptionValidation), (req: AuthRequest, res: Response) => {
  // TODO: Update subscription
  res.json({ message: 'Update subscription - to be implemented' });
});

router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid subscription ID')
], (req: AuthRequest, res: Response) => {
  // TODO: Delete subscription
  res.json({ message: 'Delete subscription - to be implemented' });
});

router.patch('/:id/mark-paid', [
  param('id').isUUID().withMessage('Invalid subscription ID')
], (req: AuthRequest, res: Response) => {
  // TODO: Mark subscription as paid
  res.json({ message: 'Mark as paid - to be implemented' });
});

router.get('/upcoming/bills', (req: AuthRequest, res) => {
  // TODO: Get upcoming bills
  res.json({ message: 'Get upcoming bills - to be implemented' });
});

export default router;
