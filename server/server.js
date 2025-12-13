const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const usersRouter = require('./routes/auth.route');
const brandLanguagesRouter = require('./routes/brandLanguages.route')
const categoryLanguagesRouter = require('./routes/categoryLanguages.route');
const languagesRouter = require('./routes/language.route')
const blogLanguagesRouter = require('./routes/blogLanguages.route');
const commentRouter = require('./routes/comment.route');

// Advanced middleware imports
const { healthCheck, readinessCheck, livenessCheck, metricsCheck } = require('./middleware/healthCheck');
const { logger, requestLogger, errorLogger } = require('./middleware/logger');
const { rateLimit } = require('./middleware/rateLimiter');

require('dotenv').config();

const app = express();

// ========================================
// SECURITY & MIDDLEWARE CONFIGURATION
// ========================================

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10mb' }));

// CORS configuration (restrict in production)
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-frontend.onrender.com']
        : '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Morgan logging (different formats for dev/prod)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting (protect against DDoS) - Only in production
if (process.env.NODE_ENV === 'production') {
    app.use('/api/', rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }));

    // Stricter rate limit for auth endpoints
    app.use('/api/v1/auth/', rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20
    }));
}

// Database connection
connectDB();

logger.info('Server initializing...', {
    nodeEnv: process.env.NODE_ENV,
    nodeVersion: process.version
});
    
const PORT = process.env.PORT || 3001;

// ========================================
// HEALTH CHECK ENDPOINTS (Kubernetes/Cloud ready)
// ========================================

// Basic health check
app.get('/api/health', healthCheck);

// Readiness probe - checks if service can accept traffic
app.get('/api/health/ready', readinessCheck);

// Liveness probe - checks if service is alive
app.get('/api/health/live', livenessCheck);

// Detailed metrics
app.get('/api/health/metrics', metricsCheck);

// ========================================
// API ROUTES
// ========================================
app.use('/api/v1/auth/', usersRouter);
app.use('/api/v1/brand/', brandLanguagesRouter);
app.use('/api/v1/category/',categoryLanguagesRouter);
app.use('/api/v1/language/', languagesRouter);
app.use('/api/v1/blog/', blogLanguagesRouter);
app.use('/api/v1/comments', commentRouter);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'MERN Stack API',
        version: '2.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            ready: '/api/health/ready',
            live: '/api/health/live',
            metrics: '/api/health/metrics'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    });
});

// ========================================
// ERROR HANDLING
// ========================================
app.use(errorLogger);

app.use((err, req, res, next) => {
    logger.error('Unhandled error', err);
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ========================================
// SERVER STARTUP
// ========================================
const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV,
        urls: {
            local: `http://localhost:${PORT}`,
            network: `http://0.0.0.0:${PORT}`
        }
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});