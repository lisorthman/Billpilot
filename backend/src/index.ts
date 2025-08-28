import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { config } from './config/server';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscriptions';
import userRoutes from './routes/users';
import notificationRoutes from './routes/notifications';
import analyticsRoutes from './routes/analytics';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BillPilot API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 BillPilot API server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
