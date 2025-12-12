/**
 * Advanced Logging Middleware
 * Structured logging for production monitoring
 */

const logger = {
    levels: {
        ERROR: 'ERROR',
        WARN: 'WARN',
        INFO: 'INFO',
        DEBUG: 'DEBUG'
    },

    log(level, message, meta = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...meta,
            environment: process.env.NODE_ENV || 'development',
            service: 'mern-backend'
        };

        // In production, this would go to a logging service (CloudWatch, LogDNA, etc.)
        console.log(JSON.stringify(logEntry));
    },

    error(message, error = {}, meta = {}) {
        this.log(this.levels.ERROR, message, {
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            },
            ...meta
        });
    },

    warn(message, meta = {}) {
        this.log(this.levels.WARN, message, meta);
    },

    info(message, meta = {}) {
        this.log(this.levels.INFO, message, meta);
    },

    debug(message, meta = {}) {
        if (process.env.NODE_ENV !== 'production') {
            this.log(this.levels.DEBUG, message, meta);
        }
    }
};

// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log when response finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        logger.info('HTTP Request', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });

    next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
    logger.error('Application Error', err, {
        method: req.method,
        path: req.path,
        ip: req.ip
    });

    next(err);
};

module.exports = { logger, requestLogger, errorLogger };
