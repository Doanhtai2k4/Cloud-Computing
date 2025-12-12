/**
 * Rate Limiting Middleware
 * Prevents abuse and DDoS attacks
 */

const rateLimitStore = new Map();

// Simple in-memory rate limiter (for production, use Redis)
const rateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // limit each IP to 100 requests per windowMs
        message = 'Too many requests from this IP, please try again later.',
        statusCode = 429
    } = options;

    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        // Get or create record for this IP
        let record = rateLimitStore.get(key);
        
        if (!record) {
            record = {
                count: 0,
                resetTime: now + windowMs
            };
            rateLimitStore.set(key, record);
        }

        // Reset if window expired
        if (now > record.resetTime) {
            record.count = 0;
            record.resetTime = now + windowMs;
        }

        // Increment counter
        record.count++;

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
        res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

        // Check if limit exceeded
        if (record.count > max) {
            return res.status(statusCode).json({
                error: message,
                retryAfter: Math.ceil((record.resetTime - now) / 1000)
            });
        }

        next();
    };
};

// Cleanup old entries every 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (now > record.resetTime + 60000) { // 1 minute grace period
            rateLimitStore.delete(key);
        }
    }
}, 10 * 60 * 1000);

module.exports = { rateLimit };
