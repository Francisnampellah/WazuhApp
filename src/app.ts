import express, { Request, Response, NextFunction } from 'express';
import logger from './logger';

const app = express();
const PORT = process.env.PORT || 3000;
const appName = 'NodeApp';
const appVersion = '1.0.0';

// Middleware to parse JSON
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });

  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  logger.debug('Health check requested');
  res.json({
    status: 'healthy',
    appName,
    appVersion,
    timestamp: new Date().toISOString()
  });
});

// Main endpoint
app.get('/', (req: Request, res: Response) => {
  logger.info('Home page accessed');
  res.json({
    message: 'Hello from Node.js with Winston logging!',
    appName,
    appVersion,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for different log levels
app.get('/test-logs', (req: Request, res: Response) => {
  logger.debug('This is a debug message');
  logger.info('This is an info message');
  logger.warn('This is a warning message');
  logger.error('This is an error message');
  
  res.json({
    message: 'Test logs generated',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  logger.warn('404 - Route not found', {
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(404).json({
    error: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  logger.info('Application started', {
    appName,
    appVersion,
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    pid: process.pid
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app; 