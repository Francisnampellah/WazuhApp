"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./logger"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const appName = 'NodeApp';
const appVersion = '1.0.0';
// Middleware to parse JSON
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    logger_1.default.info('Incoming request', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        timestamp: new Date().toISOString()
    });
    // Log response when it finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.default.info('Request completed', {
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
app.get('/health', (req, res) => {
    logger_1.default.debug('Health check requested');
    res.json({
        status: 'healthy',
        appName,
        appVersion,
        timestamp: new Date().toISOString()
    });
});
// Main endpoint
app.get('/', (req, res) => {
    logger_1.default.info('Home page accessed');
    res.json({
        message: 'Hello from Node.js with Winston logging!',
        appName,
        appVersion,
        timestamp: new Date().toISOString()
    });
});
// Test endpoint for different log levels
app.get('/test-logs', (req, res) => {
    logger_1.default.debug('This is a debug message');
    logger_1.default.info('This is an info message');
    logger_1.default.warn('This is a warning message');
    logger_1.default.error('This is an error message');
    res.json({
        message: 'Test logs generated',
        timestamp: new Date().toISOString()
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    logger_1.default.error('Unhandled error', {
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
app.use('*', (req, res) => {
    logger_1.default.warn('404 - Route not found', {
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
    logger_1.default.info('Application started', {
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
    logger_1.default.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.default.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=app.js.map