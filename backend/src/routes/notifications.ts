import { Router, Response } from 'express';
import { param } from 'express-validator';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply authentication to all notification routes
router.use(authenticateToken);

// Routes
router.get('/', (req: AuthRequest, res) => {
  // TODO: Get all notifications for the authenticated user
  res.json({ message: 'Get notifications - to be implemented' });
});

router.get('/unread', (req: AuthRequest, res) => {
  // TODO: Get unread notifications
  res.json({ message: 'Get unread notifications - to be implemented' });
});

router.patch('/:id/read', [
  param('id').isUUID().withMessage('Invalid notification ID')
], (req: AuthRequest, res: Response) => {
  // TODO: Mark notification as read
  res.json({ message: 'Mark notification as read - to be implemented' });
});

router.patch('/read-all', (req: AuthRequest, res) => {
  // TODO: Mark all notifications as read
  res.json({ message: 'Mark all notifications as read - to be implemented' });
});

router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid notification ID')
], (req: AuthRequest, res: Response) => {
  // TODO: Delete notification
  res.json({ message: 'Delete notification - to be implemented' });
});

router.delete('/clear-read', (req: AuthRequest, res) => {
  // TODO: Clear all read notifications
  res.json({ message: 'Clear read notifications - to be implemented' });
});

export default router;
