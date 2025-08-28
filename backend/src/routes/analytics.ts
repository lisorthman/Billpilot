import { Router } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply authentication to all analytics routes
router.use(authenticateToken);

// Routes
router.get('/spending', (req: AuthRequest, res) => {
  // TODO: Get spending analytics
  res.json({ message: 'Get spending analytics - to be implemented' });
});

router.get('/spending/category', (req: AuthRequest, res) => {
  // TODO: Get spending by category
  res.json({ message: 'Get spending by category - to be implemented' });
});

router.get('/spending/monthly', (req: AuthRequest, res) => {
  // TODO: Get monthly spending trend
  res.json({ message: 'Get monthly spending trend - to be implemented' });
});

router.get('/budget/insights', (req: AuthRequest, res) => {
  // TODO: Get budget insights
  res.json({ message: 'Get budget insights - to be implemented' });
});

router.get('/savings/opportunities', (req: AuthRequest, res) => {
  // TODO: Get savings opportunities
  res.json({ message: 'Get savings opportunities - to be implemented' });
});

router.get('/upcoming/bills', (req: AuthRequest, res) => {
  // TODO: Get upcoming bills analytics
  res.json({ message: 'Get upcoming bills analytics - to be implemented' });
});

export default router;
