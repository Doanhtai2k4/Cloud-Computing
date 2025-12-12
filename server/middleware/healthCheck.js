const mongoose = require('mongoose');

/**
 * Health Check Middleware for Production Monitoring
 * Endpoints: /api/health, /api/health/ready, /api/health/live
 */

// Basic health check
const healthCheck = (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'MERN Backend API',
        version: process.env.npm_package_version || '1.0.0'
    });
};

// Readiness probe - check if service can handle requests
const readinessCheck = async (req, res) => {
    const checks = {
        database: 'DOWN',
        memory: 'DOWN',
        timestamp: new Date().toISOString()
    };

    try {
        // Check database connection
        if (mongoose.connection.readyState === 1) {
            checks.database = 'UP';
        }

        // Check memory usage
        const memUsage = process.memoryUsage();
        const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
        
        if (memUsagePercent < 90) {
            checks.memory = 'UP';
            checks.memoryUsage = {
                heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                percentage: `${memUsagePercent.toFixed(2)}%`
            };
        }

        const isReady = checks.database === 'UP' && checks.memory === 'UP';

        res.status(isReady ? 200 : 503).json({
            status: isReady ? 'READY' : 'NOT_READY',
            checks
        });
    } catch (error) {
        res.status(503).json({
            status: 'NOT_READY',
            checks,
            error: error.message
        });
    }
};

// Liveness probe - check if service is alive
const livenessCheck = (req, res) => {
    const uptime = process.uptime();
    
    // If service has been running and is responsive, it's alive
    res.status(200).json({
        status: 'ALIVE',
        uptime: uptime,
        timestamp: new Date().toISOString()
    });
};

// Detailed system metrics
const metricsCheck = (req, res) => {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    res.status(200).json({
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
            rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            external: `${(memUsage.external / 1024 / 1024).toFixed(2)} MB`
        },
        cpu: {
            user: `${(cpuUsage.user / 1000000).toFixed(2)} ms`,
            system: `${(cpuUsage.system / 1000000).toFixed(2)} ms`
        },
        database: {
            status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            readyState: mongoose.connection.readyState
        },
        environment: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch
        }
    });
};

module.exports = {
    healthCheck,
    readinessCheck,
    livenessCheck,
    metricsCheck
};
