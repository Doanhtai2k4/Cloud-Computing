# backend/Dockerfile (JS)
FROM node:20-alpine

WORKDIR /app

# Copy package files explicitly
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 
EXPOSE 4000

# Environment variables (can be overridden at runtime)
ENV PORT=4000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:4000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => { process.exit(1); });"

# Start app
CMD ["npm", "start"]
